const { calculateFuel } = require('../fuel');

const PHASE_SCHEDULE = [
  { phase: 'Boarding', duration: 30, accumulatedMinutes: 30 },
  { phase: 'Taxi Out', duration: 15, accumulatedMinutes: 45 },
  { phase: 'Takeoff Climb', duration: 25, accumulatedMinutes: 70 },
  { phase: 'Cruise', duration: 210, accumulatedMinutes: 280 },
  { phase: 'Descent', duration: 25, accumulatedMinutes: 305 },
  { phase: 'Landing', duration: 5, accumulatedMinutes: 310 },
  { phase: 'Taxi In', duration: 10, accumulatedMinutes: 320 },
];

describe('calculateFuel', () => {
  test('should return 65% for Boarding phase', () => {
    expect(calculateFuel('Boarding', 10, PHASE_SCHEDULE)).toBe(65);
  });

  test('should return 65% for Taxi Out phase', () => {
    expect(calculateFuel('Taxi Out', 40, PHASE_SCHEDULE)).toBe(65);
  });

  test('should return 18% for Taxi In phase', () => {
    expect(calculateFuel('Taxi In', 315, PHASE_SCHEDULE)).toBe(18);
  });

  test('should decrease fuel at start of Takeoff Climb (65%)', () => {
    // At 45 minutes (start of Takeoff Climb), fuel should still be at 65%
    expect(calculateFuel('Takeoff Climb', 45, PHASE_SCHEDULE)).toBe(65);
  });

  test('should decrease fuel at 50% of flight', () => {
    // Flight duration: 45-310 minutes (265 minutes)
    // At 177.5 minutes (50% through flight), fuel should be halfway between 65% and 18%
    const expectedFuel = Math.round((65 - (65 - 18) * 0.5) * 100) / 100;
    expect(calculateFuel('Cruise', 177.5, PHASE_SCHEDULE)).toBe(expectedFuel);
  });

  test('should decrease fuel at end of Landing (18%)', () => {
    // At 310 minutes (end of Landing), fuel should be at 18%
    expect(calculateFuel('Landing', 310, PHASE_SCHEDULE)).toBe(18);
  });

  test('should handle fuel during Cruise phase', () => {
    // At 150 minutes during Cruise
    // Flight starts at 45, ends at 310 (265 minutes total)
    // At 150 minutes: (150 - 45) / 265 = 0.396 progress
    const progress = (150 - 45) / (310 - 45);
    const expectedFuel = Math.round((65 - (65 - 18) * progress) * 100) / 100;
    expect(calculateFuel('Cruise', 150, PHASE_SCHEDULE)).toBe(expectedFuel);
  });

  test('should handle fuel during Descent phase', () => {
    // At 290 minutes during Descent
    const progress = (290 - 45) / (310 - 45);
    const expectedFuel = Math.round((65 - (65 - 18) * progress) * 100) / 100;
    expect(calculateFuel('Descent', 290, PHASE_SCHEDULE)).toBe(expectedFuel);
  });

  test('should return 65% for unknown phase', () => {
    expect(calculateFuel('Unknown', 100, PHASE_SCHEDULE)).toBe(65);
  });
});
