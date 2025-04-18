const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../config/db');

// ✅ Simple Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT * FROM Customers WHERE Email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: '❌ User not found' });
    }

    const user = result.recordset[0];

    // 🔍 Direct plain text password check
    if (user.Password !== password) {
      return res.status(401).json({ success: false, message: '❌ Invalid email or password' });
    }

    res.json({
      success: true,
      message: '✅ Login successful',
      customerID: user.CustomerID,
      name: user.Name
    });

  } catch (err) {
    console.error('🔥 Login Error:', err);
    res.status(500).json({ success: false, message: '⚠️ Login failed due to server error' });
  }
});

module.exports = router;
