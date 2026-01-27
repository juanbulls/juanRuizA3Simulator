const { calculateAltitude } = require('../altitude');

const PHASE_SCHEDULE = [
  { phase: 'Boarding', duration: 30, accumulatedMinutes: 30 },
  { phase: 'Taxi Out', duration: 15, accumulatedMinutes: 45 },
  { phase: 'Takeoff Climb', duration: 25, accumulatedMinutes: 70 },
  { phase: 'Cruise', duration: 210, accumulatedMinutes: 280 },
  { phase: 'Descent', duration: 25, accumulatedMinutes: 305 },
  { phase: 'Landing', duration: 5, accumulatedMinutes: 310 },
  { phase: 'Taxi In', duration: 10, accumulatedMinutes: 320 },
];

describe('calculateAltitude', () => {
  test('should return LAX altitude (125) for Boarding phase', () => {
    expect(calculateAltitude('Boarding', 10, PHASE_SCHEDULE)).toBe(125);
  });

  test('should return LAX altitude (125) for Taxi Out phase', () => {
    expect(calculateAltitude('Taxi Out', 40, PHASE_SCHEDULE)).toBe(125);
  });

  test('should return JFK altitude (13) for Landing phase', () => {
    expect(calculateAltitude('Landing', 308, PHASE_SCHEDULE)).toBe(13);
  });

  test('should return JFK altitude (13) for Taxi In phase', () => {
    expect(calculateAltitude('Taxi In', 315, PHASE_SCHEDULE)).toBe(13);
  });

  test('should return cruising altitude (33000) for Cruise phase', () => {
    expect(calculateAltitude('Cruise', 150, PHASE_SCHEDULE)).toBe(33000);
  });

  test('should interpolate altitude at start of Takeoff Climb (125)', () => {
    // At 45 minutes (start of Takeoff Climb), should be at LAX altitude
    expect(calculateAltitude('Takeoff Climb', 45, PHASE_SCHEDULE)).toBe(125);
  });

  test('should interpolate altitude at 50% of Takeoff Climb', () => {
    // Takeoff Climb: 45-70 minutes (25 minutes duration)
    // At 57.5 minutes (50% through), altitude should be halfway between 125 and 33000
    const expectedAltitude = Math.round(125 + (33000 - 125) * 0.5);
    expect(calculateAltitude('Takeoff Climb', 57.5, PHASE_SCHEDULE)).toBe(expectedAltitude);
  });

  test('should interpolate altitude at end of Takeoff Climb (33000)', () => {
    // At 70 minutes (end of Takeoff Climb), should be at cruising altitude
    expect(calculateAltitude('Takeoff Climb', 70, PHASE_SCHEDULE)).toBe(33000);
  });

  test('should interpolate altitude at start of Descent (33000)', () => {
    // At 280 minutes (start of Descent), should be at cruising altitude
    expect(calculateAltitude('Descent', 280, PHASE_SCHEDULE)).toBe(33000);
  });

  test('should interpolate altitude at 50% of Descent', () => {
    // Descent: 280-305 minutes (25 minutes duration)
    // At 292.5 minutes (50% through), altitude should be halfway between 33000 and 13
    const expectedAltitude = Math.round(33000 - (33000 - 13) * 0.5);
    expect(calculateAltitude('Descent', 292.5, PHASE_SCHEDULE)).toBe(expectedAltitude);
  });

  test('should interpolate altitude at end of Descent (13)', () => {
    // At 305 minutes (end of Descent), should be at JFK altitude
    expect(calculateAltitude('Descent', 305, PHASE_SCHEDULE)).toBe(13);
  });

  test('should return LAX altitude for unknown phase', () => {
    expect(calculateAltitude('Unknown', 100, PHASE_SCHEDULE)).toBe(125);
  });
});
