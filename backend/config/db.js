const sql = require('mssql');

const config = {
    user: 'mobileuser',
    password: 'your_password',
    server: 'localhost',
    port: 1433,
    database: 'MobileStoreDB',
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  };
sql.connect(config)
  .then(() => console.log("✅ Connected to SQL Server"))
  .catch(err => console.error("❌ DB Connection Error:", err));

module.exports = config;
