import BackBtn from '@/components/button/BackBtn';
import Nav from '@/components/nav/Nav';
import Roulette from '@/components/roulette/Roulette';

export default function Create() {
    return (
        <div className="flex flex-col h-full">
            <Nav leftBtn={<BackBtn />} title="룰렛 만들기" />
            <div className="flex-1 flex flex-row items-center">
                <div className="w-1/2">
                    <Roulette />
                </div>
            </div>
        </div>
    );
}
