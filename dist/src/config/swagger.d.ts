import { Application } from "express";
declare class SwaggerDocs {
    private static options;
    private static swaggerSpecs;
    static init(_express: Application): Application;
}
export default SwaggerDocs;
