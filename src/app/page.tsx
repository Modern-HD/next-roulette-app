import SearchBtn from '@/components/button/SearchBtn';
import SideBarOpenBtn from '@/components/button/SideBarOpenBtn';
import RouletteSetCardList from '@/components/card/RouletteSetCardList';
import Nav from '@/components/nav/Nav';
import SideBar from '@/components/side-bar/SideBar';
import { Database } from '@/interface/IDatabase';
import { getUser } from '@/util/auth/authUtil';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { use } from 'react';

export default function Home() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const userData = use(getUser(supabase));
    return (
        <div className="h-screen">
            <SideBar />
            <div className="h-full flex flex-col pb-5">
                <Nav leftBtn={<SideBarOpenBtn />} title={'오늘의 룰렛'} rightBtn={<SearchBtn />} />
                <div className="flex-1 flex flex-col justify-center text-white text-2xl py-10">
                    {!userData && (
                        <div>
                            <p className="mb-2">로그인 하면 더 많은 기능을 이용하실 수 있습니다.</p>
                            <div className="flex flex-row gap-2">
                                <Link className="bg-white rounded-lg text-orange-400 p-1 px-2 text-lg" href={'/login'}>
                                    로그인 하기
                                </Link>
                                <Link
                                    className="bg-white rounded-lg text-orange-400 p-1 px-2 text-lg"
                                    href={'/roulette/create'}
                                >
                                    룰렛 만들기
                                </Link>
                            </div>
                        </div>
                    )}
                    {userData && (
                        <div>
                            <p className="mb-2">{userData.nick_name} 님 환영합니다.</p>
                            <div className="flex flex-row gap-2">
                                <Link className="bg-white rounded-lg text-orange-400 p-1 px-2 text-lg" href={'/mypage'}>
                                    마이 페이지
                                </Link>
                                <Link
                                    className="bg-white rounded-lg text-orange-400 p-1 px-2 text-lg"
                                    href={'/roulette/create'}
                                >
                                    룰렛 만들기
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <RouletteSetCardList />
            </div>
        </div>
    );
}
