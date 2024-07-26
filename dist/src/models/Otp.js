"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dateUtils_1 = __importDefault(require("../utils/dateUtils"));
const OtpSchema = new mongoose_1.Schema({
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
            validator: function (v) {
                return v.length <= 100;
            },
            msg: "Email length should not be greater than 100 characters",
        },
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return v.length <= 10;
            },
            msg: "Email length should not be greater than 10 characters",
        },
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
OtpSchema.methods.isExpired = async function () {
    if (dateUtils_1.default.compare(this.expiresAt, new Date()) !== 1) {
        return true;
    }
    return false;
};
OtpSchema.methods.isAleadyUsed = async function () {
    if (this.isUsed) {
        return true;
    }
    return false;
};
const Otp = (0, mongoose_1.model)("OTP", OtpSchema);
exports.default = Otp;
//# sourceMappingURL=Otp.js.map