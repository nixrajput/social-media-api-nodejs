import type { Application } from "express";
import type { IFirebaseConfig } from "../interfaces/core/config";
import Logger from "../logger";

class FirebaseConfig {
  // Loading process.env as IFirebaseConfig interface

  public static getConfig(): IFirebaseConfig {
    const config = {
      FIREBASE_TYPE: process.env["FIREBASE_TYPE"],
      FIREBASE_PROJECT_ID: process.env["FIREBASE_PROJECT_ID"],
      FIREBASE_PRIVATE_KEY_ID: process.env["FIREBASE_PRIVATE_KEY_ID"],
      FIREBASE_PRIVATE_KEY: process.env["FIREBASE_PRIVATE_KEY"].replace(
        /\\n/g,
        ""
      ),
      FIREBASE_CLIENT_EMAIL: process.env["FIREBASE_CLIENT_EMAIL"],
      FIREBASE_CLIENT_ID: process.env["FIREBASE_CLIENT_ID"],
      FIREBASE_AUTH_URI: process.env["FIREBASE_AUTH_URI"],
      FIREBASE_TOKEN_URI: process.env["FIREBASE_TOKEN_URI"],
      FIREBASE_AUTH_PROVIDER_X509_CERT_URL:
        process.env["FIREBASE_AUTH_PROVIDER_X509_CERT_URL"],
      FIREBASE_CLIENT_X509_CERT_URL:
        process.env["FIREBASE_CLIENT_X509_CERT_URL"],
    };

    for (const [key, value] of Object.entries(config)) {
      if (value === undefined) {
        throw new Error(`Missing key ${key} in Environmental variables`);
      }
    }

    return config as IFirebaseConfig;
  }

  /**
   * Injects your config to the app's locals
   */
  public static init(_express: Application): Application {
    _express.locals["app"] = this.getConfig();

    Logger.info("Firebase Config :: Loaded");
    return _express;
  }
}

export default FirebaseConfig;
