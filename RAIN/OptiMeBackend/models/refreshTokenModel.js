const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    deviceId: { type: String, required: true},
    tokenHash: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true }
  },
);

module.exports = mongoose.model('refreshToken', RefreshTokenSchema);