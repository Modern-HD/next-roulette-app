import drizzleClient from '@/db/drizzleClient';
import rouletteSection from '@/db/schema/rouletteSection';
import rouletteSet from '@/db/schema/rouletteSet';
import IRouletteSection from '@/interface/IRouletteSection';
import IRouletteSet from '@/interface/IRouletteSet';
import { getUser } from '@/util/auth/authUtil';
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
    if (!user) return NextResponse.json({ code: '01', msg: '로그인 후 이용 가능합니다.', result: 'fail' });
    const body = (await req.json()) as IRouletteResister;
    if (!(body.set && body.section && body.section.length > 1)) {
        return NextResponse.json({ code: '02', msg: '올바르지 않는 입력입니다.', result: 'fail' });
    }
    const { title, description, category_idx, public: isPublic } = body.set;
    if (!(title && title.length > 0 && title.length <= 20)) {
        return NextResponse.json({
            code: '03',
            msg: '룰렛 이름은 1자 이상, 20자 이하 여야 합니다.',
            result: 'fail',
        });
    }
    if (!(typeof description === 'string' || description <= 500)) {
        return NextResponse.json({
            code: '04',
            msg: '룰렛 설명은 500자 이하여야 합니다.',
            result: 'fail',
        });
    }
    if (!(category_idx > 0)) {
        return NextResponse.json({
            code: '05',
            msg: '카테고리를 선택해주세요.',
            result: 'fail',
        });
    }
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
    return NextResponse.json({ code: '00', msg: '등록 성공', result: 'success', data: { setIdx: result } });
}
