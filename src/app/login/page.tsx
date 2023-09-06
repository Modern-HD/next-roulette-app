'use client';

import BackBtn from '@/components/button/BackBtn';
import HomeBtn from '@/components/button/HomeBtn';
import Nav from '@/components/nav/Nav';
import { loginAction } from '@/util/server-actions/signAction';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import Link from 'next/link';
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
        <>
            <Nav leftBtn={<BackBtn />} title="로그인" rightBtn={<HomeBtn />} />
            <div className="rounded-2xl flex flex-col md:flex-row overflow-hidden absolute-center">
                <div className="bg-default p-5 text-white flex flex-col justify-between">
                    <h2 className="text-2xl font-bold mb-2">로그인 하면 얻는 혜택</h2>
                    <ul className="pl-4 list-disc font-semibold mb-5">
                        <li>룰렛 저장 및 공개 설정</li>
                        <li>플레이 데이터 저장</li>
                    </ul>
                    <Link href={'/join'} className="bg-white text-center p-2 rounded-lg text-orange-500 font-bold">
                        회원 가입
                    </Link>
                </div>
                <form action={loginAction} className="flex flex-col bg-white p-5">
                    <label htmlFor="email">이메일</label>
                    <input name="email" className="mb-2 border-b-2 border-orange-200" />
                    <label htmlFor="password">패스워드</label>
                    <input type="password" name="password" className="mb-5 border-b-2 border-orange-200" />
                    <button className="bg-orange-400 rounded-lg py-2 text-white font-bold">로그인</button>
                </form>
            </div>
        </>
    );
}
