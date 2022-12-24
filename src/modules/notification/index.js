import notificationRouter from "./routes/index.js";

const notificationModule = {
  init: (app) => {
    app.use("/api/v1", notificationRouter);
    console.log("[module]: notification module loaded");
  },
};

export default notificationModule;
