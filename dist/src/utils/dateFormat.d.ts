export declare enum DateFormatTypes {
    "dd-MM-yy" = 0,
    "dd-MM-yyyy" = 1,
    "yy-MM-dd" = 2,
    "yyyy-MM-dd" = 3
}
declare class DateFormat {
    static toDateString(date: Date, { format, separator }: {
        format?: DateFormatTypes;
        separator?: string;
    }): string;
    static toTimeString(date: Date, { is24HourFormat, showSeconds }: {
        is24HourFormat?: boolean;
        showSeconds?: boolean;
    }): string;
    static toDateTimeString(date: Date, { format, dateSeparator, is24HourFormat, showSeconds, }: {
        format?: DateFormatTypes;
        dateSeparator?: string;
        is24HourFormat?: boolean;
        showSeconds?: boolean;
    }): string;
}
export default DateFormat;
