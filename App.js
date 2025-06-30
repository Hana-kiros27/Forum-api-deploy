const mysql2 = require("mysql2");
const express = require("express");
const cors = require("cors");
const app = express();

const port =2000;

// Middleware
app.use(cors()); // Enable CORS for frontend (development only)
app.use(express.json()); // Single JSON body parser (remove body-parser)
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies (if needed nested object)

// Routes
const installRoutes = require("./routes/installRoute");
app.use("/", installRoutes);

const userRoutes = require("./routes/userRoute");
app.use("/api/users", userRoutes);

const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const authMiddleware = require("./middleware/authMiddleware");
app.use("/api", authMiddleware, questionRoutes);
app.use("/api", authMiddleware, answerRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("welcome");
});

// Database connection
const dbConnection = require("./db/dbConfig");

async function start() {
  try {
    const connection = await dbConnection.getConnection();
    console.log(
      "Database connection established at",
      new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" })
    );
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error(
      "Database connection failed at",
      new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" }),
      ":",
      error.message
    );
    process.exit(1); // Exit if connection fails to prevent server start
  }
}

// Start server after database connection
start()
  .then(() => {
    app.listen(port, (error) => {
      if (error) {
        console.error(
          "Server start failed at",
          new Date().toLocaleString("en-US", {
            timeZone: "Africa/Addis_Ababa",
          }),
          ":",
          error.message
        );
      } else {
        console.log(
          "Server listening on port",
          port,
          "at",
          new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" })
        );
      }
    });
  })
  .catch((error) => {
    console.error(
      "Start function error at",
      new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" }),
      ":",
      error.message
    );
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error(
    "Global error handler at",
    new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" }),
    ":",
    err
  );
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "An unexpected error occurred.",
    error: err.message,
  });
});
