const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const pool = require("./db");
const initDatabase = require("./initDb");
const port = 3000;

const app = express();

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.post("/flights", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO flights DEFAULT VALUES RETURNING *",
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating flight:", err);
    res.status(500).json({ error: "Failed to create flight" });
  }
});

app.get("/flights", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const intervalId = setInterval(async () => {
    try {
      const result = await pool.query("SELECT * FROM flights ORDER BY id");
      const flights = result.rows;
      res.write(`data: ${JSON.stringify(flights)}\n\n`);
    } catch (err) {
      console.error("Error querying database:", err);
      res.write(`data: ${JSON.stringify({ error: "Database error" })}\n\n`);
    }
  }, 1000);

  res.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

// Start server after database initialization
initDatabase().then(() => {
  app.listen(port, () =>
    console.log(
      `Juan Ruiz simulator application server started on port ${port}`,
    ),
  );
});
