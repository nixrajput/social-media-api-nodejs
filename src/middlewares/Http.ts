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
    Logger.getInstance().info("App :: Registering HTTP middleware...");

    _express.use(cors());

    _express.use(helmet());

    _express.use(compression());

    _express.use(json({ limit: "100mb" }));

    _express.use(urlencoded({ extended: true, limit: "100mb" }));

    _express.use(bodyParser.json({ limit: "100mb" }));

    _express.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

    // Express 5 leaves req.body undefined when no parser matched; controllers destructure it.
    _express.use((req, _res, next) => {
      req.body ??= {};
      next();
    });

    // Trust one hop only on Vercel, whose edge sets X-Forwarded-For. Elsewhere the client controls that header.
    _express.set("trust proxy", process.env.VERCEL ? 1 : false);

    return _express;
  }
}

export default Http;
