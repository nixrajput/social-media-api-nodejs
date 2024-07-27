/**
 * Define Routes
 */

import type { Application } from "express";
import EnvConfig from "../config/env";
import Logger from "../logger";
import AuthRouter from "../routes/auth";
import PostRouter from "../routes/post";

class Routes {
  /**
   * @name mountApiRoutes
   * @description Mount all api routes
   * @param _express
   * @returns Application
   */
  public mountApiRoutes(_express: Application): Application {
    const apiPrefix = EnvConfig.getConfig().API_PREFIX;
    Logger.getInstance().info("Routes :: Mounting API routes...");

    // Mounting Routes
    _express.use(`/${apiPrefix}/auth`, AuthRouter);
    _express.use(`/${apiPrefix}/post`, PostRouter);

    return _express;
  }
}

export default new Routes();
