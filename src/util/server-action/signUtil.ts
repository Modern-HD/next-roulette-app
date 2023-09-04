'use server';

import { Database } from '@/interface/IDatabase';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
