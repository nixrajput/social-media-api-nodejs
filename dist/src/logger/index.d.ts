import winston from "winston";
declare class Logger {
    private static instance;
    private constructor();
    static getInstance(): winston.Logger;
    static _init(): void;
}
export default Logger;
