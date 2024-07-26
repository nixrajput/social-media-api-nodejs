import type { Application } from "express";
declare class Morgan {
    private static _stream;
    private static _format;
    static mount(_express: Application): Application;
}
export default Morgan;
