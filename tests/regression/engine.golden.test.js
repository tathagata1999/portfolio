// Golden-master regression: if a change to the rules alters what visitors are told,
// this snapshot fails and you must review + update it intentionally (vitest -u).
import { describe, it, expect } from 'vitest';
import { analyzeBusiness } from '../../src/lib/automationEngine.js';

const SCENARIOS = [
  { name: 'Riya', business: 'online saree store on Shopify', pain: 'replying to customer questions on WhatsApp and updating stock', tools: 'Shopify, WhatsApp, Excel', team: '4' },
  { name: 'Dr Sen', business: 'dental clinic', pain: 'booking appointments and patient follow up calls', tools: 'Google Sheets', team: '2-10' },
  { name: 'Kunal', business: 'CA firm doing GST filing', pain: 'data entry from invoices and bank statements into Tally', tools: 'Tally, Excel', team: '11-50' },
  { name: 'Meera', business: 'digital marketing agency', pain: 'writing social media posts and weekly client reports', tools: 'Canva, Sheets', team: '8' },
  { name: 'Arjun', business: 'SaaS startup', pain: 'debugging failed builds in Jenkins pipelines and searching docs', tools: 'Jenkins, Confluence', team: '30' },
  { name: 'Sam', business: 'something unusual', pain: 'not sure', tools: 'pen and paper', team: 'just me' },
];

const digest = (p) => ({
  industry: p.industry.id,
  recs: p.recommendations.map((r) => r.id),
  teamSize: p.teamSize,
  hoursSaved: p.hoursSaved,
});

describe('automation engine golden master', () => {
  it('produces stable plans for reference businesses', () => {
    expect(SCENARIOS.map((s) => digest(analyzeBusiness(s)))).toMatchSnapshot();
  });
});
