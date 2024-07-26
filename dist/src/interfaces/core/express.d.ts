import type { NextFunction, Request, Response } from "express";
import type { IUserModel } from "../entities/user";
export interface IRequest extends Request {
    currentUser?: IUserModel;
}
export interface IResponse extends Response {
}
export interface INext extends NextFunction {
}
