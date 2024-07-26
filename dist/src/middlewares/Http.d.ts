import type { Application } from "express";
declare class Http {
    static mount(_express: Application): Application;
}
export default Http;
