const express = require("express");
const pool = require("./db");
const initDatabase = require("./initDb");
const port = 3000;

const app = express();

// Routes
app.get("/flights", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const intervalId = setInterval(async () => {
    try {
      const result = await pool.query(
        "SELECT id, phase, start FROM active ORDER BY id",
      );
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
