"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validators {
    static validateEmail(email) {
        if (!email)
            throw new Error("Email is not defined");
        const EMAIL_REG_EXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_REG_EXP.test(email);
    }
    static validateUsername(username) {
        if (!username)
            throw new Error("Username is not defined");
        const USERNAME_REG_EXP = /^[A-Za-z0-9_]{1,16}$/;
        return USERNAME_REG_EXP.test(username);
    }
    static validatePhone(phone) {
        if (!phone)
            throw new Error("Phone is not defined");
        const PHONE_REG_EXP = /^\d{10}$/;
        return PHONE_REG_EXP.test(phone);
    }
    static validateUrl(url) {
        if (!url)
            throw new Error("URL is not defined");
        const URL_REG_EXP = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/;
        return URL_REG_EXP.test(url);
    }
    static validateLinkedUrl(url) {
        if (!url)
            throw new Error("URL is not defined");
        const LINKED_URL_REG_EXP = /(https?)?:?(\/\/)?(([w]{3}||\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
        return LINKED_URL_REG_EXP.test(url);
    }
}
exports.default = Validators;
//# sourceMappingURL=validator.js.map