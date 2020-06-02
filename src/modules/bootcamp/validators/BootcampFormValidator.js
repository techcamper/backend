const { checkSchema } = require('express-validator');
const Bootcamp = require('@/modules/bootcamp/models/Bootcamp');
const CAREERS = require('@/modules/bootcamp/constants/careers');

function validateUniqueBootcampName(value, { req }) {
  const filters = { name: value };

  if (req.params.id) {
    filters._id = { $ne: req.params.id };
  }

  return Bootcamp.findOne(filters)
    .then((bootcamp) => {
      if (bootcamp) {
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
      errorMessage: 'Please add a name',
    },
    isLength: {
      errorMessage: 'Name can not be more than 50 characters',
      options: { max: 50 },
    },
    custom: {
      errorMessage: 'The name has already been taken',
      options: validateUniqueBootcampName,
    },
  },
  description: {
    notEmpty: {
      errorMessage: 'Please add a description',
    },
    isLength: {
      errorMessage: 'Description can not be more than 50 characters',
      options: { max: 500 },
    },
  },
  website: {
    optional: true,
    isURL: {
      errorMessage: 'Please use a valid URL with HTTP or HTTPS',
    },
  },
  phone: {
    isLength: {
      errorMessage: 'Phone number can not be longer than 20 characters',
      options: { max: 20 },
    },
  },
  email: {
    optional: true,
    isEmail: {
      errorMessage: 'Please add a valid email',
    },
  },
  address: {
    notEmpty: {
      errorMessage: 'Please add an address',
    },
  },
  careers: {
    notEmpty: {
      errorMessage: 'Please choose a career',
    },
    isIn: {
      options: [CAREERS],
      errorMessage: `Please fill in with one of (${CAREERS.join(', ')})`,
    },
  },
  averageRating: {
    optional: true,
    isLength: {
      errorMessage: 'Rating must be between 1 and 10',
      options: { min: 1, max: 10 },
    },
  },
});
