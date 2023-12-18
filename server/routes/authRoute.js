const { registerUserCtrl, loginUserCtrl } = require("../controllers/authController");

const router = require("express").Router();


//  api/auth/register
router.post("/register", registerUserCtrl);

//  api/auth/login
router.post("/login", loginUserCtrl);

module.exports = router;
