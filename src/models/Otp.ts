import { Schema, model, Types } from "mongoose";
import type { IOtpModel } from "../interfaces/entities/otp";
import DateUtils from "../utils/dateUtils";

const OtpSchema = new Schema<IOtpModel>(
  {
    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      validate: {
        validator: function (v: string) {
          return v.length <= 100;
        },
        msg: "Email length should not be greater than 100 characters",
      },
    },

    phone: {
      type: String,
      validate: {
        validator: function (v: string) {
          return v.length <= 10;
        },
        msg: "Email length should not be greater than 10 characters",
      },
    },

    userId: {
      type: Types.ObjectId,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/**
 * @name isExpired
 * @description Check if Otp is expired
 * @returns Promise<boolean>
 */
OtpSchema.methods.isExpired = async function (): Promise<boolean> {
  if (DateUtils.compare(this.expiresAt, new Date()) !== 1) {
    return true;
  }

  return false;
};

/**
 * @name isAleadyUsed
 * @description Check if Otp is used.
 * @returns Promise<boolean>
 */
OtpSchema.methods.isAleadyUsed = async function (): Promise<boolean> {
  if (this.isUsed) {
    return true;
  }

  return false;
};

const Otp = model<IOtpModel>("OTP", OtpSchema);

export default Otp;
