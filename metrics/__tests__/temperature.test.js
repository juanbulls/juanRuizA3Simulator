const { calculateTemperature } = require('../temperature');

const PHASE_SCHEDULE = [
  { phase: 'Boarding', duration: 30, accumulatedMinutes: 30 },
  { phase: 'Taxi Out', duration: 15, accumulatedMinutes: 45 },
  { phase: 'Takeoff Climb', duration: 25, accumulatedMinutes: 70 },
  { phase: 'Cruise', duration: 210, accumulatedMinutes: 280 },
  { phase: 'Descent', duration: 25, accumulatedMinutes: 305 },
  { phase: 'Landing', duration: 5, accumulatedMinutes: 310 },
  { phase: 'Taxi In', duration: 10, accumulatedMinutes: 320 },
];

describe('calculateTemperature', () => {
  test('should return LAX temperature (65°F) for Boarding phase', () => {
    expect(calculateTemperature('Boarding', 10, PHASE_SCHEDULE)).toBe(65);
  });

  test('should return LAX temperature (65°F) for Taxi Out phase', () => {
    expect(calculateTemperature('Taxi Out', 40, PHASE_SCHEDULE)).toBe(65);
  });

  test('should return cruise temperature (67°F) for Cruise phase', () => {
    expect(calculateTemperature('Cruise', 150, PHASE_SCHEDULE)).toBe(67);
  });

  test('should return JFK temperature (55°F) for Landing phase', () => {
    expect(calculateTemperature('Landing', 308, PHASE_SCHEDULE)).toBe(55);
  });

  test('should return JFK temperature (55°F) for Taxi In phase', () => {
    expect(calculateTemperature('Taxi In', 315, PHASE_SCHEDULE)).toBe(55);
  });

  test('should interpolate temperature at start of Takeoff Climb (65°F)', () => {
    // At 45 minutes (start of Takeoff Climb)
    expect(calculateTemperature('Takeoff Climb', 45, PHASE_SCHEDULE)).toBe(65);
  });

  test('should interpolate temperature at 50% of Takeoff Climb', () => {
    // Takeoff Climb: 45-70 minutes (25 minutes duration)
    // At 57.5 minutes (50% through), temperature should be halfway between 65 and 67
    const expectedTemp = Math.round((65 + (67 - 65) * 0.5) * 100) / 100;
    expect(calculateTemperature('Takeoff Climb', 57.5, PHASE_SCHEDULE)).toBe(expectedTemp);
  });

  test('should interpolate temperature at end of Takeoff Climb (67°F)', () => {
    // At 70 minutes (end of Takeoff Climb)
    expect(calculateTemperature('Takeoff Climb', 70, PHASE_SCHEDULE)).toBe(67);
  });

  test('should interpolate temperature at start of Descent (67°F)', () => {
    // At 280 minutes (start of Descent)
    expect(calculateTemperature('Descent', 280, PHASE_SCHEDULE)).toBe(67);
  });

  test('should interpolate temperature at 50% of Descent', () => {
    // Descent: 280-305 minutes (25 minutes duration)
    // At 292.5 minutes (50% through), temperature should be halfway between 67 and 55
    const expectedTemp = Math.round((67 + (55 - 67) * 0.5) * 100) / 100;
    expect(calculateTemperature('Descent', 292.5, PHASE_SCHEDULE)).toBe(expectedTemp);
  });

  test('should interpolate temperature at end of Descent (55°F)', () => {
    // At 305 minutes (end of Descent)
    expect(calculateTemperature('Descent', 305, PHASE_SCHEDULE)).toBe(55);
  });

  test('should return LAX temperature for unknown phase', () => {
    expect(calculateTemperature('Unknown', 100, PHASE_SCHEDULE)).toBe(65);
  });
});
