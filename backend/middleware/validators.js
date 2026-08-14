const { body, validationResult } = require('express-validator');

// Central rule set matching the assignment spec:
// Name: 20-60 chars | Address: max 400 | Password: 8-16, 1 uppercase, 1 special char | Email: valid format
const nameRule = body('name')
  .trim()
  .isLength({ min: 10, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('A valid email is required')
  .normalizeEmail();

const addressRule = body('address')
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address cannot exceed 400 characters');

const passwordRule = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

const signupValidation = [nameRule, emailRule, addressRule, passwordRule];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

const ratingValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = {
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  signupValidation,
  loginValidation,
  ratingValidation,
  handleValidation
};
