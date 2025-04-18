const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('./config/db'); // Connects to db.js
const mssql = require('mssql');     // Required for pool request
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve HTML, CSS, JS from root folder
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// 🟢 Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);  // 👈 Enable auth API routes

// ✅ Test route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


// ✅ Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching all products...');
    const pool = await mssql.connect(sql); 
    const result = await pool.request().query('SELECT * FROM Products');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Fetch all categories
app.get('/categories', async (req, res) => {
  try {
    const pool = await mssql.connect(sql);
    const result = await pool.request().query('SELECT * FROM Categories');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ✅ Fetch products by category
app.get('/products/:categoryID', async (req, res) => {
  const { categoryID } = req.params;
  try {
    const pool = await mssql.connect(sql);
    const result = await pool
      .request()
      .input('categoryID', mssql.Int, categoryID)
      .query('SELECT * FROM Products WHERE CategoryID = @categoryID');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching products by category:', err);
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
