const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
} = require("../controllers/chatController");
const verifyToken = require("../middlewares/VerifyToken");

const router = require("express").Router();

//  api/chat
router
  .route("/chat")
  .get(verifyToken, fetchChats)
  .post(verifyToken, accessChat);

// api/chat/group
router.route("/chat/group").post(verifyToken, createGroupChat);

// api/chat/group/rename
router.route("/chat/group/rename").put(verifyToken, renameGroupChat);

// api/chat/group/add
router.route("/chat/group/add").put(verifyToken, addToGroup);

module.exports = router;
