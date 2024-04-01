const express = require("express");
const {
  requireSignIn,
  registerController,
  loginController,
  updateUserController,
} = require("../controllers/userController");

//RES OBJECT
const router = express.Router();

//ROUTES
//REGISTER || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//UPDATE || PUT
router.put("/update-user", requireSignIn, updateUserController);

//EXPORT
module.exports = router;
