const crypto = require("crypto");
const ErrorResponse = require("@/utils/ErrorResponse");
const sendEmail = require("@/services/send-email");
const User = require("@/modules/user/models/User");

// Get token from model, create cookie and send response
function sendTokenResponse(user, statusCode, response) {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  response.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
}

module.exports = {
  /**
   * @desc     Register user
   * @route    POST /api/v1/auth/register
   * @access   Public
   */
  async register(req, res) {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    sendTokenResponse(user, 200, res);
  },

  /**
   * @desc     Login user
   * @route    POST /api/v1/auth/login
   * @access   Public
   */
  async login(req, res, next) {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Check for user
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
  },

  /**
   * @desc     Log user out / clear cookie
   * @route    GET /api/v1/auth/logout
   * @access   Private
   */
  async logout(req, res, next) {
    res.cookie("token", "none", {
      expires: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  },

  /**
   * @desc     Get current logged in user
   * @route    POST /api/v1/auth/me
   * @access   Private
   */
  async me(req, res, next) {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  },

  /**
   * @desc     Forgot password
   * @route    POST /api/v1/auth/forgotpassword
   * @access   Public
   */
  async forgotPassword(req, res, next) {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Base URL
    const baseURL = `${req.protocol}://${req.get("host")}`;

    // Create reset url
    const resetURL = `${baseURL}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  },

  /**
   * @desc     Reset password
   * @route    PUT /api/v1/auth/resetpassword/:resettoken
   * @access   Public
   */
  async resetPassword(req, res, next) {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  },
};
