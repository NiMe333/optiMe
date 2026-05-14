const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshTokenModel");
const mongoose = require('mongoose');
const crypto = require("crypto");


mongoose.connect('mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe')
//always connect once and thats it

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

function createAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      userId: user.id
    },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

async function storeRefreshToken(user, refreshToken) {

    return await RefreshToken.create({
        userId: user.id,
        deviceId: crypto.randomUUID(),
        tokenHash: hashToken(refreshToken),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) //7 days
    });   

}

async function revokeRefreshToken(refreshToken) {
  const tokenHash = hashToken(refreshToken);

  await RefreshToken.deleteOne({
    tokenHash
  });
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  storeRefreshToken,
  revokeRefreshToken
};