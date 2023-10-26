import supabaseAdminClient from '@/db/supabaseAdminClient';
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

    const body: IRoulettePlayRequest = await req.json();
    const [user, { data: rouletteSetData }, { data: rouletteSectionData }] = await Promise.all([
        getUser(supabase),
        supabase.from('roulette_set').select().eq('idx', body.idx).single(),
        supabase.from('roulette_section').select().eq('roulette_set_idx', body.idx).order('location'),
    ]);
    if (!rouletteSetData) {
        return NextResponse.json<IResponse>({
            code: '01',
            msg: '룰렛이 존재하지 않거나 삭제 되었습니다.',
            result: 'fail',
        });
    }
    if (rouletteSetData.updated_at !== body.rouletteSetUpdated) {
        return NextResponse.json<IResponse>({
            code: '02',
            msg: '룰렛이 업데이트 되었습니다.',
            result: 'fail',
        });
    }
    if (!(rouletteSectionData && rouletteSectionData.length >= 2)) {
        return NextResponse.json<IResponse>({
            code: '03',
            msg: '잘못된 룰렛입니다.',
            result: 'fail',
        });
    }

    const totalWeight = rouletteSectionData.reduce((acc, cur) => acc + cur.weight, 0);
    const randomNum = Math.floor(Math.random() * totalWeight) + 1;
    const resultSection = [...rouletteSectionData].reduce<number>((acc, cur, i, arr) => {
        acc -= cur.weight;
        if (acc > 0) return acc;
        arr.splice(1);
        return i;
    }, randomNum);
    const deg = 3600 - (randomNum / totalWeight) * 360;

    if (user) {
        await supabase.from('play_data').insert({
            user_idx: user.idx,
            roulette_set_idx: rouletteSetData.idx,
            content: rouletteSectionData[resultSection].content,
        });
    }

    await supabaseAdminClient
        .from('roulette_set')
        .update({
            play_count: rouletteSetData.play_count + 1,
        })
        .eq('idx', rouletteSetData.idx);

    return NextResponse.json<IResponse<IRoulettePlayResponse>>({
        code: '00',
        msg: rouletteSectionData[resultSection].content + ' 당첨',
        result: 'success',
        data: {
            deg,
            resultSection,
        },
    });
}
