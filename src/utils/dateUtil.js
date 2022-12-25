const dateUtility = {};

dateUtility.convert = function (dt) {
  return dt.constructor === Date
    ? dt
    : dt.constructor === Array
      ? new Date(dt[0], dt[1], dt[2])
      : dt.constructor === Number
        ? new Date(dt)
        : dt.constructor === String
          ? new Date(dt)
          : typeof dt === "object"
            ? new Date(dt.year, dt.month, dt.date)
            : NaN;
};

dateUtility.compare = function (a, b) {
  return isFinite((a = this.convert(a).valueOf())) &&
    isFinite((b = this.convert(b).valueOf()))
    ? (a > b) - (a < b)
    : NaN;
};

dateUtility.isAfter = function (a, b) {
  return this.compare(a, b) === 1;
};

dateUtility.isBefore = function (a, b) {
  return this.compare(a, b) === -1;
};

const monthNames = [
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

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Get Day Name
dateUtility.getDayName = (date, isShortName = false) => {
  const day = date.getDay();

  if (isShortName) {
    return dayNames[day].substring(0, 3);
  }

  return dayNames[day];
};

// Get Month Name
dateUtility.getMonthName = (date, isShortName = false) => {
  const month = date.getMonth() + 1;

  if (isShortName) {
    return monthNames[month - 1].substring(0, 3);
  }

  return monthNames[month - 1];
}

// Get First Day of Month
dateUtility.getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Get Last Day of Month
dateUtility.getLastDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

dateUtility.isDateExpired = (date) => {
  const currentDate = new Date();

  if (currentDate > date) {
    return true;
  }

  return false;
};

export default dateUtility;
