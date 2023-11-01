import drizzleClient from '@/db/drizzleClient';
import playData from '@/db/schema/playData';
import rouletteSection from '@/db/schema/rouletteSection';
import rouletteSet from '@/db/schema/rouletteSet';
import { Database } from '@/interface/IDatabase';
import IResponse from '@/interface/IResponse';
import { getUser } from '@/util/auth/authUtil';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { idx: string } }) {
    const setIdx = parseInt(params.idx);
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const [user, { data: rouletteSetData }] = await Promise.all([
        getUser(supabase),
        supabase.from('roulette_set').select().eq('idx', setIdx).single(),
    ]);
    if (!user) return NextResponse.json<IResponse>({ code: '01', msg: '로그인 후 이용 가능합니다.', result: 'fail' });
    if (rouletteSetData?.user_idx !== user.idx) {
        return NextResponse.json<IResponse>({ code: '02', msg: '자신의 룰렛만 삭제할 수 있습니다.', result: 'fail' });
    }
    await drizzleClient.transaction(async tx => {
        await Promise.all([
            tx.delete(rouletteSection).where(eq(rouletteSection.roulette_set_idx, setIdx)),
            tx.delete(playData).where(eq(playData.roulette_set_idx, setIdx)),
        ]);
        await tx.delete(rouletteSet).where(eq(rouletteSet.idx, setIdx));
    });
    return NextResponse.json<IResponse>({
        code: '00',
        msg: '삭제 성공',
        result: 'success',
    });
}
