import authRouter from "./routes/index.js";

const authModule = {
  init: (app) => {
    app.use("/api/v1", authRouter);
    console.log("[module]: auth module loaded");
  },
};

export default authModule;
