import type { ObjectId, Document } from "mongoose";

export interface IAuthToken {
  userId: ObjectId;
  token: string;
  expiresAt: number;
}

export interface IAuthTokenModel extends IAuthToken, Document {
  createdAt: Date;
  updatedAt: Date;

  // Methods
  isExpired(): Promise<boolean>;
}
