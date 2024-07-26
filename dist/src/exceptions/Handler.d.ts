import type { Application } from "express";
import ApiError from "../exceptions/ApiError";
import type { INext, IRequest, IResponse } from "../interfaces/core/express";
declare class ExceptionHandler {
    static notFoundHandler(_express: Application): Application;
    static clientErrorHandler(err: any, req: IRequest, res: IResponse, next: INext): void | IResponse;
    static errorHandler(err: ApiError, req: IRequest, res: IResponse, _next: INext): void | IResponse;
    static logErrors(err: any, _req: IRequest, _res: IResponse, next: INext): void;
}
export default ExceptionHandler;
