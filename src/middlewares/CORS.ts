/**
 * Enables the CORS
 */

import cors from "cors";
import type { Application } from "express";
import Logger from "../logger";

class CORS {
  // CORS Options
  private corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
  };

  public mount(_express: Application): Application {
    Logger.info("App :: Registering CORS middleware...");

    _express.use(cors(this.corsOptions));

    return _express;
  }
}

export default new CORS();
