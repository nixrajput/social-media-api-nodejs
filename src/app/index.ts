import express from "express";
import type { Application } from "express";
import EnvConfig from "../config/env";
import Logger from "../logger";
import ExceptionHandler from "../exceptions/Handler";
import Http from "../middlewares/Http";
import CORS from "../middlewares/CORS";
import Morgan from "../middlewares/Morgan";
import Routes from "./app-routes";
import FirebaseConfig from "../config/firebase";
import SwaggerDocs from "../config/swagger";
import { MongoDB } from "../config/db";

/**
 * @name ExpressApp
 * @description Custom Express App Class Definition
 */
class ExpressApp {
  public express: Application;
  private _server: any;

  /**
   * Initializes the express server
   */
  constructor() {
    Logger.getInstance().info("App :: Initializing...");

    this.express = express();

    this.mountLogger();
    this.mountDotEnv();
    this.mountMiddlewares();
    this.mouteRoutes();
    this.mountSwagger();
    this.registerHandlers();

    Logger.getInstance().info("App :: Initialized");
  }

  /**
   * Mount all the environmental variables
   */
  private mountDotEnv(): void {
    Logger.getInstance().info("Config :: Loading...");

    this.express = EnvConfig.init(this.express);
    this.express = FirebaseConfig.init(this.express);
  }

  /**
   * Mount logger to the app
   */
  private mountLogger(): void {
    Logger._init();

    Logger.getInstance().info("Logger :: Mounted");
  }

  /**
   * Mount Swagger
   */
  private mountSwagger(): void {
    Logger.getInstance().info("Swagger :: Initializing...");

    this.express = SwaggerDocs.init(this.express);
  }

  /**
   * Mounts all the defined middlewares
   */
  private mountMiddlewares(): void {
    Logger.getInstance().info("App :: Registering middlewares...");

    // Mount basic express apis middleware
    this.express = Http.mount(this.express);

    // Registering Morgan Middleware
    this.express = Morgan.mount(this.express);

    // Check if CORS is enabled
    if (EnvConfig.getConfig().CORS_ENABLED) {
      // Mount CORS middleware
      this.express = CORS.mount(this.express);
    }

    Logger.getInstance().info("App :: Middlewares registered");
  }

  /**
   * Register all the handlers
   */
  private registerHandlers(): void {
    Logger.getInstance().info("App :: Registering handlers...");

    // Registering Exception Error Handlers
    this.express.use(ExceptionHandler.logErrors);
    this.express.use(ExceptionHandler.clientErrorHandler);
    this.express.use(ExceptionHandler.errorHandler);
    this.express = ExceptionHandler.notFoundHandler(this.express);

    Logger.getInstance().info("App :: Handlers registered");
  }

  /**
   * Mount all the routes
   */
  private mouteRoutes(): void {
    this.express = Routes.mountApi(this.express);
    Logger.getInstance().info("Routes :: API routes mounted");
  }

  /**
   * Starts the express server
   */
  public async _init(): Promise<void> {
    Logger.getInstance().info("Database :: Connecting...");
    const isConnected = await MongoDB.getInstance().connect();

    if (!isConnected) {
      process.exit(1);
    }

    Logger.getInstance().info("Server :: Starting...");

    const port = EnvConfig.getConfig().PORT || 5000;

    // Start the server on the specified port
    this._server = this.express
      .listen(port, () => {
        Logger.getInstance().info(
          `Server :: Running @ 'http://localhost:${port}'`
        );
      })
      .on("error", (_error) => {
        Logger.getInstance().error("Error: ", _error.message);
      });

    Logger.getInstance().info("App :: Started");
  }

  /**
   * Close the express server
   */
  public _close(): void {
    Logger.getInstance().info("Server :: Stopping server...");

    this._server.close(function () {
      process.exit(1);
    });
  }
}

export default new ExpressApp();
