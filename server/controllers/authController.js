const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModal");
const generateToken = require("../utils/generateToken");
/**
 * @description Register User
 * @router /api/auth/register
 * @method POST
 * @access public
 */

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "Email is already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  await user.save();
  res.status(201).json({ message: "You registerd successfully ! " });
});

/**
 * @description Login User
 * @router /api/auth/login
 * @method POST
 * @access public
 */

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Email or password is invalid" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Email or password is invalid" });
  }

  res.status(200).json({
    _id: user._id,
    user: user.username,
    avatar:user.avatar,
    token: generateToken({ id: user._id }),
  });
});
