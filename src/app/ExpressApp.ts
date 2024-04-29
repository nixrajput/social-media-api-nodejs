import express from "express";
import type { Application } from "express";
import LocalConfig from "../configs/LocalConfig";
import Logger from "../logger";
import ExceptionHandler from "../exceptions/Handler";
import Http from "../middlewares/Http";
import CORS from "../middlewares/CORS";
import Morgan from "../middlewares/Morgan";
import Routes from "./Routes";
import FirebaseConfig from "../configs/FirebaseConfig";

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
    Logger.info("App :: Initializing...");

    this.express = express();

    this.mountDotEnv();
    this.mountMiddlewares();
    this.mouteRoutes();
    this.registerHandlers();

    Logger.info("App :: Initialized");
  }

  /**
   * Mount all the environmental variables
   */
  private mountDotEnv(): void {
    Logger.info("Config :: Loading...");

    this.express = LocalConfig.init(this.express);
    this.express = FirebaseConfig.init(this.express);
  }

  /**
   * Mounts all the defined middlewares
   */
  private mountMiddlewares(): void {
    Logger.info("App :: Registering middlewares...");

    // Mount basic express apis middleware
    this.express = Http.mount(this.express);

    // Registering Morgan Middleware
    this.express = Morgan.mount(this.express);

    // Check if CORS is enabled
    if (LocalConfig.getConfig().CORS_ENABLED) {
      // Mount CORS middleware
      this.express = CORS.mount(this.express);
    }

    Logger.info("App :: Middlewares registered");
  }

  /**
   * Register all the handlers
   */
  private registerHandlers(): void {
    Logger.info("App :: Registering handlers...");

    // Registering Exception / Error Handlers
    this.express.use(ExceptionHandler.logErrors);
    this.express.use(ExceptionHandler.clientErrorHandler);
    this.express.use(ExceptionHandler.errorHandler);
    this.express = ExceptionHandler.notFoundHandler(this.express);

    Logger.info("App :: Handlers registered");
  }

  /**
   * Mount all the routes
   */
  private mouteRoutes(): void {
    this.express = Routes.mountApi(this.express);
    Logger.info("Routes :: API routes mounted");
  }

  /**
   * Starts the express server
   */
  public _init(): any {
    Logger.info("Server :: Starting...");

    const port = LocalConfig.getConfig().PORT || 4040;

    // Start the server on the specified port
    this._server = this.express
      .listen(port, () => {
        return Logger.info(`Server :: Running @ 'http://localhost:${port}'`);
      })
      .on("error", (_error) => {
        return Logger.error("Error: ", _error.message);
      });
  }

  /**
   * Close the express server
   */
  public _close(): any {
    Logger.info("Server :: Stopping server...");

    this._server.close(function () {
      process.exit(1);
    });
  }
}

export default new ExpressApp();
