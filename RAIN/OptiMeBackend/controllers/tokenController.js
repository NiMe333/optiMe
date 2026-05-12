const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");

const verifyAsync = util.promisify(jwt.verify);

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.sendStatus(401);
    }

    const payload = await verifyAsync(token, process.env.REFRESH_SECRET);

    const user = await User.findById(payload.userId);

    const accessToken = createAccessToken(user);

    return res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({
        success: false,
        message: "Token refresh failed",
      });
  }
};