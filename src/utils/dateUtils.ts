/**
 * Define Date Utils Class
 */

export const MonthNames = [
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

export const DayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

class DateUtils {
  // Compare Two Dates
  public static compare(firstDate: Date, secondDate: Date): number {
    if (!firstDate) throw new Error("First Date is undefined");
    if (!secondDate) throw new Error("Second Date is undefined");

    const a = firstDate.valueOf();
    const b = secondDate.valueOf();

    return a > b ? 1 : -1;
  }

  // Check if Date 1 is after Date 2
  public static isAfter(firstDate: Date, secondDate: Date): boolean {
    if (!firstDate) throw new Error("First Date is undefined");
    if (!secondDate) throw new Error("Second Date is undefined");

    return this.compare(firstDate, secondDate) === 1;
  }

  // Check if Date 1 is before Date 2
  public static isBefore(firstDate: Date, secondDate: Date): boolean {
    if (!firstDate) throw new Error("First Date is undefined");
    if (!secondDate) throw new Error("Second Date is undefined");

    return this.compare(firstDate, secondDate) === -1;
  }

  // Check if Date 1 is same as Date 2
  public static isSameDate(firstDate: Date, secondDate: Date): boolean {
    if (!firstDate) throw new Error("First Date is undefined");
    if (!secondDate) throw new Error("Second Date is undefined");

    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  // Get Day Name
  public static getDayName(date: Date, { showShortName = false }): string {
    const day = date.getDay();

    if (showShortName) {
      return DayNames[day].substring(0, 3);
    }

    return DayNames[day];
  }

  // Get Month Name
  public static getMonthName(date: Date, { showShortName = false }): string {
    const month = date.getMonth() + 1;

    if (showShortName) {
      return MonthNames[month - 1].substring(0, 3);
    }

    return MonthNames[month - 1];
  }

  // Get First Date of the Month
  public static getFirstDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  // Get Last Date of the Month
  public static getLastDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
}

export default DateUtils;
