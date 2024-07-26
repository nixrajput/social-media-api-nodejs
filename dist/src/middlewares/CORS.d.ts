import type { Application } from "express";
declare class CORS {
    private corsOptions;
    mount(_express: Application): Application;
}
declare const _default: CORS;
export default _default;
