/**
 * Define User Service Class
 */

import type { ObjectId } from "mongoose";
import type { IUser, IUserModel } from "../interfaces/entities/user";
import Logger from "../logger";
import User from "../models/User";

class UserService {
  // Create an `User`
  public createUserExc = async (_user: IUser): Promise<IUserModel> => {
    try {
      const user = await User.create(_user);

      return Promise.resolve(user);
    } catch (error) {
      Logger.error(
        "UserService: createUserExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };

  // Find an `User` by Id
  public findUserByIdExc = async (
    _userId: string | ObjectId
  ): Promise<IUserModel> => {
    try {
      const user = await User.findById(_userId);

      return Promise.resolve(user);
    } catch (error) {
      Logger.error(
        "UserService: findUserByIdExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };

  // Find an `User` by an email
  public findUserByEmailExc = async (_email: string): Promise<IUserModel> => {
    try {
      const user = await User.findOne({ email: _email });

      return Promise.resolve(user);
    } catch (error) {
      Logger.error(
        "UserService: findUserByEmailExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };

  // Check if `User` already registered with the email
  public checkIsEmailExistsExc = async (_email: string): Promise<boolean> => {
    try {
      const user = await User.findOne({ email: _email });

      if (!user) {
        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    } catch (error) {
      Logger.error(
        "UserService: checkIsEmailExistsExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };

  // Check if `User` already registered with the username
  public checkIsUsernameExistsExc = async (
    _username: string
  ): Promise<boolean> => {
    try {
      const user = await User.findOne({ username: _username });

      if (!user) {
        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    } catch (error) {
      Logger.error(
        "UserService: checkIsUsernameExistsExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };

  // Check if `User` already registered with the phone number
  public checkIsPhoneExistsExc = async (_phone: string): Promise<boolean> => {
    try {
      const user = await User.findOne({ phone: _phone });

      if (!user) {
        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    } catch (error) {
      Logger.error(
        "UserService: checkIsEmailExistsExc",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };
}

export default UserService;
