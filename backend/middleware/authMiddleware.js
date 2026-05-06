const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Login required."
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
}

module.exports = authMiddleware;
