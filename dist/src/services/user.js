"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("src/logger"));
const User_1 = __importDefault(require("../models/User"));
class UserService {
    createUserExc = async (_user) => {
        try {
            const user = await User_1.default.create(_user);
            return Promise.resolve(user);
        }
        catch (error) {
            logger_1.default.getInstance().error("UserService: createUserExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    findUserByIdExc = async (_userId) => {
        try {
            const user = await User_1.default.findById(_userId);
            return Promise.resolve(user);
        }
        catch (error) {
            logger_1.default.getInstance().error("UserService: findUserByIdExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    findUserByEmailExc = async (_email) => {
        try {
            const user = await User_1.default.findOne({ email: _email });
            return Promise.resolve(user);
        }
        catch (error) {
            logger_1.default.getInstance().error("UserService: findUserByEmailExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    checkIsEmailExistsExc = async (_email) => {
        try {
            const user = await User_1.default.findOne({ email: _email });
            if (!user) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }
        catch (error) {
            logger_1.default.getInstance().error("UserService: checkIsEmailExistsExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    checkIsUsernameExistsExc = async (_username) => {
        try {
            const user = await User_1.default.findOne({ username: _username });
            if (!user) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }
        catch (error) {
            logger_1.default.getInstance().error("UserService: checkIsUsernameExistsExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    checkIsPhoneExistsExc = async (_phone) => {
        try {
            const user = await User_1.default.findOne({ phone: _phone });
            if (!user) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }
        catch (error) {
            logger_1.default.getInstance().error("UserService: checkIsEmailExistsExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
}
exports.default = UserService;
//# sourceMappingURL=user.js.map