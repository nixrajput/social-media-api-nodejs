import type { Document } from "mongoose";
import type { IAuthTokenModel } from "./authToken";

export interface IAvatar {
  publicId: string;
  url: string;
}

export interface IAccountVerification {
  isVerified: boolean;
  category: string;
  verifiedAt: Date;
  lastRequestedAt?: Date;
}

export interface IUser {
  fname: string;
  lname: string;
  nameChangedAt?: Date;
  email: string;
  isEmailVerified?: boolean;
  emailChangedAt?: Date;
  username: string;
  usernameChangedAt: Date;
  countryCode?: string;
  phone?: string;
  isPhoneVerified?: boolean;
  phoneChangedAt?: Date;
  avatar?: IAvatar;
  gender?: string;
  dob?: string;
  about?: string;
  profession?: string;
  location?: string;
  website?: string;
  isPrivate?: boolean;
  accountStatus?: string;
  verification?: IAccountVerification;
}

export interface IUserModel extends IUser, Document {
  password?: string;
  passwordChangedAt?: Date;
  salt: string;

  postsCount: number;
  followersCount: number;
  followingCount: number;

  createdAt: Date;
  updatedAt: Date;

  // Methods
  generateToken(): Promise<IAuthTokenModel>;
  getToken(refreshToken?: boolean): Promise<IAuthTokenModel>;
  isProfileComplete(): Promise<boolean>;
  setPassword(password: string): Promise<void>;
  matchPassword(password: string): Promise<boolean>;
}
