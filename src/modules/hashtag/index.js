import tagRouter from "./routes/index.js";

const tagModule = {
    init: (app) => {
        app.use("/api/v1", tagRouter);
        console.log("[module]: tag module loaded");
    },
};

export default tagModule;