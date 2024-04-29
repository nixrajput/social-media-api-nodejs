/**
 * Enable basic express apis middleware
 */

import { json, urlencoded } from "express";
import type { Application } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import Logger from "../logger";

class Http {
  public static mount(_express: Application): Application {
    Logger.info("App :: Registering HTTP middleware...");

    _express.use(cors());

    _express.use(helmet());

    _express.use(compression());

    _express.use(json({ limit: "100mb" }));

    _express.use(urlencoded({ extended: true, limit: "100mb" }));

    _express.use(bodyParser.json({ limit: "100mb" }));

    _express.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

    _express.set("trust proxy", true);

    return _express;
  }
}

export default Http;
