import { describe, it, expect } from 'vitest';
import { isValidEmail, validateContact } from '../../src/lib/validators.js';

describe('isValidEmail', () => {
  it.each(['a@b.co', 'first.last+tag@sub.domain.in'])('accepts %s', (e) => expect(isValidEmail(e)).toBe(true));
  it.each(['', 'abc', 'a@b', 'a b@c.com', '@x.com', null])('rejects %s', (e) => expect(isValidEmail(e)).toBe(false));
});

describe('validateContact', () => {
  it('returns errors for every missing field', () => {
    const errors = validateContact({ name: '', email: '', message: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name']);
  });
  it('requires a message of at least 10 characters', () => {
    expect(validateContact({ name: 'A', email: 'a@b.co', message: 'short' }).message).toBeTruthy();
  });
  it('passes a valid form', () => {
    expect(validateContact({ name: 'Asha', email: 'asha@x.com', message: 'Please automate my invoices' })).toEqual({});
  });
});
