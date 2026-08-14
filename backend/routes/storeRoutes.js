const express = require('express');
const router = express.Router();

const { verifyToken, requireRole } = require('../middleware/auth');

const {
  createStore,
  listStores,
  getOwnerDashboard,
  deleteStore
} = require('../controllers/storeController');


// Any logged-in user can view the store list (with search/sort)
router.get(
  '/',
  verifyToken,
  listStores
);


// Only admin can create stores
router.post(
  '/',
  verifyToken,
  requireRole('admin'),
  createStore
);


// Only admin can delete stores
router.delete(
  '/:id',
  verifyToken,
  requireRole('admin'),
  deleteStore
);


// Store owner's own dashboard
router.get(
  '/owner/dashboard',
  verifyToken,
  requireRole('store_owner'),
  getOwnerDashboard
);


module.exports = router;