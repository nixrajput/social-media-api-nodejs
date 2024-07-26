import App from "./app";
import Logger from "./logger";

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

// "builds": [
//         {
//             "src": "/dist/index.js",
//             "use": "@vercel/node"
//         }
//     ],