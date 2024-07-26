/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
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
    generateToken(): Promise<IAuthTokenModel>;
    getToken(refreshToken?: boolean): Promise<IAuthTokenModel>;
    isProfileComplete(): Promise<boolean>;
    setPassword(password: string): Promise<void>;
    matchPassword(password: string): Promise<boolean>;
}
