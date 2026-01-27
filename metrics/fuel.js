// Fuel constants
const FUEL_BEFORE_TAKEOFF = 65; // percentage
const FUEL_AFTER_LANDING = 18; // percentage

/**
 * Calculate fuel remaining based on current phase and progress
 * @param {string} phase - Current flight phase
 * @param {number} elapsedMinutes - Total minutes elapsed in simulation
 * @param {Array} phaseSchedule - Array of phase objects with duration and accumulated minutes
 * @returns {number} Fuel remaining as percentage
 */
function calculateFuel(phase, elapsedMinutes, phaseSchedule) {
  // Get the accumulated minutes for key phases
  const taxiOutEnd = phaseSchedule.find(
    (p) => p.phase === "Taxi Out",
  ).accumulatedMinutes;
  const landingEnd = phaseSchedule.find(
    (p) => p.phase === "Landing",
  ).accumulatedMinutes;

  switch (phase) {
    case "Boarding":
    case "Taxi Out":
      // Before takeoff
      return FUEL_BEFORE_TAKEOFF;

    case "Takeoff Climb":
    case "Cruise":
    case "Descent":
    case "Landing": {
      // During flight, linearly decrease from 65% to 18%
      const flightStartMinutes = taxiOutEnd;
      const flightEndMinutes = landingEnd;
      const flightDuration = flightEndMinutes - flightStartMinutes;
      const minutesIntoFlight = elapsedMinutes - flightStartMinutes;
      const progress = minutesIntoFlight / flightDuration; // 0 to 1

      // Linear interpolation from FUEL_BEFORE_TAKEOFF to FUEL_AFTER_LANDING
      const fuelConsumed =
        (FUEL_BEFORE_TAKEOFF - FUEL_AFTER_LANDING) * progress;
      return Math.round((FUEL_BEFORE_TAKEOFF - fuelConsumed) * 100) / 100; // Round to 2 decimal places
    }

    case "Taxi In":
      // After landing
      return FUEL_AFTER_LANDING;

    default:
      return FUEL_BEFORE_TAKEOFF;
  }
}

module.exports = { calculateFuel };
