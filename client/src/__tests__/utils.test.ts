import { describe, it, expect } from 'bun:test';

import { convertDurationToReadable } from '../lib/utils';

describe('convertDurationToReadable', () => {
  it('should return "0 minutes" for 0 milliseconds', () => {
    expect(convertDurationToReadable(0)).toBe('0 minutes');
  });

  it('should return "1 minute" for 60,000 milliseconds', () => {
    expect(convertDurationToReadable(60000)).toBe('1 minute');
  });

  it('should return "2 minutes" for 120,000 milliseconds', () => {
    expect(convertDurationToReadable(120000)).toBe('2 minutes');
  });

  it('should return "1 hour" for 3,600,000 milliseconds', () => {
    expect(convertDurationToReadable(3600000)).toBe('1 hour');
  });

  it('should return "1 hour 30 minutes" for 5,400,000 milliseconds', () => {
    expect(convertDurationToReadable(5400000)).toBe('1 hour 30 minutes');
  });

  it('should return "2 hours 15 minutes" for 8,100,000 milliseconds', () => {
    expect(convertDurationToReadable(8100000)).toBe('2 hours 15 minutes');
  });

  it('should return "59 minutes" for 3,540,000 milliseconds', () => {
    expect(convertDurationToReadable(3540000)).toBe('59 minutes');
  });

  it('should handle very large durations, e.g., "100 hours" for 360,000,000 milliseconds', () => {
    expect(convertDurationToReadable(360000000)).toBe('100 hours');
  });
});
