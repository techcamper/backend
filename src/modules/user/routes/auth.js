const express = require("express");
const auth = require("@/modules/user/controllers/AuthController");
const validate = require("@/middlewares/validate");
const FormValidator = require("@/modules/user/validators/UserFormValidator");
const ResetValidator = require("@/modules/user/validators/ResetFormValidator");
const asyncHandler = require("@/middlewares/async");
const { protect } = require("@/middlewares/auth");
const router = express.Router();

router.post(
  "/register",
  [FormValidator, validate],
  asyncHandler(auth.register)
);
router.post("/login", asyncHandler(auth.login));
router.post("/forgotpassword", asyncHandler(auth.forgotPassword));
router.put(
  "/resetpassword/:resettoken",
  [ResetValidator, validate],
  asyncHandler(auth.resetPassword)
);
router.get("/logout", [protect], asyncHandler(auth.logout));
router.get("/me", [protect], asyncHandler(auth.me));

module.exports = router;
