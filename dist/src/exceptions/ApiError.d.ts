declare class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export default ApiError;
