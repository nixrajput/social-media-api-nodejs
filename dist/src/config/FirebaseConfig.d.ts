import type { Application } from "express";
import type { IFirebaseConfig } from "../interfaces/core/config";
declare class FirebaseConfig {
    static getConfig(): IFirebaseConfig;
    static init(_express: Application): Application;
}
export default FirebaseConfig;
