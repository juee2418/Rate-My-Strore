const pool = require('../config/db');

// Normal user submits or updates (upsert) their rating for a store
async function submitRating(req, res) {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // ON DUPLICATE KEY UPDATE relies on the unique_user_store constraint
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [userId, storeId, rating]
    );

    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting rating' });
  }
}

module.exports = { submitRating };
