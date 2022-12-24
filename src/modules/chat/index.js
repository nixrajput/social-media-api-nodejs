import chatRouter from "./routes/index.js";

const chatModule = {
    init: (app) => {
        app.use("/api/v1", chatRouter);
        console.log("[module]: chat module loaded");
    },
};

export default chatModule;