import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cron from "node-cron";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { deleteExpiredOTPs } from "./modules/user/controllers/index.js";

export const runApp = () => {
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: "*",
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      credentials: true,
      exposedHeaders: ["x-auth-token"],
    })
  );
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Schedule a task
  cron.schedule("59 23 * * *", () => {
    console.log("[cron]: task running every day at 11:59 PM");
    deleteExpiredOTPs();
  });

  // Index Route
  app.route("/").get(function (req, res) {
    res.status(200).json({
      success: true,
      message: "Server is up and running...",
    });
  });

  return app;
};

export const closeApp = (app) => {
  // Middleware for Errors
  app.use(errorMiddleware);
  app.use("*", (req, res, next) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found.",
    });
  });
};
