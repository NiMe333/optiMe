const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const Auth = require("../services/auth")

const verifyAsync = util.promisify(jwt.verify);

exports.refresh = async (req, res) => {
  console.log("COOKIES:", req.cookies);
  try {
    const token = req.cookies.refreshToken;
    console.log("token in refresh", token)

    if (!token) {
      return res.sendStatus(401);
    }

    const payload = await verifyAsync(token, process.env.REFRESH_SECRET);
    console.log("PAYLOAD:", payload);

    const user = await User.findById(payload.userId);

    console.log("user found", user);

    const accessToken = Auth.createAccessToken(user);

    console.log("refreshed acces token:", accessToken);

    return res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({
        success: false,
        message: "Token refresh failed",
      });
      console.log("VERIFY ERROR:", err.name, err.message);
  }
};