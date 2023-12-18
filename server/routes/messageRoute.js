const { sendMessageCtrl, allMessages } = require("../controllers/messageController");
const verifyToken = require("../middlewares/VerifyToken");

const router = require("express").Router();

//  api/message
router.post("/message", verifyToken, sendMessageCtrl);

//  api/message/:chatId
router.get("/message/:chatId", verifyToken, allMessages);

module.exports = router;
