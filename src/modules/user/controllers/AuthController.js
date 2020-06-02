const ErrorResponse = require('@/utils/ErrorResponse');
const User = require('@/modules/user/models/User');

module.exports = {
  /**
   * @desc     Register user
   * @route    POST /api/v1/auth/register
   * @access   Public
   */
  async register(req, res) {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });

    res.status(200).json({
      success: true
    });
  }
};