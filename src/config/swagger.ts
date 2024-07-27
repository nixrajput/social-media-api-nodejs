import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import Logger from "../logger";

class SwaggerDocs {
  private static options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Social Media API",
        version: "1.0.0",
        description: "API documentation for the Social Media application",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Nikhil Rajput",
          url: "https://nixrajput.com",
          email: "nkr.nikhil.nkr@gmail.com",
        },
      },
      servers: [{ url: "http://localhost:5000" }],
    },
    // files containing annotations
    apis:
      process.env.NODE_ENV === "production"
        ? [
            "./src/routes/*.js",
            "./src/models/*.js",
            "./src/controllers/**/**.js",
          ]
        : [
            "./src/routes/*.ts",
            "./src/models/*.ts",
            "./src/controllers/**/**.ts",
          ],
  };

  private static swaggerSpecs = swaggerJsdoc(this.options);

  /**
   * Initialize Swagger Docs
   */
  public static init(_express: Application): Application {
    _express.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerSpecs, { explorer: true })
    );

    Logger.getInstance().info("Swagger :: Initialized");
    return _express;
  }
}

export default SwaggerDocs;
