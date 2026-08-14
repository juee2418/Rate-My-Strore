const express = require('express');
const router = express.Router();

const { verifyToken, requireRole } = require('../middleware/auth');
const {
  signupValidation,
  handleValidation
} = require('../middleware/validators');

const {
  getDashboardStats,
  createUser,
  listUsers,
  getUserById,
  deleteUser
} = require('../controllers/adminController');


// ==========================================
// ALL ADMIN ROUTES
// ==========================================

router.use(
  verifyToken,
  requireRole('admin')
);


// ==========================================
// DASHBOARD
// ==========================================

router.get(
  '/dashboard',
  getDashboardStats
);


// ==========================================
// USERS
// ==========================================

// Create user
router.post(
  '/users',
  signupValidation,
  handleValidation,
  createUser
);


// Get all users
router.get(
  '/users',
  listUsers
);


// Get single user
router.get(
  '/users/:id',
  getUserById
);


// Delete user
router.delete(
  '/users/:id',
  deleteUser
);


module.exports = router;