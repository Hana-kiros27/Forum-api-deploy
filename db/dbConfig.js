const mysql2 = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Optional: Set a reasonable limit
  waitForConnections: true, // Optional: Wait for available connections
  queueLimit: 0, // Optional: No limit on queue size
});

dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the application if connection fails
  } else {
    console.log("Successfully connected to the database.");
    connection.release(); // Release the connection back to the pool
  }
});

// Test the pool with a promise-based query
dbConnection
  .promise()
  .query("SELECT 1")
  .then(() => console.log("Database pool is operational"))
  .catch((err) => {
    console.error("Database pool test failed:", err.message);
    process.exit(1);
  });

module.exports = dbConnection.promise();
