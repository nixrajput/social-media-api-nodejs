import type { Application } from "express";
declare class ExpressApp {
    express: Application;
    private _server;
    constructor();
    private mountDotEnv;
    private mountLogger;
    private mountSwagger;
    private mountMiddlewares;
    private registerHandlers;
    private mouteRoutes;
    _init(): Promise<void>;
    _close(): void;
}
declare const _default: ExpressApp;
export default _default;
