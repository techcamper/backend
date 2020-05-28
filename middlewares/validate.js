const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  let extractedErrors = {};

  if (errors.isEmpty()) {
    return next();
  }

  errors.array().map(err => (extractedErrors[err.param] = err.msg));

  return res.status(422).json({
    success: false,
    errors: extractedErrors
  });
};
