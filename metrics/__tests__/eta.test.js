const { calculateEta } = require('../eta');

const PHASE_SCHEDULE = [
  { phase: 'Boarding', duration: 30, accumulatedMinutes: 30 },
  { phase: 'Taxi Out', duration: 15, accumulatedMinutes: 45 },
  { phase: 'Takeoff Climb', duration: 25, accumulatedMinutes: 70 },
  { phase: 'Cruise', duration: 210, accumulatedMinutes: 280 },
  { phase: 'Descent', duration: 25, accumulatedMinutes: 305 },
  { phase: 'Landing', duration: 5, accumulatedMinutes: 310 },
  { phase: 'Taxi In', duration: 10, accumulatedMinutes: 320 },
];

describe('calculateEta', () => {
  test('should return 5.33 hours at start of flight', () => {
    // Total flight: 320 minutes = 5.33 hours
    expect(calculateEta(0, PHASE_SCHEDULE)).toBe(5.33);
  });

  test('should return 4.83 hours after Boarding (30 minutes)', () => {
    // Remaining: 320 - 30 = 290 minutes = 4.83 hours
    expect(calculateEta(30, PHASE_SCHEDULE)).toBe(4.83);
  });

  test('should return 4.58 hours after Taxi Out (45 minutes)', () => {
    // Remaining: 320 - 45 = 275 minutes = 4.58 hours
    expect(calculateEta(45, PHASE_SCHEDULE)).toBe(4.58);
  });

  test('should return 4.17 hours after Takeoff Climb (70 minutes)', () => {
    // Remaining: 320 - 70 = 250 minutes = 4.17 hours
    expect(calculateEta(70, PHASE_SCHEDULE)).toBe(4.17);
  });

  test('should return 2.67 hours halfway through flight (160 minutes)', () => {
    // Remaining: 320 - 160 = 160 minutes = 2.67 hours
    expect(calculateEta(160, PHASE_SCHEDULE)).toBe(2.67);
  });

  test('should return 0.67 hours after Cruise (280 minutes)', () => {
    // Remaining: 320 - 280 = 40 minutes = 0.67 hours
    expect(calculateEta(280, PHASE_SCHEDULE)).toBe(0.67);
  });

  test('should return 0.25 hours after Descent (305 minutes)', () => {
    // Remaining: 320 - 305 = 15 minutes = 0.25 hours
    expect(calculateEta(305, PHASE_SCHEDULE)).toBe(0.25);
  });

  test('should return 0.17 hours after Landing (310 minutes)', () => {
    // Remaining: 320 - 310 = 10 minutes = 0.17 hours
    expect(calculateEta(310, PHASE_SCHEDULE)).toBe(0.17);
  });

  test('should return 0 hours at end of flight (320 minutes)', () => {
    // Remaining: 320 - 320 = 0 minutes = 0 hours
    expect(calculateEta(320, PHASE_SCHEDULE)).toBe(0);
  });

  test('should return 0 hours if elapsed time exceeds total duration', () => {
    // Should never go negative
    expect(calculateEta(350, PHASE_SCHEDULE)).toBe(0);
  });
});
