import { describe, it, expect } from 'vitest';
import { nextFrame } from '../../src/hooks/useTypewriter.js';

const lines = ['ab', 'xy'];

describe('typewriter nextFrame', () => {
  it('types forward one char at a time', () => {
    expect(nextFrame({ lineIndex: 0, text: '', deleting: false }, lines).text).toBe('a');
    expect(nextFrame({ lineIndex: 0, text: 'a', deleting: false }, lines).text).toBe('ab');
  });
  it('switches to deleting once a line is complete', () => {
    expect(nextFrame({ lineIndex: 0, text: 'ab', deleting: false }, lines)).toMatchObject({ deleting: true, text: 'ab' });
  });
  it('deletes and then moves to the next line, wrapping around', () => {
    expect(nextFrame({ lineIndex: 0, text: 'a', deleting: true }, lines).text).toBe('');
    expect(nextFrame({ lineIndex: 0, text: '', deleting: true }, lines)).toMatchObject({ lineIndex: 1, deleting: false });
    expect(nextFrame({ lineIndex: 1, text: '', deleting: true }, lines).lineIndex).toBe(0);
  });
});
