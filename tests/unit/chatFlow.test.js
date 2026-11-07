import { describe, it, expect } from 'vitest';
import { initialChatState, chatReducer, STEPS, buildPlanMailto } from '../../src/lib/chatFlow.js';

const send = (state, text) => chatReducer(state, { type: 'USER_INPUT', text });

const runToPlan = () => {
  let s = initialChatState();
  s = send(s, 'Amit');
  s = send(s, 'We run a dental clinic');
  s = send(s, 'booking appointments over phone and answering patient questions');
  s = send(s, 'Google Sheets, WhatsApp');
  s = send(s, '6');
  return s;
};

describe('chatFlow', () => {
  it('starts on the name step with a greeting', () => {
    const s = initialChatState();
    expect(s.step).toBe(STEPS.NAME);
    expect(s.messages[0].from).toBe('bot');
    expect(s.messages.length).toBeGreaterThanOrEqual(1);
  });

  it('ignores empty or whitespace input', () => {
    const s = initialChatState();
    expect(send(s, '   ')).toBe(s);
    expect(send(s, '')).toBe(s);
  });

  it('records the user message and advances', () => {
    const s = send(initialChatState(), '  Amit  ');
    expect(s.answers.name).toBe('Amit');
    expect(s.step).toBe(STEPS.BUSINESS);
    const user = s.messages.filter((m) => m.from === 'user');
    expect(user.at(-1).text).toBe('Amit');
    expect(s.messages.at(-1).text).toMatch(/Amit/);
  });

  it('caps very long input at 500 chars', () => {
    const s = send(initialChatState(), 'x'.repeat(2000));
    expect(s.answers.name.length).toBe(500);
  });

  it('produces a plan after the team step', () => {
    const s = runToPlan();
    expect(s.step).toBe(STEPS.EMAIL);
    expect(s.plan).toBeTruthy();
    expect(s.plan.industry.id).toBe('healthcare');
    expect(s.messages.some((m) => m.kind === 'plan')).toBe(true);
  });

  it('re-asks on an invalid email and stays on the email step', () => {
    const s = send(runToPlan(), 'not-an-email');
    expect(s.step).toBe(STEPS.EMAIL);
    expect(s.messages.at(-1).text).toMatch(/valid email/i);
  });

  it('accepts a valid email and finishes', () => {
    const s = send(runToPlan(), 'amit@clinic.in');
    expect(s.step).toBe(STEPS.DONE);
    expect(s.answers.email).toBe('amit@clinic.in');
  });

  it('allows skipping the email', () => {
    const s = send(runToPlan(), 'skip');
    expect(s.step).toBe(STEPS.DONE);
    expect(s.answers.email).toBe('');
  });

  it('ignores input once done', () => {
    const done = send(runToPlan(), 'skip');
    expect(send(done, 'hello again')).toBe(done);
  });

  it('resets the conversation', () => {
    const s = chatReducer(runToPlan(), { type: 'RESET' });
    expect(s.step).toBe(STEPS.NAME);
    expect(s.plan).toBeNull();
  });

  it('gives every message a unique id', () => {
    const s = send(runToPlan(), 'skip');
    const ids = s.messages.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('builds a mailto link with the plan summary', () => {
    const s = send(runToPlan(), 'amit@clinic.in');
    const url = buildPlanMailto(s, 'me@example.com');
    expect(url.startsWith('mailto:me@example.com?')).toBe(true);
    const body = decodeURIComponent(url.split('body=')[1]);
    expect(body).toMatch(/Amit/);
    expect(body).toMatch(/dental clinic/);
    expect(body).toMatch(/amit@clinic.in/);
  });
});
