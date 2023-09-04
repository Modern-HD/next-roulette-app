'use client';

import { loginAction } from '@/util/server-action/signUtil';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login({ searchParams }: { searchParams: Params }) {
    const router = useRouter();
    useEffect(() => {
        if (searchParams.msg === 'retry') {
            alert('이메일 또는 패스워드가 일치하지 않습니다. 다시 시도해주세요.');
            router.replace('/login');
        }
    }, [router, searchParams.msg]);
    return (
        <div className="bg-default h-full flex flex-col">
            <div className="flex-1 flex justify-center items-center">
                <form action={loginAction} className="flex flex-col bg-white rounded-2xl p-5">
                    <label htmlFor="email">이메일</label>
                    <input name="email" className="mb-2 border-b-2 border-orange-200" />
                    <label htmlFor="password">패스워드</label>
                    <input type="password" name="password" className="mb-5 border-b-2 border-orange-200" />
                    <button className="bg-orange-400 rounded-lg py-2 text-white">Sign In</button>
                    {/* <button formAction="/auth/sign-up">Sign Up</button> */}
                </form>
            </div>
        </div>
    );
}
