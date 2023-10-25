import { Database } from '@/interface/IDatabase';
import IResponse from '@/interface/IResponse';
import { getUser } from '@/util/auth/authUtil';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface IRoulettePlayRequest {
    idx: number;
    rouletteSetUpdated: string;
}

export interface IRoulettePlayResponse {
    resultSection: number;
    deg: number;
}

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const user = await getUser(supabase);

    const body: IRoulettePlayRequest = await req.json();
    const { data: rouletteSet } = await supabase.from('roulette_set').select().eq('idx', body.idx).single();
    if (!rouletteSet) {
        return NextResponse.json<IResponse>({
            code: '01',
            msg: '룰렛이 존재하지 않거나 삭제 되었습니다.',
            result: 'fail',
        });
    }
    if (rouletteSet.updated_at !== body.rouletteSetUpdated) {
        return NextResponse.json<IResponse>({
            code: '02',
            msg: '룰렛이 업데이트 되었습니다.',
            result: 'fail',
        });
    }
    const { data: rouletteSection } = await supabase
        .from('roulette_section')
        .select()
        .eq('roulette_set_idx', rouletteSet.idx);
    if (!(rouletteSection && rouletteSection.length >= 2)) {
        return NextResponse.json<IResponse>({
            code: '03',
            msg: '잘못된 룰렛입니다.',
            result: 'fail',
        });
    }

    const totalWeight = rouletteSection.reduce((acc, cur) => acc + cur.weight, 0);
    const randomNum = Math.floor(Math.random() * totalWeight) + 1;
    const resultSection = [...rouletteSection].reduce<number>((acc, cur, i, arr) => {
        acc -= cur.weight;
        if (acc > 0) return acc;
        arr.splice(1);
        return i;
    }, randomNum);
    const deg = 3600 - (randomNum / totalWeight) * 360;

    if (user) {
        await supabase.from('play_data').insert({
            user_idx: user.idx,
            roulette_set_idx: rouletteSet.idx,
            content: rouletteSection[resultSection].content,
        });
    }

    await supabase.from('roulette_set').update({
        play_count: rouletteSet.play_count + 1,
    });

    return NextResponse.json<IResponse<IRoulettePlayResponse>>({
        code: '00',
        msg: rouletteSection[resultSection].content + ' 당첨',
        result: 'success',
        data: {
            deg,
            resultSection,
        },
    });
}
