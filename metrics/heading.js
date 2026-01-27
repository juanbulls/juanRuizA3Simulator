/**
 * Calculate heading based on current phase
 * @param {string} phase - Current flight phase
 * @returns {number|null} Heading in degrees or null
 */
function calculateHeading(phase) {
  switch (phase) {
    case "Boarding":
    case "Taxi Out":
    case "Taxi In":
      return null;

    case "Takeoff Climb":
      return 60;

    case "Cruise":
      return 80;

    case "Descent":
    case "Landing":
      return 90;

    default:
      return null;
  }
}

module.exports = { calculateHeading };
