import BackBtn from '@/components/button/BackBtn';
import HomeBtn from '@/components/button/HomeBtn';
import Nav from '@/components/nav/Nav';
import RouletteResetProvider from '@/components/provider/RouletteResetProvider';
import Roulette from '@/components/roulette/Roulette';
import RouletteEditor from '@/components/roulette/RouletteEditor';
import RouletteResultDisplay from '@/components/roulette/RouletteResultDisplay';
import RouletteSaveModal from '@/components/roulette/RouletteSaveModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '오늘의 룰렛 - 만들기',
};

export default function Create() {
    return (
        <RouletteResetProvider type={'CREATE'}>
            <div className="flex flex-col h-full">
                <Nav leftBtn={<BackBtn />} title="룰렛 만들기" rightBtn={<HomeBtn />} className="mb-10 md:mb-0" />
                <div className="flex-1 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 overflow-hidden">
                        <Roulette />
                    </div>
                    <div className="h-full w-full md:flex-1 flex justify-center items-center">
                        <RouletteEditor />
                    </div>
                </div>
            </div>
            <RouletteResultDisplay />
            <RouletteSaveModal />
        </RouletteResetProvider>
    );
}
