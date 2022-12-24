import mongoose from "mongoose";

const loginInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  deviceId: {
    type: String,
    required: true,
  },

  ip: {
    type: String,
    required: true,
  },

  deviceName: String,

  deviceModel: String,

  deviceBrand: String,

  deviceManufacturer: String,

  deviceOs: String,

  deviceOsVersion: String,

  deviceType: String,

  city: String,

  region: String,

  regionName: String,

  country: String,

  countryCode: String,

  continent: String,

  continentCode: String,

  lat: Number,

  lon: Number,

  zip: String,

  timezone: String,

  currency: String,

  isp: String,

  org: String,

  as: String,

  asname: String,

  reverse: String,

  mobile: Boolean,

  proxy: Boolean,

  hosting: Boolean,

  isActive: {
    type: Boolean,
    default: true,
  },

  lastActive: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

loginInfoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const LoginInfo = mongoose.model("LoginInfo", loginInfoSchema);

export default LoginInfo;
