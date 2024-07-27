import type { Application } from "express";
import type { IEnvConfig } from "../interfaces/core/config";
declare class EnvConfig {
    static getConfig(): IEnvConfig;
    static init(_express: Application): Application;
}
export default EnvConfig;
