import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: String,

  expiresAt: Date,

  email: String,

  phone: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
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

const Otp = mongoose.model("OTP", otpSchema);

export default Otp;
