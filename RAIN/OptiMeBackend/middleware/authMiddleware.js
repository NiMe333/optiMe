const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Header missing (authMiddleware)"
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_SECRET,
    (err, payload) => {

      if (err) {
        return res.status(401).json({
            success: false,
            message: "error with verification (authMiddleware)"
        });
      }

      req.user = payload;
      next();
    }

  );

}

module.exports = authMiddleware; //if this export only this gets exported and doesnt need to be called trough an object