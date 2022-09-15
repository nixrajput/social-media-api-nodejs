import mongoose from "mongoose";

const deviceInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  deviceId: {
    type: String,
    required: true,
  },

  deviceInfo: Object,

  locationInfo: Object,

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

deviceInfoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const DeviceInfo = mongoose.model("DeviceInfo", deviceInfoSchema);

export default DeviceInfo;
