const express = require('express');
const auth = require('@/modules/user/controllers/AuthController');
const validate = require('@/middlewares/validate');
const FormValidator = require('@/modules/user/validators/UserFormValidator');
const asyncHandler = require('@/middlewares/async');
const router = express.Router();

router.post('/register', [FormValidator, validate], asyncHandler(auth.register));

module.exports = router;