export declare const MonthNames: string[];
export declare const DayNames: string[];
declare class DateUtils {
    static compare(firstDate: Date, secondDate: Date): number;
    static isAfter(firstDate: Date, secondDate: Date): boolean;
    static isBefore(firstDate: Date, secondDate: Date): boolean;
    static isSameDate(firstDate: Date, secondDate: Date): boolean;
    static getDayName(date: Date, { showShortName }: {
        showShortName?: boolean;
    }): string;
    static getMonthName(date: Date, { showShortName }: {
        showShortName?: boolean;
    }): string;
    static getFirstDateOfMonth(date: Date): Date;
    static getLastDateOfMonth(date: Date): Date;
}
export default DateUtils;
