const dates = {
  convert: function (dt) {
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
  },

  compare: function (a, b) {
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
};

export default dates;
