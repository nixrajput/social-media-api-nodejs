import type { NextFunction, Request, Response } from "express";
import type { IUserModel } from "../entities/user";

/**
 * Define custom Express's Request interface
 */
export interface IRequest extends Request {
  currentUser?: IUserModel;
}

/**
 * Define custom Express's Response interface
 */
export type IResponse = Response;

/**
 * Define custom Express's NextFunction interface
 */
export type INext = NextFunction;
