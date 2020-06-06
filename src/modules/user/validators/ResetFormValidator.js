const { checkSchema } = require("express-validator");

module.exports = checkSchema({
  password: {
    isLength: {
      errorMessage: "Password must have at least 6 characters",
      options: {
        min: 6,
      },
    },
  },
});
