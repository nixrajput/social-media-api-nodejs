import optGenerator from "otp-generator";
import type { IOtpModel } from "../interfaces/entities/otp";
import Otp from "../models/Otp";

export interface IOtpOptions {
  size?: number;
  expireIn?: number;
  useLowerCaseAlphabets?: boolean;
  useUpperCaseAlphabets?: boolean;
  useSpecialChars?: boolean;
}

/**
 * @name OtpHelper
 * @description OtpHelper class definition.
 */
class OtpServiceHelper {
  /**
   * @name generateOtpFromEmail
   * @description Generate an otp from an email.
   * @param email string
   * @param size number
   * @param expireIn number
   * @param useLowerCaseAlphabets boolean
   * @param useUpperCaseAlphabets boolean
   * @param useSpecialChars boolean
   * @returns Promise<IOtpModel>
   */
  public static async generateOtpFromEmail(
    email: string,
    options?: IOtpOptions
  ): Promise<IOtpModel> {
    // Generating Token
    const otp = optGenerator.generate(options?.size || 6, {
      lowerCaseAlphabets: options?.useLowerCaseAlphabets || false,
      upperCaseAlphabets: options?.useUpperCaseAlphabets || false,
      specialChars: options?.useSpecialChars || false,
    });

    // Valid for 15 minutes
    const expiresAt = Date.now() + (options?.expireIn || 15) * 60 * 1000;

    const otpModel = await Otp.create({
      otp: otp,
      expiresAt: expiresAt,
      email: email,
    });

    return otpModel;
  }
}

export default OtpServiceHelper;
