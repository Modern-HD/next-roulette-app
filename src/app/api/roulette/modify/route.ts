import drizzleClient from '@/db/drizzleClient';
import rouletteSection from '@/db/schema/rouletteSection';
import rouletteSet from '@/db/schema/rouletteSet';
import IResponse from '@/interface/IResponse';
import IRouletteSection from '@/interface/IRouletteSection';
import IRouletteSet from '@/interface/IRouletteSet';
import { getUser } from '@/util/auth/authUtil';
import { rouletteCommonValidation } from '@/util/routerUtil';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { and, eq, lt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface IRouletteModify {
    set: Pick<IRouletteSet, 'idx' | 'title' | 'description' | 'category_idx' | 'public'>;
    section: Pick<IRouletteSection, 'content' | 'location' | 'weight'>[];
}

export async function PUT(req: Request) {
    console.log('/api/roulette/modify > PUT');
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getUser(supabase);
    if (!user) return NextResponse.json<IResponse>({ code: '01', msg: '로그인 후 이용 가능합니다.', result: 'fail' });
    const body: IRouletteModify = await req.json();
    const rouletteError = rouletteCommonValidation(body);
    if (rouletteError) {
        return NextResponse.json<IResponse>(rouletteError);
    }
    const { data: userIdxData } = await supabase
        .from('roulette_set')
        .select('user_idx')
        .eq('idx', body.set.idx)
        .single();

    if (userIdxData?.user_idx !== user.idx) {
        return NextResponse.json<IResponse>({ code: '06', msg: '자신의 룰렛만 수정할 수 있습니다.', result: 'fail' });
    }

    const { idx, title, description, category_idx, public: isPublic } = body.set;
    await drizzleClient.transaction(
        async tx => {
            const now = new Date();
            await Promise.all([
                tx
                    .update(rouletteSet)
                    .set({
                        idx,
                        title,
                        description,
                        category_idx,
                        public: isPublic,
                        updated_at: now,
                    })
                    .where(eq(rouletteSet.idx, idx)),
                tx
                    .delete(rouletteSection)
                    .where(and(eq(rouletteSection.roulette_set_idx, idx), lt(rouletteSection.created_at, now))),
                tx.insert(rouletteSection).values(body.section.map(el => ({ roulette_set_idx: idx, ...el }))),
            ]);
        },
        {
            isolationLevel: 'repeatable read',
        },
    );

    return NextResponse.json<IResponse<{ setIdx: number }>>({
        code: '00',
        msg: '등록 성공',
        result: 'success',
        data: { setIdx: idx },
    });
}
