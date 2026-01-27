const pool = require("./db");

// Time scale: 1 second of real time = TIME_SCALE seconds of simulation time
// Example: 60 means 1 second real time = 1 minute simulation time
const TIME_SCALE = 60;

// Phase durations in minutes with accumulated times
const PHASE_SCHEDULE = [
  { phase: "Boarding", duration: 30, accumulatedMinutes: 30 },
  { phase: "Taxi Out", duration: 15, accumulatedMinutes: 45 }, // 30 + 15
  { phase: "Takeoff Climb", duration: 25, accumulatedMinutes: 70 }, // 45 + 25
  { phase: "Cruise", duration: 210, accumulatedMinutes: 280 }, // 70 + 210 (3.5 hours)
  { phase: "Descent", duration: 25, accumulatedMinutes: 305 }, // 280 + 25
  { phase: "Landing", duration: 5, accumulatedMinutes: 310 }, // 305 + 5
  { phase: "Taxi In", duration: 10, accumulatedMinutes: 320 }, // 310 + 10
];

/**
 * Calculate current phase based on elapsed simulation time
 * @param {number} elapsedMinutes - Minutes elapsed in simulation time
 * @returns {string} Current phase
 */
function getCurrentPhase(elapsedMinutes) {
  for (let i = 0; i < PHASE_SCHEDULE.length; i++) {
    if (elapsedMinutes < PHASE_SCHEDULE[i].accumulatedMinutes) {
      return PHASE_SCHEDULE[i].phase;
    }
  }
  // Flight completed
  return "Taxi In"; // Keep last phase
}

/**
 * Update metrics for all active flights
 */
async function updateFlightMetrics() {
  try {
    // Get all active flights
    const result = await pool.query(
      "SELECT id, start_time FROM flights WHERE status = 'Active'",
    );

    const flights = result.rows;

    for (const flight of flights) {
      const now = new Date();
      const startTime = new Date(flight.start_time);

      // Calculate elapsed time in real seconds
      const elapsedRealSeconds = (now - startTime) / 1000;

      // Convert to simulation minutes
      const elapsedSimMinutes = (elapsedRealSeconds * TIME_SCALE) / 60;

      // Determine current phase
      const currentPhase = getCurrentPhase(elapsedSimMinutes);

      // Check if we have an existing metric for this flight
      const existingMetric = await pool.query(
        `SELECT id, phase FROM metrics 
         WHERE flight_id = $1 
         ORDER BY id DESC 
         LIMIT 1`,
        [flight.id],
      );

      if (existingMetric.rows.length > 0) {
        // Update if phase changed
        if (existingMetric.rows[0].phase !== currentPhase) {
          await pool.query(
            `INSERT INTO metrics (flight_id, phase) 
             VALUES ($1, $2)`,
            [flight.id, currentPhase],
          );
        }
      } else {
        // No metrics yet, insert first one
        await pool.query(
          `INSERT INTO metrics (flight_id, phase) 
           VALUES ($1, $2)`,
          [flight.id, currentPhase],
        );
      }

      // Check if flight is completed (all phases done)
      if (
        elapsedSimMinutes >=
        PHASE_SCHEDULE[PHASE_SCHEDULE.length - 1].accumulatedMinutes
      ) {
        await pool.query(
          "UPDATE flights SET status = 'Completed', end_time = NOW() WHERE id = $1",
          [flight.id],
        );
      }
    }

    console.log(`Updated metrics for ${flights.length} active flight(s)`);
  } catch (err) {
    console.error("Error updating flight metrics:", err);
  }
}

module.exports = { updateFlightMetrics, TIME_SCALE, PHASE_SCHEDULE };
