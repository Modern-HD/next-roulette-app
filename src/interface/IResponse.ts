export default interface IResponse<T = undefined> {
    code: string;
    msg: string;
    result: 'success' | 'fail';
    data?: T;
}
