#!/usr/bin/env node
/**
 * Simulates N concurrent visitors (default 100) against the built portfolio.
 * Zero dependencies — uses Node 18+ fetch.
 *
 * Each virtual user:
 *   1. ramps in over RAMP_SECONDS
 *   2. performs VISITS page loads (HTML + every JS/CSS/icon asset the page references)
 *      with random "think time" between visits
 *   3. completes a full AI business-chat conversation with randomized answers
 *      (the chat engine runs client-side, so we execute the same code the browser runs)
 *
 * Env: BASE_URL (default http://localhost:4173), USERS (100), VISITS (5),
 *      RAMP_SECONDS (5), P95_MS (500), MAX_ERROR_RATE (0)
 * Exit code 1 if any threshold fails.
 */
import { performance } from 'node:perf_hooks';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initialChatState, chatReducer, STEPS } from '../src/lib/chatFlow.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const USERS = Number(process.env.USERS || 100);
const VISITS = Number(process.env.VISITS || 5);
const RAMP_SECONDS = Number(process.env.RAMP_SECONDS || 5);
const P95_MS = Number(process.env.P95_MS || 500);
const MAX_ERROR_RATE = Number(process.env.MAX_ERROR_RATE || 0);
const here = dirname(fileURLToPath(import.meta.url));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const requests = []; // { url, ms, status, ok, bytes }
const chatResults = []; // { ok, steps, recs, ms }

async function timedGet(path) {
  const url = new URL(path, BASE_URL).toString();
  const t0 = performance.now();
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'portfolio-loadtest/1.0' } });
    const buf = await res.arrayBuffer();
    const ms = performance.now() - t0;
    requests.push({ url: path, ms, status: res.status, ok: res.ok, bytes: buf.byteLength });
    return { res, text: () => new TextDecoder().decode(buf) };
  } catch (err) {
    requests.push({ url: path, ms: performance.now() - t0, status: 0, ok: false, bytes: 0, error: err.message });
    return null;
  }
}

function assetsFrom(html) {
  const out = new Set();
  for (const m of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:js|css|svg))"/g)) out.add(m[1]);
  return [...out];
}

const BUSINESSES = ['online clothing store', 'dental clinic', 'coaching institute', 'CA firm doing GST', 'digital marketing agency', 'SaaS startup', 'cloud kitchen', 'real estate brokerage', 'logistics company', 'pottery studio'];
const PAINS = ['answering customer questions on WhatsApp', 'data entry from invoices into excel', 'following up with leads', 'writing social media posts', 'booking appointments', 'making weekly reports', 'debugging failed builds', 'hiring and screening resumes', 'updating stock and pricing'];
const TOOLS = ['Excel, WhatsApp', 'Shopify', 'Zoho CRM', 'Google Sheets', 'Jenkins, Confluence', 'pen and paper'];
const TEAMS = ['just me', '2-10', '11-50', '50+', '7'];

function simulateChat(userId) {
  const t0 = performance.now();
  let s = initialChatState();
  const answers = [`User${userId}`, pick(BUSINESSES), pick(PAINS), pick(TOOLS), pick(TEAMS), Math.random() < 0.5 ? `user${userId}@example.com` : 'skip'];
  for (const a of answers) s = chatReducer(s, { type: 'USER_INPUT', text: a });
  const ok = s.step === STEPS.DONE && !!s.plan && s.plan.recommendations.length === 3 && s.plan.hoursSaved > 0;
  chatResults.push({ ok, recs: s.plan?.recommendations.map((r) => r.id), ms: performance.now() - t0 });
}

async function virtualUser(id) {
  await sleep((RAMP_SECONDS * 1000 * id) / USERS); // linear ramp-up
  for (let v = 0; v < VISITS; v++) {
    const page = await timedGet('/');
    if (page) {
      const assets = assetsFrom(page.text());
      await Promise.all(assets.map((a) => timedGet(a))); // browsers fetch assets in parallel
    }
    await sleep(200 + Math.random() * 800); // think time
  }
  simulateChat(id);
}

