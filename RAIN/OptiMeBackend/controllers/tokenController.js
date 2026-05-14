const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const util = require('util');
const Auth = require('../services/auth')

const verifyAsync = util.promisify(jwt.verify);

exports.refresh = async (req, res) => {

  try {

    const token = req.cookies.refreshToken;

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "refresh token missing (token controller)"
      });

    }

    const tokenHash = hashToken(token);

    const payload = await verifyAsync(token, process.env.REFRESH_SECRET);

    const storedToken = await RefreshToken.findOne({
    tokenHash,
    userId: payload.userId
    });

    if (!storedToken) {
    return res.status(403).json({ message: "Refresh token revoked (token controller)" });
    }

    if (storedToken.expiresAt < new Date()) {
    return res.status(403).json({ message: "Refresh token expired (token controller)" });
    }

    const user = await User.findById(payload.userId);

    const accessToken = Auth.createAccessToken(user);

    return res.json({ accessToken });

  } catch (err) {

    return res.status(403).json({
        success: false,
        message: "Token refresh failed",
      });

  }

};