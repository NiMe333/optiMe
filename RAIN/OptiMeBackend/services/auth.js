const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshTokenModel');
const crypto = require('crypto');

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
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) //7 days
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
  revokeRefreshToken,
  hashToken
};