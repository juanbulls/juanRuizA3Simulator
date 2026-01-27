const pool = require("./db");

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS active (
        id SERIAL PRIMARY KEY,
        phase VARCHAR(50),
        start TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
};

module.exports = initDatabase;
