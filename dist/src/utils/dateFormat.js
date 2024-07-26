"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFormatTypes = void 0;
var DateFormatTypes;
(function (DateFormatTypes) {
    DateFormatTypes[DateFormatTypes["dd-MM-yy"] = 0] = "dd-MM-yy";
    DateFormatTypes[DateFormatTypes["dd-MM-yyyy"] = 1] = "dd-MM-yyyy";
    DateFormatTypes[DateFormatTypes["yy-MM-dd"] = 2] = "yy-MM-dd";
    DateFormatTypes[DateFormatTypes["yyyy-MM-dd"] = 3] = "yyyy-MM-dd";
})(DateFormatTypes || (exports.DateFormatTypes = DateFormatTypes = {}));
class DateFormat {
    static toDateString(date, { format = DateFormatTypes["dd-MM-yyyy"], separator = "-" }) {
        if (!date)
            throw new Error("Date is not defined");
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const yearString = year.toString();
        const monthString = month < 10 ? "0" + month.toString() : month.toString();
        const dayString = day < 10 ? "0" + day.toString() : day.toString();
        if (format === DateFormatTypes["dd-MM-yy"]) {
            return (dayString +
                separator +
                monthString +
                separator +
                yearString.substring(2, yearString.length));
        }
        if (format === DateFormatTypes["dd-MM-yyyy"]) {
            return dayString + separator + monthString + separator + yearString;
        }
        if (format === DateFormatTypes["yy-MM-dd"]) {
            return (yearString.substring(2, yearString.length) +
                separator +
                monthString +
                separator +
                dayString);
        }
        if (format === DateFormatTypes["yyyy-MM-dd"]) {
            return yearString + separator + monthString + separator + dayString;
        }
        return yearString + separator + monthString + separator + dayString;
    }
    static toTimeString(date, { is24HourFormat = false, showSeconds = false }) {
        if (!date)
            throw new Error("Date is not defined");
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        let hoursString = hours < 10 ? "0" + hours.toString() : hours.toString();
        const minutesString = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
        const secondsString = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
        if (is24HourFormat) {
            if (showSeconds) {
                return `${hoursString}:${minutesString}:${secondsString}`;
            }
            return `${hoursString}:${minutesString}`;
        }
        if (hours > 12) {
            hoursString = (hours - 12).toString();
        }
        else if (hours === 0) {
            hoursString = "12";
        }
        const amPmString = hours < 12 ? "AM" : "PM";
        if (showSeconds) {
            return `${hoursString}:${minutesString}:${secondsString} ${amPmString}`;
        }
        return `${hoursString}:${minutesString} ${amPmString}`;
    }
    static toDateTimeString(date, { format = DateFormatTypes["dd-MM-yyyy"], dateSeparator = "-", is24HourFormat = false, showSeconds = false, }) {
        if (!date)
            throw new Error("Date is not defined");
        const dateStr = this.toDateString(date, {
            format: format,
            separator: dateSeparator,
        });
        const timeStr = this.toTimeString(date, {
            is24HourFormat: is24HourFormat,
            showSeconds: showSeconds,
        });
        return `${dateStr} ${timeStr}`;
    }
}
exports.default = DateFormat;
//# sourceMappingURL=dateFormat.js.map