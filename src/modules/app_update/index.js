import updateRouter from "./routes/index.js";

const updateModule = {
    init: (app) => {
        app.use("/api/v1", updateRouter);
        console.log("[module]: update module loaded");
    },
};

export default updateModule;
