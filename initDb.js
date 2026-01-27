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

      // Create flights table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS flights (
          id SERIAL PRIMARY KEY,
          start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          end_time TIMESTAMP,
          status status_enum DEFAULT 'Active'
        )
      `);

      // Create metrics table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS metrics (
          id SERIAL PRIMARY KEY,
          flight_id INTEGER NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
          finish TIMESTAMP,
          phase phase_enum NOT NULL,
          altitude INTEGER,
          airspeed INTEGER,
          heading INTEGER,
          latitude DECIMAL(9, 6),
          longitude DECIMAL(9, 6),
          fuel_remaining DECIMAL(5, 2),
          outside_temp DECIMAL(5, 2),
          eta DECIMAL(5, 2)
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
