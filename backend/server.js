const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql'); // Configured with db.js
const path = require('path');
const config = require('./config/db'); // Ensure db.js exports the config object

const app = express();
const port = process.env.PORT || 3000;

// 🔌 Connect to database before server starts
sql.connect(config)
  .then(pool => {
    if (pool.connected) {
      console.log('✅ Connected to SQL Server');
    }
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 🟢 Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ Serve Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Products');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Fetch all categories
app.get('/api/categories', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Categories');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ✅ Fetch products by category
app.get('/api/products/category/:categoryID', async (req, res) => {
  const { categoryID } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('categoryID', sql.Int, categoryID)
      .query('SELECT * FROM Products WHERE CategoryID = @categoryID');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching products by category:', err);
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
});

// ✅ View all orders
app.get('/api/orders', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT 
        o.OrderID,
        o.CustomerName,
        o.Address,
        o.Phone,
        o.OrderDate,
        p.ProductName,
        p.Price,
        oi.Quantity
      FROM Orders o
      JOIN OrderItems oi ON o.OrderID = oi.OrderID
      JOIN Products p ON oi.ProductID = p.ProductID
      ORDER BY o.OrderDate DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ✅ Order details with customer info
app.get('/api/orders/details', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT 
        o.OrderID,
        o.CustomerID,
        c.Email, 
        o.TotalAmount,
        o.OrderDate,
        p.ProductName,
        oi.Quantity
      FROM Orders o
      JOIN OrderItems oi ON o.OrderID = oi.OrderID
      JOIN Products p ON oi.ProductID = p.ProductID
      JOIN Customers c ON o.CustomerID = c.CustomerID
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching order details:', err);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// ✅ Add New Product
app.post('/api/products', (req, res) => {
  const { ProductName, Price, CategoryID, Description, ImageURL } = req.body;
  console.log("📦 Product to Add:", req.body);

  const sql = `INSERT INTO Products (ProductName, Price, CategoryID, Description, ImageURL)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [ProductName, Price, CategoryID, Description, ImageURL], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ message: 'Error adding product' });
    }
    res.json({ message: 'Product added successfully' });
  });
});



// ✅ Delete Product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Products WHERE ProductID = @id');
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});


// ✅ Save New Order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerID, name, address, phone, items, totalAmount } = req.body;

    if (!items || items.length === 0 || !totalAmount) {
      return res.status(400).send({ error: 'Missing order data' });
    }

    const request = new sql.Request();

    request.input('CustomerID', sql.Int, customerID);
    request.input('Name', sql.NVarChar, name);
    request.input('Address', sql.NVarChar, address);
    request.input('Phone', sql.NVarChar, phone);
    request.input('TotalAmount', sql.Int, totalAmount);

    const orderInsert = await request.query(`
      INSERT INTO Orders (CustomerID, CustomerName, Address, Phone, TotalAmount)
      VALUES (@CustomerID, @Name, @Address, @Phone, @TotalAmount);
      SELECT SCOPE_IDENTITY() AS OrderID;
    `);

    const orderID = orderInsert.recordset[0].OrderID;

    for (let item of items) {
      const itemRequest = new sql.Request();
      itemRequest.input('OrderID', sql.Int, orderID);
      itemRequest.input('ProductID', sql.Int, item.productID);
      itemRequest.input('Quantity', sql.Int, item.quantity);

      await itemRequest.query(`
        INSERT INTO OrderItems (OrderID, ProductID, Quantity)
        VALUES (@OrderID, @ProductID, @Quantity);
      `);
    }

    res.status(200).send('Order saved successfully');
  } catch (error) {
    console.error('❌ DB error while saving order:', error);
    res.status(500).send('Failed to save order');
  }
});




app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
