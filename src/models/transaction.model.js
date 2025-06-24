const pool = require('../config/db');

const createTransaction = async ({ montant, telephone, correlation_id, operateur, callback_url, status, transaction_id }) => {
  const result = await pool.query(
    `INSERT INTO transactions (montant, telephone, correlation_id, operateur, callback_url, status, transaction_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [montant, telephone, correlation_id, operateur, callback_url, status, transaction_id]
  );
  return result.rows[0];
};

module.exports = { createTransaction };
