import locationInfoRouter from "./routes/index.js";

const locationInfoModule = {
    init: (app) => {
        app.use("/api/v1", locationInfoRouter);
        console.log("[module]: locationInfo module loaded");
    },
};

export default locationInfoModule;
