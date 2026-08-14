const pool = require('../config/db');

// Admin: create a store, optionally linked to a store_owner user
async function createStore(req, res) {
  try {
    const { name, email, address, owner_id } = req.body;
    if (!name) return res.status(400).json({ message: 'Store name is required' });

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email || null, address || null, owner_id || null]
    );
    res.status(201).json({ id: result.insertId, name, email, address, owner_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating store' });
  }
}

// List all stores with overall rating + (if normal user) their own submitted rating
// Query params: name, address, sortBy, order
async function listStores(req, res) {
  try {
    const { name, address, sortBy, order } = req.query;
    const allowedSort = ['name', 'address', 'avgRating'];
    const sortCol = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order && order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const currentUserId = req.user ? req.user.id : null;

    let query = `
      SELECT s.id, s.name, s.email, s.address,
        ROUND(AVG(r.rating), 1) AS avgRating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) AS myRating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [currentUserId];

    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    query += ` GROUP BY s.id ORDER BY ${sortCol === 'avgRating' ? 'avgRating' : 's.' + sortCol} ${sortOrder}`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error listing stores' });
  }
}

// Store owner dashboard: list of raters + average rating for their store
async function getOwnerDashboard(req, res) {
  try {
    const [stores] = await pool.query('SELECT id, name FROM stores WHERE owner_id = ?', [req.user.id]);
    if (stores.length === 0) {
      return res.json({ store: null, avgRating: 0, raters: [] });
    }
    const store = stores[0]; // assuming one store per owner for this project's scope

    const [[avgResult]] = await pool.query(
      'SELECT ROUND(AVG(rating), 1) AS avgRating, COUNT(*) AS totalRatings FROM ratings WHERE store_id = ?',
      [store.id]
    );

    const [raters] = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.created_at
       FROM ratings r JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ? ORDER BY r.created_at DESC`,
      [store.id]
    );

    res.json({
      store,
      avgRating: avgResult.avgRating || 0,
      totalRatings: avgResult.totalRatings,
      raters
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching owner dashboard' });
  }
}
// Admin: delete store
async function deleteStore(req, res) {
  try {
    const storeId = Number(req.params.id);

    if (!storeId || !Number.isInteger(storeId)) {
      return res.status(400).json({
        message: 'Invalid store ID'
      });
    }

    // Check store exists
    const [stores] = await pool.query(
      'SELECT id, name FROM stores WHERE id = ?',
      [storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: 'Store not found'
      });
    }

    // Delete ratings for this store first
    await pool.query(
      'DELETE FROM ratings WHERE store_id = ?',
      [storeId]
    );

    // Delete store
    await pool.query(
      'DELETE FROM stores WHERE id = ?',
      [storeId]
    );

    res.json({
      message: 'Store deleted successfully',
      store: stores[0]
    });

  } catch (err) {
    console.error('Delete store error:', err);

    res.status(500).json({
      message: 'Failed to delete store'
    });
  }
}

module.exports = {
  createStore,
  listStores,
  getOwnerDashboard,
  deleteStore
};