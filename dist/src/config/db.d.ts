declare class MongoDB {
    private static instance;
    private constructor();
    static getInstance(): MongoDB;
    connect(): Promise<boolean>;
}
export { MongoDB };
