'use client';

import BackBtn from '@/components/button/BackBtn';
import HomeBtn from '@/components/button/HomeBtn';
import Nav from '@/components/nav/Nav';
import { joinAction } from '@/util/server-actions/signAction';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Join({ searchParams }: { searchParams: Params }) {
    const router = useRouter();
    useEffect(() => {
        [
            ['incorrectEmail', '올바르지 않은 이메일 형식입니다.'],
            ['noNickName', '닉네임은 2글자 이상이여야 합니다.'],
            ['notEqPwd', '패스워드가 일치하지 않습니다.'],
            ['shortPwd', '비밀번호는 6자 이상이여야 합니다.'],
            ['alreadyJoin', '이미 가입되어 있는 이메일입니다.'],
            ['joinErr', '가입 중에 오류가 발생하였습니다.'],
        ].forEach(([msg, reason]) => {
            if (searchParams.msg !== msg) return;
            alert(reason);
            router.replace('/join');
        });
    }, [router, searchParams.msg]);
    return (
        <div className="h-screen">
            <Nav leftBtn={<BackBtn />} title="회원 가입" rightBtn={<HomeBtn />} />
            <form action={joinAction} className="flex flex-col bg-white p-10 rounded-2xl absolute-center shadow-lg">
                <label htmlFor="email">이메일</label>
                <input id="email" name="email" className="mb-2 border-b-2 border-orange-200" />
                <label htmlFor="nick-name">닉네임</label>
                <input id="nick-name" name="nick-name" className="mb-2 border-b-2 border-orange-200" />
                <label htmlFor="password">패스워드</label>
                <input id="password" type="password" name="password" className="mb-5 border-b-2 border-orange-200" />
                <label htmlFor="password-chk">패스워드 확인</label>
                <input
                    id="password-chk"
                    name="password-chk"
                    type="password"
                    className="mb-5 border-b-2 border-orange-200"
                />
                <button className="bg-orange-400 rounded-lg py-2 text-white">회원 가입</button>
            </form>
        </div>
    );
}
