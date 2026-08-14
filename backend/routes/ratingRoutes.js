const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { ratingValidation, handleValidation } = require('../middleware/validators');
const { submitRating } = require('../controllers/ratingController');

// Only normal users submit ratings
router.post(
  '/:storeId',
  verifyToken,
  requireRole('normal_user'),
  ratingValidation,
  handleValidation,
  submitRating
);

module.exports = router;
