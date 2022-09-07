import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: String,

  expiresAt: Date,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  isUsed: {
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
