const { calculateHeading } = require('../heading');

describe('calculateHeading', () => {
  test('should return null for Boarding phase', () => {
    expect(calculateHeading('Boarding')).toBeNull();
  });

  test('should return null for Taxi Out phase', () => {
    expect(calculateHeading('Taxi Out')).toBeNull();
  });

  test('should return null for Taxi In phase', () => {
    expect(calculateHeading('Taxi In')).toBeNull();
  });

  test('should return 60 for Takeoff Climb phase', () => {
    expect(calculateHeading('Takeoff Climb')).toBe(60);
  });

  test('should return 80 for Cruise phase', () => {
    expect(calculateHeading('Cruise')).toBe(80);
  });

  test('should return 90 for Descent phase', () => {
    expect(calculateHeading('Descent')).toBe(90);
  });

  test('should return 90 for Landing phase', () => {
    expect(calculateHeading('Landing')).toBe(90);
  });

  test('should return null for unknown phase', () => {
    expect(calculateHeading('Unknown')).toBeNull();
  });
});
