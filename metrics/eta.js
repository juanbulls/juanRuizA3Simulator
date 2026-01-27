/**
 * Calculate ETA (Estimated Time of Arrival) based on remaining flight time
 * @param {number} elapsedMinutes - Total minutes elapsed in simulation
 * @param {Array} phaseSchedule - Array of phase objects with duration and accumulated minutes
 * @returns {number} ETA in hours (e.g., 1.5 = 1 hour 30 minutes)
 */
function calculateEta(elapsedMinutes, phaseSchedule) {
  // Get total flight duration (last phase's accumulated minutes)
  const totalFlightMinutes =
    phaseSchedule[phaseSchedule.length - 1].accumulatedMinutes;

  // Calculate remaining minutes
  const remainingMinutes = Math.max(0, totalFlightMinutes - elapsedMinutes);

  // Convert to hours
  const etaHours = remainingMinutes / 60;

  // Round to 2 decimal places
  return Math.round(etaHours * 100) / 100;
}

module.exports = { calculateEta };
