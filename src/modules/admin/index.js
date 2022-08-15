import adminRouter from "./routes/index.js";

const adminModule = {
  init: (app) => {
    app.use("/api/v1", adminRouter);
    console.log("[module]: admin module loaded");
  },
};

export default adminModule;
