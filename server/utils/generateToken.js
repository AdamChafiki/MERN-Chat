const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(payload, secret, { expiresIn: "30d" });

  return token;
};

module.exports = generateToken;
