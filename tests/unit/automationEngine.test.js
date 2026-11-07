import { describe, it, expect } from 'vitest';
import {
  detectIndustry,
  matchAutomations,
  parseTeamSize,
  estimateHoursSaved,
  analyzeBusiness,
  AUTOMATIONS,
} from '../../src/lib/automationEngine.js';

describe('detectIndustry', () => {
  it.each([
    ['I run an online clothing store on Shopify', 'ecommerce'],
    ['We are a dental clinic with 3 doctors', 'healthcare'],
    ['real estate brokerage selling apartments', 'realestate'],
    ['coaching institute for JEE students', 'education'],
    ['a small cafe and restaurant', 'food'],
    ['CA firm doing accounting and GST filing', 'finance'],
    ['digital marketing agency', 'agency'],
    ['we build SaaS software for HR teams', 'tech'],
    ['logistics and warehousing company', 'logistics'],
  ])('maps "%s" to %s', (text, expected) => {
    expect(detectIndustry(text).id).toBe(expected);
  });

  it('falls back to general for unknown text', () => {
    expect(detectIndustry('we do things').id).toBe('general');
  });

  it('is case-insensitive and tolerates empty input', () => {
    expect(detectIndustry('ONLINE STORE').id).toBe('ecommerce');
    expect(detectIndustry('').id).toBe('general');
    expect(detectIndustry(undefined).id).toBe('general');
  });
});

describe('matchAutomations', () => {
  it('finds a support agent for customer query pain points', () => {
    const ids = matchAutomations('answering the same customer questions on WhatsApp all day').map((a) => a.id);
    expect(ids[0]).toBe('support-agent');
  });

  it('ranks by number of keyword hits', () => {
    const res = matchAutomations('data entry from invoices into excel, plus some follow up with leads');
    expect(res[0].id).toBe('doc-extraction');
    expect(res.map((r) => r.id)).toContain('lead-agent');
  });

  it('returns at most 3 results', () => {
    const text = 'support tickets invoices leads social media posts appointments reports inventory hiring docs deploy';
    expect(matchAutomations(text).length).toBeLessThanOrEqual(3);
  });

  it('tops up partial matches with defaults so visitors always get 3 ideas', () => {
    const res = matchAutomations('data entry from invoices');
    expect(res.length).toBe(3);
    expect(res[0].id).toBe('doc-extraction');
    expect(res[0].score).toBeGreaterThan(0);
    expect(new Set(res.map((r) => r.id)).size).toBe(3);
  });

  it('returns sensible defaults when nothing matches', () => {
    const res = matchAutomations('nothing specific');
    expect(res.length).toBe(3);
    res.forEach((r) => expect(AUTOMATIONS.map((a) => a.id)).toContain(r.id));
  });

  it('does not match substrings inside unrelated words', () => {
    // "post" should not be found inside "postpone"? -> we use word boundaries
    const res = matchAutomations('we postpone stuff');
    expect(res.every((r) => r.score === 0)).toBe(true);
  });
});

describe('parseTeamSize', () => {
  it.each([
    ['just me', 1],
    ['solo founder', 1],
    ['5', 5],
    ['around 12 people', 12],
    ['2-10', 6],
    ['50+', 50],
    ['', 1],
  ])('parses "%s" -> %d', (input, expected) => {
    expect(parseTeamSize(input)).toBe(expected);
  });
});

describe('estimateHoursSaved', () => {
  it('grows with team size but is capped', () => {
    const recs = [{ hoursPerWeek: 6 }, { hoursPerWeek: 4 }];
    const solo = estimateHoursSaved(recs, 1);
    const team = estimateHoursSaved(recs, 10);
    const huge = estimateHoursSaved(recs, 10000);
    expect(solo).toBe(10);
    expect(team).toBeGreaterThan(solo);
    expect(huge).toBeLessThanOrEqual(400);
  });

  it('returns 0 for no recommendations', () => {
    expect(estimateHoursSaved([], 5)).toBe(0);
  });
});

describe('analyzeBusiness', () => {
  it('builds a full plan object', () => {
    const plan = analyzeBusiness({
      name: 'Riya',
      business: 'online saree store',
      pain: 'replying to customer questions and updating stock in excel',
      tools: 'Shopify, WhatsApp, Excel',
      team: '4',
    });
    expect(plan.industry.id).toBe('ecommerce');
    expect(plan.recommendations.length).toBeGreaterThan(0);
    expect(plan.recommendations.length).toBeLessThanOrEqual(3);
    expect(plan.hoursSaved).toBeGreaterThan(0);
    expect(plan.summary).toMatch(/Riya/);
    expect(plan.tools).toEqual(['Shopify', 'WhatsApp', 'Excel']);
  });

  it('considers tools text when matching automations', () => {
    const plan = analyzeBusiness({ business: 'shop', pain: 'too much manual work', tools: 'invoices in excel', team: '1' });
    expect(plan.recommendations.map((r) => r.id)).toContain('doc-extraction');
  });
});
