const { calculateAirspeed } = require('../airspeed');

describe('calculateAirspeed', () => {
  test('should return 0 for Boarding phase', () => {
    expect(calculateAirspeed('Boarding')).toBe(0);
  });

  test('should return 20 for Taxi Out phase', () => {
    expect(calculateAirspeed('Taxi Out')).toBe(20);
  });

  test('should return 250 for Takeoff Climb phase', () => {
    expect(calculateAirspeed('Takeoff Climb')).toBe(250);
  });

  test('should return 450 for Cruise phase', () => {
    expect(calculateAirspeed('Cruise')).toBe(450);
  });

  test('should return 250 for Descent phase', () => {
    expect(calculateAirspeed('Descent')).toBe(250);
  });

  test('should return 150 for Landing phase', () => {
    expect(calculateAirspeed('Landing')).toBe(150);
  });

  test('should return 20 for Taxi In phase', () => {
    expect(calculateAirspeed('Taxi In')).toBe(20);
  });

  test('should return 0 for unknown phase', () => {
    expect(calculateAirspeed('Unknown')).toBe(0);
  });
});
