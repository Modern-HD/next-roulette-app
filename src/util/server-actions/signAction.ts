'use server';

import { Database } from '@/interface/IDatabase';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function joinAction(data: FormData) {
    const email = String(data.get('email'));
    const nickName = String(data.get('nick-name'));
    const password = String(data.get('password'));
    const passwordChk = String(data.get('password-chk'));
    const supabase = createServerActionClient<Database>({ cookies });

    if (!nickName || nickName.length < 2) return redirect('/join?msg=noNickName');
    if (password !== passwordChk) return redirect('/join?msg=notEqPwd');
    if (password.length < 6) return redirect('/join?msg=shortPwd');

    const {
        data: { user },
        error,
    } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error && error.message === 'To signup, please provide your email') return redirect('/join?msg=incorrectEmail');
    if (error && error.message.startsWith('Unable to validate email address'))
        return redirect('/join?msg=incorrectEmail');
    if (error && error.message === 'User already registered') return redirect('/join?msg=alreadyJoin');
    if (error || !user) return redirect('/join?msg=joinErr');
    await supabase.from('user').insert({ uuid: user.id, nick_name: nickName });

    return redirect('/');
}

export async function loginAction(data: FormData) {
    const email = String(data.get('email'));
    const password = String(data.get('password'));
    const supabase = createServerActionClient<Database>({ cookies });

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return redirect('/login?msg=retry');

    return redirect('/');
}

export async function logoutAction() {
    const supabase = createServerActionClient<Database>({ cookies });
    await supabase.auth.signOut();
    return redirect('/login');
}
