import HomeBtn from '@/components/button/HomeBtn';
import SearchBtn from '@/components/button/SearchBtn';
import RouletteSetCardList from '@/components/card/RouletteSetCardList';
import Nav from '@/components/nav/Nav';
import { Metadata } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export const metadata: Metadata = {
    title: '오늘의 룰렛 - 검색',
};

export default function Search({ params }: { params: Params }) {
    const title = decodeURI(params.title);
    return (
        <div className="h-screen">
            <div className="h-full flex flex-col pb-5">
                <Nav leftBtn={<HomeBtn />} title={`${title} 검색 결과`} rightBtn={<SearchBtn />} />
                <div className="flex-1 flex flex-col justify-center text-white text-2xl py-10">
                    <div>
                        <p className="mb-2 text-3xl">{title}로 검색한 결과입니다.</p>
                    </div>
                </div>
                <RouletteSetCardList search={title} />
            </div>
        </div>
    );
}
