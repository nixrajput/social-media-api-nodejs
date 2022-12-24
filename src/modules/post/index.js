import postRouter from "./routes/index.js";

const postModule = {
  init: (app) => {
    app.use("/api/v1", postRouter);
    console.log("[module]: post module loaded");
  },
};

export default postModule;
