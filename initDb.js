const pool = require("./db");

const initDatabase = async () => {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Create ENUM types if they don't exist
      await pool.query(`
        DO $$ BEGIN
          CREATE TYPE phase_enum AS ENUM (
            'Boarding',
            'Taxi Out',
            'Takeoff Climb',
            'Cruise',
            'Descent',
            'Landing',
            'Taxi In'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await pool.query(`
        DO $$ BEGIN
          CREATE TYPE status_enum AS ENUM ('Active', 'Completed');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      // Create table with proper schema
      await pool.query(`
        CREATE TABLE IF NOT EXISTS active (
          id SERIAL PRIMARY KEY,
          phase phase_enum DEFAULT 'Boarding',
          start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status status_enum DEFAULT 'Active'
        )
      `);

      console.log("Database initialized successfully");
      return;
    } catch (err) {
      retries++;
      if (retries >= maxRetries) {
        console.error("Error initializing database:", err);
        process.exit(1);
      }
      console.log(`Database not ready, retrying... (${retries}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

module.exports = initDatabase;
