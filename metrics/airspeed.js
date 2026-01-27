/**
 * Calculate airspeed based on current phase
 * @param {string} phase - Current flight phase
 * @returns {number} Airspeed in knots
 */
function calculateAirspeed(phase) {
  switch (phase) {
    case "Boarding":
      return 0;

    case "Taxi Out":
      return 20;

    case "Takeoff Climb":
      return 250;

    case "Cruise":
      return 450;

    case "Descent":
      return 250;

    case "Landing":
      return 150;

    case "Taxi In":
      return 20;

    default:
      return 0;
  }
}

module.exports = { calculateAirspeed };
