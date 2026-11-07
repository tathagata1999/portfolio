# Tathagata Mallik — AI Portfolio

A dark, animated portfolio built with **React 18 + Vite + Tailwind CSS + Framer Motion**. It includes an
**AI business-discovery chat**: visitors answer 5 questions and get a tailored automation plan (what to
automate first, the stack, and the hours saved), which they can email to you in one click.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

Requires Node 18+ (Node 20/22 recommended).

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build on http://localhost:4173 |
| `npm test` | Run all 80 tests: unit, integration and regression |
| `npm run test:unit` / `test:integration` / `test:regression` | Run one suite |
| `npm run test:coverage` | Run the tests with a coverage report (HTML in `coverage/`) |
| `npm run test:watch` | Watch mode for TDD |
| `npm run load:test` | Build, serve and simulate **100 concurrent users** |
| `npm run load:test:url` | Run the simulation against an existing URL (`BASE_URL=https://… npm run load:test:url`) |

## Editing content

All text lives in **`src/data/profile.js`**. Your photo is `public/profile.webp`, with `public/profile.jpg` as a fallback; replace both files to change it (a square image of about 640 px works best). The data file holds name, stats, services, projects, experience, skills and
certifications. Edit it and the site updates. Changing copy will fail the Services/Projects regression
snapshots on purpose. Review the diff, then run `npx vitest run -u` to accept it.

## Project structure

```
src/
  data/profile.js           # all content
  lib/automationEngine.js   # rule-based business analysis (industries, automations, hours saved)
  lib/chatFlow.js           # chat state machine (reducer) + mailto builder
  lib/validators.js         # email / contact form validation
  hooks/                    # typewriter, spotlight-hover
  components/               # Hero, About, Services, Projects, Process, Experience, ChatAssistant, Contact…
tests/
  unit/                     # pure logic: engine, chat flow, validators, data integrity, typewriter
  integration/              # full <App/> render: nav, chat end-to-end, contact form, mobile menu
  regression/               # golden-master + snapshot + site-wide link/SEO guards
loadtest/
  simulate-users.mjs        # 100-user simulator (zero dependencies)
  run.mjs                   # one-command: build → serve → simulate → stop
  report.json               # latest results
```

## Testing strategy

### 1. Test-driven development
The core logic was written test-first:
1. **Red:** the tests in `tests/unit` were written before `src/lib/*` existed. All 4 files failed.
2. **Green:** the engine, chat reducer and validators were implemented until all 56 passed.
3. **Red → green again:** the golden-master review showed one business getting only 1 recommendation.
   A new test ("tops up partial matches… always get 3 ideas") was added and failed. The engine was then
   fixed to make it pass.

The integration tests for the UI were also written before the components.

### 2. Unit tests (`tests/unit`, 62 tests)
- Industry detection, keyword matching with word boundaries, ranking, team-size parsing and the
  hours-saved cap.
- Every chat state transition: empty or long input, invalid email re-ask, skip, reset, unique message
  ids, mailto encoding.
- Data integrity: required fields, https links, unique ids, the correct LinkedIn URL.

### 3. Integration tests (`tests/integration`, 10 tests)
Render the whole `<App/>` with Testing Library and act like a user:
- Every nav link resolves to a real section.
- The full chat conversation, from name to plan card to email to the "Send to Tathagata" mailto.
- Contact form validation errors, then the success state.
- The profile photo has alt text and explicit dimensions, and is prioritized in the hero but lazy-loaded in About.
- Mobile menu open/close; external links use `target="_blank"` and `rel="noopener"`.

### 4. Regression tests (`tests/regression`, 8 tests)
- **Golden master:** 6 reference businesses → industry, recommendations and hours saved are
  snapshotted. Any rule change that alters what visitors see fails the build until it's reviewed.
- **Content snapshots** of the Services and Projects copy.
- **Site-wide guards:** no dead `#anchors`, every external link has `noopener`, exactly one `<h1>`,
  the LinkedIn URL is correct, mailto encoding is safe.

Coverage: about 97% of statements.

### 5. Load test: 100 concurrent users
`npm run load:test` ramps up 100 virtual users over 5 seconds. Each one:
- loads the page **5 times**, fetching the HTML and every JS/CSS/icon asset in parallel like a browser,
  with 0.2–1 s of think time between visits;
- completes a **full AI-chat conversation** with randomized answers, running the same engine code the
  browser runs.

The run fails (exit code 1) if p95 latency is over 500 ms, any request errors, or any chat session
doesn't produce a plan. You can tune it with `USERS`, `VISITS`, `RAMP_SECONDS`, `P95_MS` and
`MAX_ERROR_RATE`.

Latest result (`vite preview`, local machine):

| Metric | Result |
|---|---|
| Virtual users | 100 |
| Requests | 2,000 |
| Throughput | 231 req/s |
| p50 / p95 / p99 latency | 13 / 80.7 / 131.8 ms |
| HTTP errors | 0 (0%) |
| Chat sessions completed | 100 / 100 |
| **Result** | ✅ PASS |

After you deploy, run it against the live URL:
`BASE_URL=https://your-site.vercel.app npm run load:test:url`.

## How the AI chat works
The chat runs **entirely in the browser**, so there are no API keys and no costs. `automationEngine.js`
matches the visitor's industry, pain points and tools against 10 automation playbooks, each linked to
one of your projects. If you later want a live LLM behind it, replace `analyzeBusiness()` with a call to
your own backend, for example a small Node or Python endpoint that holds your OpenAI key. Never put an
API key in frontend code.

## Deploy
- **Vercel / Netlify:** import the repo. The build command is `npm run build` and the output folder is
  `dist`.
- **Hugging Face Spaces:** create a *Static* Space and upload the contents of `dist/`.

## Accessibility & performance
- Respects `prefers-reduced-motion`: all animations are switched off for users who ask for that.
- Semantic landmarks, labelled form fields, a skip link, visible focus rings, `aria-live` chat log.
- About 123 KB of gzipped JS. Icons are imported one by one so the bundle stays small.
