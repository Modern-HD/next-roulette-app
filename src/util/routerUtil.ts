import { IRouletteModify } from '@/app/api/roulette/modify/route';
import { IRouletteResister } from '@/app/api/roulette/register/route';
import IResponse from '@/interface/IResponse';

export function rouletteCommonValidation(body: IRouletteResister | IRouletteModify): IResponse | null {
    if (!(body.set && body.section && body.section.length > 1)) {
        return { code: '02', msg: '올바르지 않는 입력입니다.', result: 'fail' };
    }
    const { title, description, category_idx } = body.set;
    if (!(title && title.length > 0 && title.length <= 20)) {
        return {
            code: '03',
            msg: '룰렛 이름은 1자 이상, 20자 이하 여야 합니다.',
            result: 'fail',
        };
    }
    if (!(typeof description === 'string' || description <= 500)) {
        return {
            code: '04',
            msg: '룰렛 설명은 500자 이하여야 합니다.',
            result: 'fail',
        };
    }
    if (!(category_idx > 0)) {
        return {
            code: '05',
            msg: '카테고리를 선택해주세요.',
            result: 'fail',
        };
    }
    return null;
}
