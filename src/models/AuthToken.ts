import { Schema, model, Types } from "mongoose";
import type { IAuthTokenModel } from "../interfaces/entities/authToken";

const AuthTokenSchema = new Schema<IAuthTokenModel>(
  {
    token: {
      type: String,
      required: true,
    },

    userId: {
      type: Types.ObjectId,
      required: true,
    },

    expiresAt: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/**
 * @name isExpired
 * @description Check if auth token is expired
 * @returns Promise<boolean>
 */
AuthTokenSchema.methods.isExpired = async function (): Promise<boolean> {
  if (this.expiresAt < new Date().getTime() / 1000) {
    return true;
  }

  return false;
};

const AuthToken = model<IAuthTokenModel>("AuthToken", AuthTokenSchema);

export default AuthToken;
