const asyncHandler = require("express-async-handler");
const User = require("../models/userModal");
/**
 * @description get all users
 * @router /api/user?search=adam
 * @method POST
 * @access private (only logged in user)
 */

const getAllUsersCtrl = asyncHandler(async (req, res) => {
  const { search } = req.query;

  // Get the authenticated user ID from req.user
  const authenticatedUserId = req.user.id;

  // Exclude the authenticated user from the query
  const users = await User.find({
    username: { $regex: new RegExp(search, "i") }, // Case-insensitive search
    _id: { $ne: authenticatedUserId }, // Exclude the authenticated user
  });

  // Handle the case when no users are found
  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }

  // Respond with the list of users
  res.status(200).json({ users });
});

module.exports = { getAllUsersCtrl };
