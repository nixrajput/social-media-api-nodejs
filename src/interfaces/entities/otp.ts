import type { ObjectId, Document } from "mongoose";

export interface IOtp {
  otp: string;
  expiresAt: Date;
  email?: string;
  phone?: string;
  userId?: ObjectId;
}

export interface IOtpModel extends IOtp, Document {
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  isExpired(): Promise<boolean>;
  isAleadyUsed(): Promise<boolean>;
}
