const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const tokenParts = authHeader && authHeader.split(" ");
  const token = tokenParts && tokenParts[0] === "Bearer" && tokenParts[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden", error: err.message });
    }

    req.user = user;
    next();
  });
}

module.exports = verifyToken;
