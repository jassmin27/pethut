const { body, validationResult } = require('express-validator')
const petValidationRules = () => {
  return [
    body('name')
    .notEmpty()
    .withMessage("Please enter a Name"),
    body('breed')
    .notEmpty()
    .withMessage("Please enter a Breed"),
    body('gender')
    .notEmpty()
    .withMessage("Please select a Gender"),
    body('age')
    .isNumeric()
    .withMessage("Please enter a valid Age"),
    body('description')
    .notEmpty()
    .withMessage("Please enter a Description")
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
      return next();
  }
  return res.status(400).json({ errors: errors.array() });
}

module.exports = {
  petValidationRules,
  validate,
}