const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const pool = require("./db");
const initDatabase = require("./initDb");
const port = 3000;

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Juan Ruiz A3 Simulator API",
      version: "1.0.0",
      description: "Flight Simulator API with Server-Sent Events",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /flights:
 *   get:
 *     summary: Get real-time flight data stream
 *     description: Server-Sent Events endpoint that streams active flight records every second
 *     responses:
 *       200:
 *         description: SSE stream of flight data
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Flight ID
 *                   phase:
 *                     type: string
 *                     description: Current flight phase
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: Flight start timestamp
 */
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
