import mongoose from "mongoose";
import Logger from "../logger";
import LocalConfig from "../configs/LocalConfig";

class Database {
  private static _instance: Database;
  private _isConnected: boolean;
  private _count: number = 0;

  private constructor() {
    Logger.getInstance().info("Database :: Initializing...");

    if (!LocalConfig.getConfig().MONGO_URI) {
      Logger.getInstance().error(`Database :: MongoDB URI not defined`);
      throw new Error(`Database :: MongoDB URI not defined`);
    }

    if (!LocalConfig.getConfig().DB_NAME) {
      Logger.getInstance().error(`Database :: Database name not defined`);
      throw new Error(`Database :: Database name not defined`);
    }

    this._isConnected = false;

    Logger.getInstance().info("Database :: Initialized");
  }

  /**
   * IsConnected Getter
   */
  public get isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * @name getInstance
   * @description Get Database instance.
   * @returns Database
   */
  public static getInstance(): Database {
    if (!this._instance) {
      this._instance = new Database();
    }

    return this._instance;
  }

  /**
   * @name _connect
   * @description Connect to MongoDB Database
   * @returns Promise<void>
   */
  public _connect = async (): Promise<void> => {
    if (this._isConnected) {
      Logger.getInstance().info("Database :: Already Connected");
      return;
    }

    const _db = this;
    _db._count++;

    if (_db._count > 1) {
      Logger.getInstance().info("Database :: Reconnecting...");
    } else {
      Logger.getInstance().info("Database :: Connecting...");
    }

    await mongoose
      .connect(LocalConfig.getConfig().MONGO_URI!, {
        dbName: LocalConfig.getConfig().DB_NAME,
        autoIndex: true,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
      })
      .then(function () {
        Logger.getInstance().info("Database :: Connected @ MongoDB");
        _db._isConnected = true;
      })
      .catch(function (_err: mongoose.Error) {
        Logger.getInstance().error(`Database :: Error: ${_err.message}`);
        _db._isConnected = false;
        throw _err;
      });
  };
}

export default Database;
