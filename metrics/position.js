// Position constants
const LAX_LAT = 33.94;
const LAX_LNG = 118.41;
const JFK_LAT = 40.64;
const JFK_LNG = 73.78;

/**
 * Calculate position (latitude and longitude) based on current phase and progress
 * @param {string} phase - Current flight phase
 * @param {number} elapsedMinutes - Total minutes elapsed in simulation
 * @param {Array} phaseSchedule - Array of phase objects with duration and accumulated minutes
 * @returns {object} Object with latitude and longitude
 */
function calculatePosition(phase, elapsedMinutes, phaseSchedule) {
  switch (phase) {
    case "Boarding":
    case "Taxi Out":
    case "Takeoff Climb":
      // Before cruise, at LAX
      return { latitude: LAX_LAT, longitude: LAX_LNG };

    case "Cruise": {
      // During cruise, interpolate based on progress through cruise phase
      const phaseInfo = phaseSchedule.find((p) => p.phase === "Cruise");
      const phaseStartMinutes =
        phaseInfo.accumulatedMinutes - phaseInfo.duration;
      const minutesIntoPhase = elapsedMinutes - phaseStartMinutes;
      const progress = minutesIntoPhase / phaseInfo.duration; // 0 to 1

      // Linear interpolation from LAX to JFK
      const latitude = LAX_LAT + (JFK_LAT - LAX_LAT) * progress;
      const longitude = LAX_LNG + (JFK_LNG - LAX_LNG) * progress;

      return {
        latitude: Math.round(latitude * 100) / 100, // Round to 2 decimal places
        longitude: Math.round(longitude * 100) / 100,
      };
    }

    case "Descent":
    case "Landing":
    case "Taxi In":
      // After cruise, at JFK
      return { latitude: JFK_LAT, longitude: JFK_LNG };

    default:
      return { latitude: LAX_LAT, longitude: LAX_LNG };
  }
}

module.exports = { calculatePosition };
