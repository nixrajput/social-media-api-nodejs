import mongoose from "mongoose";

const deviceInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  devices: [
    {
      deviceInfo: Object,
      locationInfo: Object,
      lastActive: Date,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DeviceInfo = mongoose.model("DeviceInfo", deviceInfoSchema);

export default DeviceInfo;
