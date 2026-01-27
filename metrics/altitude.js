// Altitude constants
const LAX_ALTITUDE = 125; // feet
const CRUISING_ALTITUDE = 33000; // feet
const JFK_ALTITUDE = 13; // feet

/**
 * Calculate altitude based on current phase and progress
 * @param {string} phase - Current flight phase
 * @param {number} elapsedMinutes - Total minutes elapsed in simulation
 * @param {Array} phaseSchedule - Array of phase objects with duration and accumulated minutes
 * @returns {number} Altitude in feet
 */
function calculateAltitude(phase, elapsedMinutes, phaseSchedule) {
  switch (phase) {
    case "Boarding":
    case "Taxi Out":
      return LAX_ALTITUDE;

    case "Takeoff Climb": {
      // Find the phase in schedule
      const phaseInfo = phaseSchedule.find((p) => p.phase === "Takeoff Climb");
      const phaseStartMinutes =
        phaseInfo.accumulatedMinutes - phaseInfo.duration;
      const minutesIntoPhase = elapsedMinutes - phaseStartMinutes;
      const progress = minutesIntoPhase / phaseInfo.duration; // 0 to 1

      // Linear interpolation from LAX_ALTITUDE to CRUISING_ALTITUDE
      const altitudeGain = CRUISING_ALTITUDE - LAX_ALTITUDE;
      return Math.round(LAX_ALTITUDE + altitudeGain * progress);
    }

    case "Cruise":
      return CRUISING_ALTITUDE;

    case "Descent": {
      // Find the phase in schedule
      const phaseInfo = phaseSchedule.find((p) => p.phase === "Descent");
      const phaseStartMinutes =
        phaseInfo.accumulatedMinutes - phaseInfo.duration;
      const minutesIntoPhase = elapsedMinutes - phaseStartMinutes;
      const progress = minutesIntoPhase / phaseInfo.duration; // 0 to 1

      // Linear interpolation from CRUISING_ALTITUDE to JFK_ALTITUDE
      const altitudeLoss = CRUISING_ALTITUDE - JFK_ALTITUDE;
      return Math.round(CRUISING_ALTITUDE - altitudeLoss * progress);
    }

    case "Landing":
    case "Taxi In":
      return JFK_ALTITUDE;

    default:
      return LAX_ALTITUDE;
  }
}

module.exports = { calculateAltitude };
