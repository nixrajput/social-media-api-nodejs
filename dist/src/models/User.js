"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const enums_1 = require("../enums");
const env_1 = __importDefault(require("../config/env"));
const strings_1 = __importDefault(require("../constants/strings"));
const logger_1 = __importDefault(require("../logger"));
const AuthToken_1 = __importDefault(require("./AuthToken"));
const TokenServiceHelper_1 = __importDefault(require("../helpers/TokenServiceHelper"));
const UserSchema = new mongoose_1.Schema({
    fname: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 100;
            },
            msg: "First name length should not be greater than 100 characters",
        },
    },
    lname: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 100;
            },
            msg: "Last name length should not be greater than 100 characters",
        },
    },
    nameChangedAt: { type: Date },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 100;
            },
            msg: "Email length should not be greater than 100 characters",
        },
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailChangedAt: { type: Date },
    username: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 100;
            },
            msg: "Username length should not be greater than 100 characters",
        },
    },
    usernameChangedAt: { type: Date },
    countryCode: {
        type: String,
        maxlength: 20,
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return v.length === 10;
            },
            msg: "Phone number length should be equal to 10 characters",
        },
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    phoneChangedAt: { type: Date },
    password: {
        type: String,
        maxlength: 1000,
    },
    passwordChangedAt: { type: Date },
    salt: {
        type: String,
        maxlength: 1000,
    },
    avatar: {
        publicId: {
            type: String,
            maxlength: 100,
        },
        url: {
            type: String,
            maxlength: 500,
        },
    },
    gender: {
        type: String,
        maxlength: 100,
    },
    dob: {
        type: String,
        maxlength: 100,
    },
    about: {
        type: String,
        maxlength: 1000,
    },
    profession: {
        type: String,
        maxlength: 100,
    },
    location: {
        type: String,
        maxlength: 100,
    },
    website: {
        type: String,
        maxlength: 100,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    accountStatus: {
        type: String,
        enum: enums_1.EUserStatus,
        default: enums_1.EUserStatus.active,
    },
    verification: {
        isVerified: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            maxlength: 100,
        },
        verifiedAt: { type: Date },
        lastRequestedAt: { type: Date },
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
UserSchema.methods.generateToken = async function () {
    const jwtSecret = env_1.default.getConfig().JWT_SECRET;
    const jwtExpiresIn = env_1.default.getConfig().JWT_EXPIRES_IN || 2592000000;
    if (!jwtSecret)
        throw new Error(strings_1.default.JWT_SECRET_NOT_FOUND);
    const token = jsonwebtoken_1.default.sign({ id: this._id }, jwtSecret, {
        expiresIn: jwtExpiresIn,
    });
    if (!token) {
        logger_1.default.getInstance().error(`JwtError :: An error occurred while creating JwtToken`);
        throw new Error(strings_1.default.JWT_TOKEN_CREATE_ERROR);
    }
    const decodedData = jsonwebtoken_1.default.decode(token);
    if (!decodedData || typeof decodedData === "string") {
        logger_1.default.getInstance().error(`JwtError :: An error occurred while decoding JwtToken`);
        throw new Error(strings_1.default.JWT_TOKEN_CREATE_ERROR);
    }
    const authToken = await AuthToken_1.default.create({
        token: token,
        userId: this._id,
        expiresAt: decodedData.exp,
    });
    if (!authToken) {
        logger_1.default.getInstance().error(`AuthToken :: An error occurred while creating AuthToken`);
        throw new Error(strings_1.default.JWT_TOKEN_CREATE_ERROR);
    }
    logger_1.default.getInstance().info(`AuthToken :: created`);
    return authToken;
};
UserSchema.methods.getToken = async function (refreshToken = false) {
    if (refreshToken) {
        await AuthToken_1.default.deleteOne({ userId: this._id });
        const newToken = await this.generateToken();
        return newToken;
    }
    const authToken = await AuthToken_1.default.findOne({ userId: this._id });
    if (!authToken) {
        const newToken = await this.generateToken();
        return newToken;
    }
    const isExpired = await TokenServiceHelper_1.default.isTokenExpired(authToken.expiresAt);
    if (isExpired) {
        await AuthToken_1.default.deleteOne({ userId: this._id });
        const newToken = await this.generateToken();
        return newToken;
    }
    return authToken;
};
UserSchema.methods.isProfileComplete = async function () {
    if (!this.fullName)
        return false;
    if (!this.email)
        return false;
    if (!this.username)
        return false;
    return true;
};
UserSchema.methods.setPassword = async function (password) {
    const _currentDateTime = new Date(Date.now());
    this.salt = crypto_1.default.randomBytes(16).toString("hex");
    this.password = crypto_1.default
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
    this.passwordChangedAt = _currentDateTime;
    await this.save();
};
UserSchema.methods.matchPassword = async function (password) {
    var hash = crypto_1.default
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return this.password === hash;
};
UserSchema.index({ fname: "text", lname: "text", email: "text" });
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map