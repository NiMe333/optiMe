const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("auth header", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Header missing"
    });
  }

  const token = authHeader.split(" ")[1];


  jwt.verify(
    token,
    process.env.ACCESS_SECRET,
    (err, payload) => {
       console.log("auth payload", payload);
      if (err) {
        return res.status(401).json({
            success: false,
            message: "error with verification"
        });
      }

      console.log("payload after error", payload);
      req.user = payload;
      next();
    }
  );
}

module.exports = authMiddleware; //if this export only this gets exported and doesnt need to be called trough an object