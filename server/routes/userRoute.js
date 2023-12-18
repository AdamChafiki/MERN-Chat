const { getAllUsersCtrl } = require("../controllers/userController");
const verifyToken = require("../middlewares/VerifyToken");

const router = require("express").Router();

//  api/user?search=adam
router.get("/user", verifyToken, getAllUsersCtrl);

module.exports = router;
