import userRouter from "./routes/index.js";

const userModule = {
  init: (app) => {
    app.use("/api/v1", userRouter);
    console.log("[module]: user module loaded");
  },
};

export default userModule;
