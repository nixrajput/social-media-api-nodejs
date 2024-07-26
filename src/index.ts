import ExpressApp from "./app";
import Logger from "./logger";

const main = (): void => {
  // Run the Server
  Logger.getInstance().info("App :: Starting...");

  ExpressApp._init();
};

/**
 * Booting MainApp
 */
main();
