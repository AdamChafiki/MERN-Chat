const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModal");

/**
 * @description accessChat
 * @router /api/chat
 * @method POST
 * @access private (only logged in user)
 */

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name avatar email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      let FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

/**
 * @description fetch chats
 * @router /api/chat
 * @method GET
 * @access private (only logged in user)
 */

const fetchChats = asyncHandler(async (req, res) => {
  let chats = await Chat.find({
    $or: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { groupAdmin: req.user.id },
    ],
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name avatar email",
  });

  res.status(200).json(chats);
});

/**
 * @description create group
 * @router /api/chat/group
 * @method POST
 * @access private (only logged in user)
 */

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;
  const groupUsers = JSON.parse(users);

  if (groupUsers.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to create a group!" });
  }

  const groupChat = await Chat.create({
    chatName: name,
    users: groupUsers,
    isGroupChat: true,
    groupAdmin: req.user.id,
  });

  const populatedGroupChat = await Chat.populate(groupChat, {
    path: "users",
    select: "-password",
  });

  const finalGroupChat = await Chat.populate(populatedGroupChat, {
    path: "groupAdmin",
    select: "-password",
  });

  res.status(201).json(finalGroupChat);
});

/**
 * @description rename group
 * @router /api/chat/group/rename
 * @method PUT
 * @access private (only admin of the group)
 */

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const chat = await Chat.findById({ _id: chatId });
  if (!chat) {
    return res.status(400).json({ message: "Chat not found" });
  }
  if (chat.groupAdmin.toString() !== req.user.id) {
    return res.status(400).json({ message: "Not authorized" });
  }
  const updateGroupName = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(updateGroupName);
});

/**
 * @description rename group
 * @router /api/chat/group/add
 * @method PUT
 * @access private (only admin of the group)
 */

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById({ _id: chatId });
  if (!chat) {
    return res.status(400).json({ message: "Chat not found" });
  }
  if (chat.groupAdmin.toString() !== req.user.id) {
    return res.status(400).json({ message: "Not authorized" });
  }

  const user = await Chat.findOne({ users: { $in: [userId] } });
  if (user) {
    return res.status(400).json({ message: "User already exits" });
  }
  const updateGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(updateGroup);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
};
