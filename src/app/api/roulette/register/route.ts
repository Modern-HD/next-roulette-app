import drizzleClient from '@/db/drizzleClient';
import rouletteSection from '@/db/schema/rouletteSection';
import rouletteSet from '@/db/schema/rouletteSet';
import IResponse from '@/interface/IResponse';
import IRouletteSection from '@/interface/IRouletteSection';
import IRouletteSet from '@/interface/IRouletteSet';
import { getUser } from '@/util/auth/authUtil';
import { rouletteCommonValidation } from '@/util/routerUtil';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface IRouletteResister {
    set: Pick<IRouletteSet, 'title' | 'description' | 'category_idx' | 'public'>;
    section: Pick<IRouletteSection, 'content' | 'location' | 'weight'>[];
}

export async function POST(req: Request) {
    console.log('/api/roulette/register > POST');
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getUser(supabase);
    if (!user) return NextResponse.json<IResponse>({ code: '01', msg: '로그인 후 이용 가능합니다.', result: 'fail' });
    const body: IRouletteResister = await req.json();
    const rouletteError = rouletteCommonValidation(body);
    if (rouletteError) {
        return NextResponse.json<IResponse>(rouletteError);
    }
    const { title, description, category_idx, public: isPublic } = body.set;
    const result = await drizzleClient.transaction(
        async tx => {
            const [{ setIdx }] = await tx
                .insert(rouletteSet)
                .values({
                    title,
                    description,
                    play_count: 0,
                    category_idx,
                    public: isPublic,
                    user_idx: user.idx,
                })
                .returning({ setIdx: rouletteSet.idx });
            await tx.insert(rouletteSection).values(body.section.map(el => ({ roulette_set_idx: setIdx, ...el })));
            return setIdx;
        },
        {
            isolationLevel: 'repeatable read',
        },
    );
    return NextResponse.json<IResponse<{ setIdx: number }>>({
        code: '00',
        msg: '등록 성공',
        result: 'success',
        data: { setIdx: result },
    });
}
