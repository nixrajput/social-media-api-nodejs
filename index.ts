import App from "./src/app";
import Logger from "./src/logger";

const main = (): void => {
  // Run the Server
  Logger.info("App :: Starting...");

  const app = new App();

  app._init();
};

/**
 * Booting MainApp
 */
main();
