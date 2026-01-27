const express = require("express");
const pool = require("./db");
const initDatabase = require("./initDb");
const port = 3000;

const app = express();

// Routes
app.get("/flights", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const intervalId = setInterval(() => {
    res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
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
