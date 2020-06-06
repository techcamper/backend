const { checkSchema } = require("express-validator");
const User = require("@/modules/user/models/User");
const ROLES = require("@/modules/user/constants/roles");

function validateUniqueUserEmail(value, { req }) {
  const filters = {
    email: value,
  };

  if (req.params.id) {
    filters._id = {
      $ne: req.params.id,
    };
  }

  return User.findOne(filters)
    .then((user) => {
      if (user) {
        return Promise.reject();
      }
    })
    .catch((err) => {
      return Promise.reject();
    });
}

module.exports = checkSchema({
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "Please add a name",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Please add an email",
    },
    custom: {
      errorMessage: "The email has already been taken",
      options: validateUniqueUserEmail,
    },
  },
  role: {
    optional: true,
    isIn: {
      options: [ROLES],
      errorMessage: `Please fill in with one of (${ROLES.join(", ")})`,
    },
  },
  password: {
    isLength: {
      errorMessage: "Password must have at least 6 characters",
      options: {
        min: 6,
      },
    },
    notEmpty: {
      errorMessage: "Please add a password",
    },
  },
});
