export default interface IResponse {
    code: string;
    msg: string;
    result: 'success' | 'fail';
}
