import BackBtn from '@/components/button/BackBtn';
import HomeBtn from '@/components/button/HomeBtn';
import Nav from '@/components/nav/Nav';
import Roulette from '@/components/roulette/Roulette';
import RouletteEditor from '@/components/roulette/RouletteEditor';

export default function Create() {
    return (
        <div className="flex flex-col h-full">
            <Nav leftBtn={<BackBtn />} title="룰렛 만들기" rightBtn={<HomeBtn />} />
            <div className="flex-1 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2">
                    <Roulette />
                </div>
                <div className="h-full flex-1 flex justify-center items-center">
                    <RouletteEditor />
                </div>
            </div>
        </div>
    );
}
