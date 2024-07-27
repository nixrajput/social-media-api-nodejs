import mongoose from "mongoose";
// import { Sequelize } from 'sequelize';
import EnvConfig from "./env";
import Logger from "../logger";

class MongoDB {
  private static instance: MongoDB;
  private constructor() {}

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async connect(): Promise<boolean> {
    try {
      await mongoose.connect(EnvConfig.getConfig().MONGO_URI!, {
        dbName: EnvConfig.getConfig().DB_NAME,
        autoIndex: true,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
      });
      Logger.getInstance().info("Database :: Connected @ MongoDB");
      return true;
    } catch (error: any) {
      Logger.getInstance().error(`Database :: Error: ${error.message}`);
      return false;
    }
  }
}

// class PostgresDB {
//   private static instance: Sequelize;

//   private constructor() {}

//   public static getInstance(): Sequelize {
//     if (!PostgresDB.instance) {
//       PostgresDB.instance = new Sequelize(process.env.POSTGRES_URI!, { dialect: 'postgres' });
//     }
//     return PostgresDB.instance;
//   }

//   public static async connect() {
//     try {
//       await PostgresDB.getInstance().authenticate();
//       console.log('PostgreSQL connected');
//     } catch (error) {
//       console.error('Error connecting to PostgreSQL', error);
//       process.exit(1);
//     }
//   }
// }

export { MongoDB };
