const { body, validationResult } = require('express-validator')
const adoptionValidationRules = () => {
  return [
    body('firstName')
    .notEmpty()
    .withMessage("Please enter a First Name"),
    body('lastName')
    .notEmpty()
    .withMessage("Please enter a Last Name"),
    body('address')
    .notEmpty()
    .withMessage("Please enter an Address"),
    body('email')
    .isEmail()
    .withMessage("Please enter a valid Email Address")
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
      return next();
  }
  return res.status(400).json({
    errors: errors.array()
  });
}

module.exports = {
  adoptionValidationRules,
  validate,
}