const { calculatePosition } = require('../position');

const PHASE_SCHEDULE = [
  { phase: 'Boarding', duration: 30, accumulatedMinutes: 30 },
  { phase: 'Taxi Out', duration: 15, accumulatedMinutes: 45 },
  { phase: 'Takeoff Climb', duration: 25, accumulatedMinutes: 70 },
  { phase: 'Cruise', duration: 210, accumulatedMinutes: 280 },
  { phase: 'Descent', duration: 25, accumulatedMinutes: 305 },
  { phase: 'Landing', duration: 5, accumulatedMinutes: 310 },
  { phase: 'Taxi In', duration: 10, accumulatedMinutes: 320 },
];

describe('calculatePosition', () => {
  test('should return LAX coordinates for Boarding phase', () => {
    const position = calculatePosition('Boarding', 10, PHASE_SCHEDULE);
    expect(position.latitude).toBe(33.94);
    expect(position.longitude).toBe(118.41);
  });

  test('should return LAX coordinates for Taxi Out phase', () => {
    const position = calculatePosition('Taxi Out', 40, PHASE_SCHEDULE);
    expect(position.latitude).toBe(33.94);
    expect(position.longitude).toBe(118.41);
  });

  test('should return LAX coordinates for Takeoff Climb phase', () => {
    const position = calculatePosition('Takeoff Climb', 60, PHASE_SCHEDULE);
    expect(position.latitude).toBe(33.94);
    expect(position.longitude).toBe(118.41);
  });

  test('should return JFK coordinates for Descent phase', () => {
    const position = calculatePosition('Descent', 290, PHASE_SCHEDULE);
    expect(position.latitude).toBe(40.64);
    expect(position.longitude).toBe(73.78);
  });

  test('should return JFK coordinates for Landing phase', () => {
    const position = calculatePosition('Landing', 308, PHASE_SCHEDULE);
    expect(position.latitude).toBe(40.64);
    expect(position.longitude).toBe(73.78);
  });

  test('should return JFK coordinates for Taxi In phase', () => {
    const position = calculatePosition('Taxi In', 315, PHASE_SCHEDULE);
    expect(position.latitude).toBe(40.64);
    expect(position.longitude).toBe(73.78);
  });

  test('should interpolate position at start of Cruise (LAX coordinates)', () => {
    // At 70 minutes (start of Cruise)
    const position = calculatePosition('Cruise', 70, PHASE_SCHEDULE);
    expect(position.latitude).toBe(33.94);
    expect(position.longitude).toBe(118.41);
  });

  test('should interpolate position at 50% of Cruise', () => {
    // Cruise: 70-280 minutes (210 minutes duration)
    // At 175 minutes (50% through cruise)
    const position = calculatePosition('Cruise', 175, PHASE_SCHEDULE);
    const expectedLat = Math.round((33.94 + (40.64 - 33.94) * 0.5) * 100) / 100;
    const expectedLng = Math.round((118.41 + (73.78 - 118.41) * 0.5) * 100) / 100;
    expect(position.latitude).toBe(expectedLat);
    expect(position.longitude).toBe(expectedLng);
  });

  test('should interpolate position at end of Cruise (JFK coordinates)', () => {
    // At 280 minutes (end of Cruise)
    const position = calculatePosition('Cruise', 280, PHASE_SCHEDULE);
    expect(position.latitude).toBe(40.64);
    expect(position.longitude).toBe(73.78);
  });

  test('should return LAX coordinates for unknown phase', () => {
    const position = calculatePosition('Unknown', 100, PHASE_SCHEDULE);
    expect(position.latitude).toBe(33.94);
    expect(position.longitude).toBe(118.41);
  });
});
