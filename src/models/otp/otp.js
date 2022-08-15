import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: String,

  expiresAt: Date,

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
