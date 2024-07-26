"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayNames = exports.MonthNames = void 0;
exports.MonthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
exports.DayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
class DateUtils {
    static compare(firstDate, secondDate) {
        if (!firstDate)
            throw new Error("First Date is undefined");
        if (!secondDate)
            throw new Error("Second Date is undefined");
        const a = firstDate.valueOf();
        const b = secondDate.valueOf();
        return a > b ? 1 : -1;
    }
    static isAfter(firstDate, secondDate) {
        if (!firstDate)
            throw new Error("First Date is undefined");
        if (!secondDate)
            throw new Error("Second Date is undefined");
        return this.compare(firstDate, secondDate) === 1;
    }
    static isBefore(firstDate, secondDate) {
        if (!firstDate)
            throw new Error("First Date is undefined");
        if (!secondDate)
            throw new Error("Second Date is undefined");
        return this.compare(firstDate, secondDate) === -1;
    }
    static isSameDate(firstDate, secondDate) {
        if (!firstDate)
            throw new Error("First Date is undefined");
        if (!secondDate)
            throw new Error("Second Date is undefined");
        return (firstDate.getFullYear() === secondDate.getFullYear() &&
            firstDate.getMonth() === secondDate.getMonth() &&
            firstDate.getDate() === secondDate.getDate());
    }
    static getDayName(date, { showShortName = false }) {
        const day = date.getDay();
        if (showShortName) {
            return exports.DayNames[day].substring(0, 3);
        }
        return exports.DayNames[day];
    }
    static getMonthName(date, { showShortName = false }) {
        const month = date.getMonth() + 1;
        if (showShortName) {
            return exports.MonthNames[month - 1].substring(0, 3);
        }
        return exports.MonthNames[month - 1];
    }
    static getFirstDateOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    static getLastDateOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
}
exports.default = DateUtils;
//# sourceMappingURL=dateUtils.js.map