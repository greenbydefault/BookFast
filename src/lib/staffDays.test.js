import { describe, it, expect } from 'vitest';
import {
  toBookableDaysObject,
  toBookableDaysArray,
  getActiveDayNames,
  DAY_IDS,
  DAY_KEYS,
} from './staffDays.js';

describe('toBookableDaysObject', () => {
  it('converts full week array to object', () => {
    const result = toBookableDaysObject([...DAY_IDS]);
    expect(result).toEqual({ mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true });
  });

  it('converts partial array', () => {
    const result = toBookableDaysObject(['Mo', 'Mi', 'Fr']);
    expect(result).toEqual({ mon: true, tue: false, wed: true, thu: false, fri: true, sat: false, sun: false });
  });

  it('handles empty array', () => {
    const result = toBookableDaysObject([]);
    DAY_KEYS.forEach(k => expect(result[k]).toBe(false));
  });
});

describe('toBookableDaysArray', () => {
  it('converts full-true object to full array', () => {
    const obj = { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true };
    expect(toBookableDaysArray(obj)).toEqual(DAY_IDS);
  });

  it('converts partial object', () => {
    expect(toBookableDaysArray({ mon: true, tue: false, wed: true })).toEqual(['Mo', 'Mi']);
  });

  it('handles empty object', () => {
    expect(toBookableDaysArray({})).toEqual([]);
  });
});

describe('roundtrip', () => {
  it('object → array → object is identity', () => {
    const orig = { mon: true, tue: false, wed: true, thu: false, fri: true, sat: false, sun: true };
    expect(toBookableDaysObject(toBookableDaysArray(orig))).toEqual(orig);
  });
});

describe('getActiveDayNames', () => {
  it('returns German long day names for active days', () => {
    expect(getActiveDayNames({ mon: true, wed: true })).toEqual(['Montag', 'Mittwoch']);
  });
});
