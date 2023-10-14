import drizzleClient from '@/db/drizzleClient';
import rouletteSection from '@/db/schema/rouletteSection';
import rouletteSet from '@/db/schema/rouletteSet';
import IRouletteSection from '@/interface/IRouletteSection';
import IRouletteSet from '@/interface/IRouletteSet';
import { getUser } from '@/util/auth/authUtil';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface IRouletteResister {
    set: Pick<IRouletteSet, 'title' | 'description' | 'category_idx' | 'public'>;
    section: Pick<IRouletteSection, 'content' | 'location' | 'weight'>[];
}

export async function POST(req: Request) {
    console.log('/api/roulette/register > POST');
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getUser(supabase);
    if (!user) return NextResponse.json({ code: '01', msg: '로그인 후 이용 가능합니다.', result: 'fail' });
    const body = (await req.json()) as IRouletteResister;
    if (!(body.set && body.section && body.section.length > 1))
        return NextResponse.json({ code: '02', msg: '올바르지 않는 입력입니다.', result: 'fail' });
    try {
        await drizzleClient.transaction(
            async tx => {
                const [{ setIdx }] = await tx
                    .insert(rouletteSet)
                    .values({
                        title: body.set.title,
                        description: body.set.description,
                        play_count: 0,
                        category_idx: body.set.category_idx,
                        public: body.set.public,
                        user_idx: user.idx,
                    })
                    .returning({ setIdx: rouletteSet.idx });
                await tx.insert(rouletteSection).values(body.section.map(el => ({ roulette_set_idx: setIdx, ...el })));
            },
            {
                isolationLevel: 'repeatable read',
            },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ code: '03', msg: '등록 중 오류가 발생하였습니다.', result: 'success' });
    }

    return NextResponse.json({ code: '00', msg: '등록 성공', result: 'success' });
}
