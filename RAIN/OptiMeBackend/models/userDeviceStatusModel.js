const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDeviceStatusSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },

  deviceId: {
    type: String,
    required: true,
    default: "default-device",
  },

  status: {
    type: String,
    enum: ["online"],
    default: "online",
  },

  lastHeartbeatAt: {
    type: Date,
    required: true,
  },

  platform: {
    type: String,
    required: false,
  },

  source: {
    type: String,
    required: false,
  },
});

UserDeviceStatusSchema.index(
  {
    userId: 1,
    deviceId: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("userDeviceStatus", UserDeviceStatusSchema);
