"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utility {
    static generateRandomString(length = 10) {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    static generateSlugFromText(text) {
        if (!text)
            throw new Error("Text is not defined");
        const slug = text
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
        const random = this.generateRandomString(10);
        return `${slug}-${random}`;
    }
    static shuffleList(list) {
        let currentIndex = list.length;
        let randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [list[currentIndex], list[randomIndex]] = [
                list[randomIndex],
                list[currentIndex],
            ];
        }
        return list;
    }
}
exports.default = Utility;
//# sourceMappingURL=utility.js.map