const pct = (sorted, p) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)] : 0;

async function main() {
  console.log(`\n🚀 Simulating ${USERS} concurrent users × ${VISITS} visits against ${BASE_URL} (ramp ${RAMP_SECONDS}s)\n`);
  const probe = await timedGet('/');
  if (!probe || !probe.res.ok) { console.error(`✖ ${BASE_URL} is not reachable. Run "npm run build && npm run preview" first, or use "npm run load:test".`); process.exit(1); }
  requests.length = 0;

  const t0 = performance.now();
  await Promise.all(Array.from({ length: USERS }, (_, i) => virtualUser(i)));
  const wall = (performance.now() - t0) / 1000;

  const lat = requests.map((r) => r.ms).sort((a, b) => a - b);
  const errors = requests.filter((r) => !r.ok);
  const errorRate = errors.length / requests.length;
  const chatFail = chatResults.filter((c) => !c.ok).length;
  const byType = {};
  for (const r of requests) {
    const k = r.url === '/' ? 'html' : r.url.split('.').pop();
    (byType[k] ||= []).push(r.ms);
  }

  const summary = {
    baseUrl: BASE_URL, users: USERS, visitsPerUser: VISITS, rampSeconds: RAMP_SECONDS,
    durationSec: +wall.toFixed(2),
    totalRequests: requests.length,
    throughputRps: +(requests.length / wall).toFixed(1),
    megabytesServed: +(requests.reduce((s, r) => s + r.bytes, 0) / 1e6).toFixed(1),
    latencyMs: { min: +lat[0].toFixed(1), p50: +pct(lat, 50).toFixed(1), p95: +pct(lat, 95).toFixed(1), p99: +pct(lat, 99).toFixed(1), max: +lat.at(-1).toFixed(1) },
    byAsset: Object.fromEntries(Object.entries(byType).map(([k, v]) => { v.sort((a, b) => a - b); return [k, { count: v.length, p95: +pct(v, 95).toFixed(1) }]; })),
    errors: errors.length, errorRate: +(errorRate * 100).toFixed(2),
    chatSessions: chatResults.length, chatFailures: chatFail,
    chatAvgMs: +(chatResults.reduce((s, c) => s + c.ms, 0) / chatResults.length).toFixed(2),
    thresholds: { p95Ms: P95_MS, maxErrorRatePct: MAX_ERROR_RATE * 100 },
  };
  const passed = summary.latencyMs.p95 <= P95_MS && errorRate <= MAX_ERROR_RATE && chatFail === 0;
  summary.result = passed ? 'PASS' : 'FAIL';

  console.table({
    'Virtual users': USERS, 'Total requests': summary.totalRequests, 'Duration (s)': summary.durationSec,
    'Throughput (req/s)': summary.throughputRps, 'Data served (MB)': summary.megabytesServed,
    'p50 latency (ms)': summary.latencyMs.p50, 'p95 latency (ms)': summary.latencyMs.p95,
    'p99 latency (ms)': summary.latencyMs.p99, 'Max latency (ms)': summary.latencyMs.max,
    'HTTP errors': `${summary.errors} (${summary.errorRate}%)`,
    'Chat sessions completed': `${chatResults.length - chatFail}/${chatResults.length}`,
  });
  console.log('Per asset type (p95 ms):', summary.byAsset);
  writeFileSync(join(here, 'report.json'), JSON.stringify(summary, null, 2));
  console.log(`\n${passed ? '✅ PASS' : '❌ FAIL'} — p95 ${summary.latencyMs.p95}ms (≤ ${P95_MS}), errors ${summary.errorRate}%, chat failures ${chatFail}. Report: loadtest/report.json\n`);
  process.exit(passed ? 0 : 1);
}

main();
