const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// =====================================================
// DASHBOARD STATS
// =====================================================

async function getDashboardStats(req, res) {
  try {
    const [[{ totalUsers }]] = await pool.query(
      'SELECT COUNT(*) AS totalUsers FROM users'
    );

    const [[{ totalStores }]] = await pool.query(
      'SELECT COUNT(*) AS totalStores FROM stores'
    );

    const [[{ totalRatings }]] = await pool.query(
      'SELECT COUNT(*) AS totalRatings FROM ratings'
    );

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Error fetching dashboard stats'
    });
  }
}


// =====================================================
// CREATE USER
// =====================================================

async function createUser(req, res) {
  try {
    const {
      name,
      email,
      address,
      password,
      role
    } = req.body;

    const allowedRoles = [
      'admin',
      'normal_user',
      'store_owner'
    ];

    const finalRole = allowedRoles.includes(role)
      ? role
      : 'normal_user';

    // Check email
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      `INSERT INTO users
      (name, email, password, address, role)
      VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashed,
        address,
        finalRole
      ]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      address,
      role: finalRole
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Error creating user'
    });
  }
}


// =====================================================
// LIST USERS
// =====================================================

async function listUsers(req, res) {
  try {

    const {
      name,
      email,
      address,
      role,
      sortBy,
      order
    } = req.query;

    const allowedSort = [
      'name',
      'email',
      'address',
      'role',
      'created_at'
    ];

    const sortCol = allowedSort.includes(sortBy)
      ? sortBy
      : 'name';

    const sortOrder =
      order &&
      order.toLowerCase() === 'desc'
        ? 'DESC'
        : 'ASC';

    let query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,

        (
          SELECT AVG(r.rating)
          FROM ratings r
          JOIN stores s
            ON r.store_id = s.id
          WHERE s.owner_id = u.id
        ) AS storeRating

      FROM users u
      WHERE 1=1
    `;

    const params = [];

    // Name filter
    if (name) {
      query += ' AND u.name LIKE ?';
      params.push(`%${name}%`);
    }

    // Email filter
    if (email) {
      query += ' AND u.email LIKE ?';
      params.push(`%${email}%`);
    }

    // Address filter
    if (address) {
      query += ' AND u.address LIKE ?';
      params.push(`%${address}%`);
    }

    // Role filter
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    query += ` ORDER BY u.${sortCol} ${sortOrder}`;

    const [rows] = await pool.query(
      query,
      params
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Error listing users'
    });
  }
}


// =====================================================
// LIST USERS BY ROLE
// =====================================================

async function listUsersByRole(req, res) {

  try {

    const { role } = req.query;

    let query = `
      SELECT
        id,
        name,
        email,
        address,
        role
      FROM users
      WHERE 1=1
    `;

    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY name ASC';

    const [rows] = await pool.query(
      query,
      params
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Error listing users'
    });
  }
}


// =====================================================
// GET USER BY ID
// =====================================================

async function getUserById(req, res) {

  try {

    const [rows] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        address,
        role
      FROM users
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        message: 'User not found'
      });

    }

    const user = rows[0];

    // Store owner rating
    if (user.role === 'store_owner') {

      const [[stats]] = await pool.query(
        `
        SELECT
          AVG(r.rating) AS avgRating,
          COUNT(r.id) AS ratingCount

        FROM ratings r

        JOIN stores s
          ON r.store_id = s.id

        WHERE s.owner_id = ?
        `,
        [user.id]
      );

      user.avgRating =
        stats.avgRating
          ? parseFloat(stats.avgRating).toFixed(1)
          : null;

      user.ratingCount =
        stats.ratingCount;
    }

    res.json(user);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Error fetching user'
    });
  }
}


// =====================================================
// DELETE USER
// =====================================================

async function deleteUser(req, res) {

  const connection = await pool.getConnection();

  try {

    const userId = req.params.id;

    // -----------------------------------------
    // Check user exists
    // -----------------------------------------

    const [users] = await connection.query(
      `
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    if (users.length === 0) {

      connection.release();

      return res.status(404).json({
        message: 'User not found'
      });

    }

    const user = users[0];

    // -----------------------------------------
    // Prevent admin from deleting themselves
    // -----------------------------------------

    if (
      req.user &&
      Number(req.user.id) === Number(userId)
    ) {

      connection.release();

      return res.status(400).json({
        message: 'You cannot delete your own admin account.'
      });

    }

    // -----------------------------------------
    // Start transaction
    // -----------------------------------------

    await connection.beginTransaction();


    // -----------------------------------------
    // If store owner:
    // delete ratings belonging to their stores
    // -----------------------------------------

    await connection.query(
      `
      DELETE r
      FROM ratings r
      INNER JOIN stores s
        ON r.store_id = s.id
      WHERE s.owner_id = ?
      `,
      [userId]
    );


    // -----------------------------------------
    // Delete stores owned by user
    // -----------------------------------------

    await connection.query(
      `
      DELETE FROM stores
      WHERE owner_id = ?
      `,
      [userId]
    );


    // -----------------------------------------
    // Delete ratings submitted by user
    // -----------------------------------------

    await connection.query(
      `
      DELETE FROM ratings
      WHERE user_id = ?
      `,
      [userId]
    );


    // -----------------------------------------
    // Delete user
    // -----------------------------------------

    const [result] = await connection.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [userId]
    );


    // -----------------------------------------
    // Check deletion
    // -----------------------------------------

    if (result.affectedRows === 0) {

      await connection.rollback();
      connection.release();

      return res.status(404).json({
        message: 'User not found'
      });

    }


    // -----------------------------------------
    // Commit
    // -----------------------------------------

    await connection.commit();

    connection.release();


    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    console.error('DELETE USER ERROR:', err);

    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        'Rollback error:',
        rollbackError
      );
    }

    connection.release();

    res.status(500).json({
      message: 'Error deleting user',
      error: err.message
    });
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getDashboardStats,
  createUser,
  listUsers,
  listUsersByRole,
  getUserById,
  deleteUser
};