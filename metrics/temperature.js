// Temperature constants
const LAX_TEMP = 65; // Fahrenheit
const CRUISE_TEMP = -67; // Fahrenheit
const JFK_TEMP = 55; // Fahrenheit

/**
 * Calculate outside temperature based on current phase and progress
 * @param {string} phase - Current flight phase
 * @param {number} elapsedMinutes - Total minutes elapsed in simulation
 * @param {Array} phaseSchedule - Array of phase objects with duration and accumulated minutes
 * @returns {number} Temperature in Fahrenheit
 */
function calculateTemperature(phase, elapsedMinutes, phaseSchedule) {
  switch (phase) {
    case "Boarding":
    case "Taxi Out":
      return LAX_TEMP;

    case "Takeoff Climb": {
      // During climb, temperature changes from LAX to CRUISE
      const phaseInfo = phaseSchedule.find((p) => p.phase === "Takeoff Climb");
      const phaseStartMinutes =
        phaseInfo.accumulatedMinutes - phaseInfo.duration;
      const minutesIntoPhase = elapsedMinutes - phaseStartMinutes;
      const progress = minutesIntoPhase / phaseInfo.duration; // 0 to 1

      // Linear interpolation from LAX_TEMP to CRUISE_TEMP
      const tempChange = CRUISE_TEMP - LAX_TEMP;
      return Math.round((LAX_TEMP + tempChange * progress) * 100) / 100; // Round to 2 decimal places
    }

    case "Cruise":
      return CRUISE_TEMP;

    case "Descent": {
      // During descent, temperature changes from CRUISE to JFK
      const phaseInfo = phaseSchedule.find((p) => p.phase === "Descent");
      const phaseStartMinutes =
        phaseInfo.accumulatedMinutes - phaseInfo.duration;
      const minutesIntoPhase = elapsedMinutes - phaseStartMinutes;
      const progress = minutesIntoPhase / phaseInfo.duration; // 0 to 1

      // Linear interpolation from CRUISE_TEMP to JFK_TEMP
      const tempChange = JFK_TEMP - CRUISE_TEMP;
      return Math.round((CRUISE_TEMP + tempChange * progress) * 100) / 100; // Round to 2 decimal places
    }

    case "Landing":
    case "Taxi In":
      return JFK_TEMP;

    default:
      return LAX_TEMP;
  }
}

module.exports = { calculateTemperature };
