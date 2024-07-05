const express = require("express");
const router = express.Router();

//Importing the authvalidation functions for login and register
const {
  registerValidation,
  loginValidation,
} = require("../middleware/authValidation.middleware");

//Importing functions from auth controller
const {
  login,
  register,
  resendVerification,
  verifyUser,
} = require("../controller/auth.controller");

//Importing the JWT verifyer from auth middleware
const verifyToken = require("../middleware/auth.middleware");

//Register route with register validation
router.post("/register", registerValidation, register);

//Login route with login validation
router.post("/login", loginValidation, login);

//Resend Verification
router.post("/resend-verification", resendVerification);
//Verify User
router.post("/verify-user/:token", verifyUser);

module.exports = router;
