/**
 * Define JWT Helper Class
 */

import jwt from "jsonwebtoken";
import LocalConfig from "../configs/LocalConfig";
import Logger from "../logger";
import Strings from "../constants/strings";
import type { IAuthTokenModel } from "../interfaces/entities/authToken";
import AuthToken from "../models/AuthToken";

class TokenServiceHelper {
  /**
   * @name verifyToken
   * @description Verify Jwt Token.
   * @param token
   * @returns JwtPayload | undefined
   */
  public static async verifyToken(
    token: string
  ): Promise<IAuthTokenModel | null> {
    try {
      const decoded = jwt.verify(token, LocalConfig.getConfig().JWT_SECRET!);

      if (!decoded || typeof decoded === "string") {
        throw new Error(Strings.TOKEN_NOT_VERIFIED);
      }

      const authToken = await AuthToken.findOne({
        token: token,
        userId: decoded.id,
      });

      if (!authToken) {
        Logger.error(Strings.TOKEN_NOT_FOUND);
        return null;
      }

      return authToken;
    } catch (error: any) {
      Logger.error(error.message);
      return null;
    }
  }

  /**
   * @name isTokenExpired
   * @description Check if token is expired or not.
   * @param expiresAt
   * @returns boolean
   */
  public static async isTokenExpired(expiresAt: number): Promise<boolean> {
    if (expiresAt < new Date().getTime() / 1000) {
      return true;
    }

    return false;
  }
}

export default TokenServiceHelper;
