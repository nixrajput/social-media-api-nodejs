"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AuthTokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    expiresAt: {
        type: Number,
        required: true,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
AuthTokenSchema.methods.isExpired = async function () {
    if (this.expiresAt < new Date().getTime() / 1000) {
        return true;
    }
    return false;
};
const AuthToken = (0, mongoose_1.model)("AuthToken", AuthTokenSchema);
exports.default = AuthToken;
//# sourceMappingURL=AuthToken.js.map