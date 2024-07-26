import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import Logger from "src/logger";

class SwaggerDocs {
  private static options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Social Media API",
        version: "1.0.0",
        description: "API documentation for the Social Media application",
      },
      servers: [{ url: "http://localhost:5000" }],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"], // files containing annotations
  };

  private static specs = swaggerJsdoc(this.options);

  /**
   * Initialize Swagger Docs
   */
  public static init(_express: Application): Application {
    _express.use("/api-docs", swaggerUi.serve, swaggerUi.setup(this.specs));

    Logger.getInstance().info("Swagger :: Initialized");
    return _express;
  }
}

export default SwaggerDocs;
