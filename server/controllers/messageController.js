const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModal");
const User = require("../models/userModal");
const Chat = require("../models/chatModel");

/**
 * @description send message
 * @router /message
 * @method POST
 * @access private (only logged in user)
 */

const sendMessageCtrl = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  // Create the new message
  const newMessage = {
    sender: req.user.id,
    content,
    chat: chatId,
  };

  var message = await Message.create(newMessage);

  message = await message.populate("sender", "username avatar");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "username avatar email",
  });

  await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

  res.json(message);
});

/**
//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
 */

const allMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "username avatar email")
    .populate("chat");
  res.status(200).json(messages);
});

module.exports = { allMessages, sendMessageCtrl };
