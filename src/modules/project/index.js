import projectRouter from "./routes/index.js";

const projectModule = {
    init: (app) => {
        app.use("/api/v1", projectRouter);
        console.log("[module]: project module loaded");
    },
};

export default projectModule;
