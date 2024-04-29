import Logger from "../logger";
import Database from "./Database";
import ExpressApp from "./ExpressApp";

class App {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  public _init = async (): Promise<void> => {
    if (this.db) {
      await this.db._connect();

      if (this.db.isConnected) {
        ExpressApp._init();
      } else {
        Logger.error("App :: Database is not connected");
      }
    } else {
      Logger.error("App :: Database could't initialized");
    }
  };
}

export default App;
