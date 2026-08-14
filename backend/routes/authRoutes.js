const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const { signupValidation, loginValidation, handleValidation } = require('../middleware/validators');
const { verifyToken } = require('../middleware/auth');

router.post('/signup', signupValidation, handleValidation, signup);
router.post('/login', loginValidation, handleValidation, login);
router.put('/update-password', verifyToken, updatePassword);

module.exports = router;
