// Rule-based "business discovery" engine.
// Pure functions only — easy to unit test, runs fully in the browser, no API keys needed.
// (Swap analyzeBusiness for an LLM call later if you want a live model behind the chat.)

export const INDUSTRIES = [
  { id: 'ecommerce', label: 'E-commerce & Retail', keywords: ['shopify', 'store', 'shop', 'ecommerce', 'e-commerce', 'retail', 'amazon', 'flipkart', 'meesho', 'd2c', 'boutique'],
    tip: 'Most stores win fastest with an AI shopping assistant plus automated catalogue & price updates.' },
  { id: 'healthcare', label: 'Healthcare & Clinics', keywords: ['clinic', 'hospital', 'doctor', 'doctors', 'dental', 'patient', 'patients', 'pharmacy', 'diagnostic', 'health'],
    tip: 'Clinics save the most time on appointment booking and repeat patient questions.' },
  { id: 'realestate', label: 'Real Estate', keywords: ['real estate', 'property', 'properties', 'brokerage', 'apartment', 'apartments', 'builder', 'realtor'],
    tip: 'Instant lead qualification and site-visit scheduling usually pay off first.' },
  { id: 'education', label: 'Education & Coaching', keywords: ['coaching', 'institute', 'school', 'tuition', 'students', 'course', 'courses', 'edtech', 'academy', 'teacher'],
    tip: 'A doubt-solving assistant trained on your notes keeps students engaged 24/7.' },
  { id: 'food', label: 'Food & Hospitality', keywords: ['restaurant', 'cafe', 'bakery', 'hotel', 'cloud kitchen', 'catering', 'food'],
    tip: 'Automated order handling, review replies and menu insights are quick wins.' },
  { id: 'finance', label: 'Finance & Accounting', keywords: ['accounting', 'accountant', 'ca firm', 'gst', 'tax', 'bookkeeping', 'audit', 'finance', 'insurance', 'loan'],
    tip: 'Document extraction (invoices, statements) removes the bulk of manual entry.' },
  { id: 'agency', label: 'Agency & Marketing', keywords: ['agency', 'marketing', 'advertising', 'branding', 'seo', 'content studio'],
    tip: 'Content pipelines and automated client reporting free up your team for strategy.' },
  { id: 'tech', label: 'Software & Tech', keywords: ['saas', 'software', 'startup', 'app', 'platform', 'it services', 'devops'],
    tip: 'Log-triage agents and internal knowledge assistants cut debugging time sharply.' },
  { id: 'logistics', label: 'Logistics & Manufacturing', keywords: ['logistics', 'warehouse', 'warehousing', 'shipping', 'transport', 'manufacturing', 'factory', 'supply chain'],
    tip: 'Demand forecasting and automated status updates reduce firefighting.' },
];

const GENERAL = { id: 'general', label: 'Your business', keywords: [],
  tip: 'We start by mapping your most repetitive workflow and automate that first.' };

export const AUTOMATIONS = [
  { id: 'support-agent', title: 'AI Customer Support Agent',
    description: 'A RAG-powered assistant that answers customer questions 24/7 on WhatsApp, web chat or email — grounded in your own FAQs, catalogue and policies.',
    keywords: ['support', 'customer', 'customers', 'questions', 'queries', 'query', 'whatsapp', 'tickets', 'faq', 'complaints', 'replying', 'reply', 'chat', 'calls'],
    hoursPerWeek: 10, stack: ['RAG', 'LangChain', 'ChromaDB', 'OpenAI'], proof: 'food-health-scanner' },
  { id: 'doc-extraction', title: 'Document & Data-Entry Automation',
    description: 'LLM + vision pipeline that reads invoices, bills, forms and PDFs and pushes clean data into Excel, Sheets, Tally or your CRM.',
    keywords: ['data entry', 'invoice', 'invoices', 'excel', 'spreadsheet', 'sheets', 'forms', 'pdf', 'bills', 'copy paste', 'manual entry', 'receipts', 'documents'],
    hoursPerWeek: 8, stack: ['Vision LLM', 'Python', 'OpenAI SDK'], proof: 'food-health-scanner' },
  { id: 'lead-agent', title: 'Lead Qualification & Follow-up Agent',
    description: 'An agent that scores incoming leads, drafts personalised follow-ups and updates your CRM so no prospect goes cold.',
    keywords: ['leads', 'lead', 'follow up', 'followup', 'sales', 'crm', 'outreach', 'prospects', 'enquiries', 'enquiry', 'cold'],
    hoursPerWeek: 7, stack: ['CrewAI', 'LLM Agents', 'CRM APIs'], proof: 'crewai-team' },
  { id: 'content-engine', title: 'AI Content Engine',
    description: 'Generates on-brand social posts, product descriptions, blogs and ad copy from a single brief — with a human-approval step.',
    keywords: ['content', 'social media', 'instagram', 'posts', 'post', 'marketing', 'blog', 'blogs', 'seo', 'captions', 'descriptions', 'ads'],
    hoursPerWeek: 6, stack: ['Prompt Engineering', 'LLMs', 'Gradio'], proof: 'crewai-team' },
  { id: 'booking-assistant', title: 'Smart Booking Assistant',
    description: 'Conversational scheduling that books, reschedules and reminds customers automatically, synced with your calendar.',
    keywords: ['appointments', 'appointment', 'booking', 'bookings', 'schedule', 'scheduling', 'calendar', 'reservations', 'slots'],
    hoursPerWeek: 6, stack: ['LLM Agents', 'Calendar APIs', 'WhatsApp API'], proof: 'crewai-team' },
  { id: 'insights', title: 'Automated Reports & Insights',
    description: 'Daily/weekly reports written by AI from your sales and ops data — with plain-English explanations of what changed and why.',
    keywords: ['report', 'reports', 'reporting', 'dashboard', 'analysis', 'analytics', 'kpi', 'mis', 'numbers', 'tracking'],
    hoursPerWeek: 5, stack: ['Python', 'Pandas', 'LLMs'], proof: 'price-predictor' },
  { id: 'forecasting', title: 'Price & Demand Prediction',
    description: 'Hybrid ML + fine-tuned LLM models that forecast demand or suggest pricing from your product and sales data.',
    keywords: ['inventory', 'stock', 'pricing', 'price', 'prices', 'demand', 'forecast', 'forecasting', 'restock'],
    hoursPerWeek: 5, stack: ['XGBoost', 'QLoRA', 'LLaMA 3.2'], proof: 'price-predictor' },
  { id: 'hr-screening', title: 'Resume Screening & HR Assistant',
    description: 'Shortlists candidates against your job description, schedules interviews and answers employee policy questions.',
    keywords: ['hiring', 'recruitment', 'resumes', 'resume', 'cv', 'candidates', 'onboarding', 'hr', 'interviews'],
    hoursPerWeek: 6, stack: ['RAG', 'LLM Agents'], proof: 'crewai-team' },
  { id: 'knowledge-base', title: 'Internal Knowledge Assistant',
    description: 'A private ChatGPT over your SOPs, Confluence, Drive and docs — your team gets instant, cited answers.',
    keywords: ['documentation', 'docs', 'knowledge', 'sop', 'sops', 'policy', 'policies', 'training', 'search', 'confluence', 'wiki'],
    hoursPerWeek: 6, stack: ['RAG', 'Vector DB', 'LangChain'], proof: 'dell-rag-assistant' },
  { id: 'devops-agents', title: 'CI/CD Log-Triage Agents',
    description: 'Multi-agent system that reads build logs, finds the root cause and suggests fixes — the same approach I built for Dell.',
    keywords: ['build', 'builds', 'deploy', 'deployment', 'pipeline', 'pipelines', 'logs', 'bugs', 'jenkins', 'ci/cd', 'debugging', 'failures'],
    hoursPerWeek: 8, stack: ['CrewAI', 'OpenAI SDK', 'Jenkins'], proof: 'dell-rag-assistant' },
];

const DEFAULT_IDS = ['support-agent', 'knowledge-base', 'insights'];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const countHits = (text, keywords) =>
  keywords.reduce((n, kw) => (new RegExp(`(^|[^a-z0-9])${escapeRe(kw)}([^a-z0-9]|$)`, 'i').test(text) ? n + 1 : n), 0);

export function detectIndustry(text = '') {
  const t = String(text || '').toLowerCase();
  let best = GENERAL;
  let bestScore = 0;
  for (const ind of INDUSTRIES) {
    const score = countHits(t, ind.keywords);
    if (score > bestScore) { best = ind; bestScore = score; }
  }
  return best;
}

export function matchAutomations(text = '', limit = 3) {
  const t = String(text || '').toLowerCase();
  const scored = AUTOMATIONS.map((a, i) => ({ ...a, score: countHits(t, a.keywords), order: i }))
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit);
  const picked = scored.map(({ order, ...a }) => a);
  // Top up with defaults so every visitor gets a full set of ideas
  for (const id of DEFAULT_IDS) {
    if (picked.length >= limit) break;
    if (!picked.some((p) => p.id === id)) picked.push({ ...AUTOMATIONS.find((a) => a.id === id), score: 0 });
  }
  return picked;
}

export function parseTeamSize(text = '') {
  const t = String(text || '').toLowerCase().trim();
  if (!t || /\b(just me|myself|solo|alone|only me)\b/.test(t)) return 1;
  const range = t.match(/(\d+)\s*(?:-|to|–)\s*(\d+)/);
  if (range) return Math.round((Number(range[1]) + Number(range[2])) / 2);
  const num = t.match(/\d+/);
  return num ? Math.max(1, Number(num[0])) : 1;
}

export function estimateHoursSaved(recs, teamSize = 1) {
  if (!recs || recs.length === 0) return 0;
  const base = recs.reduce((s, r) => s + (r.hoursPerWeek || 0), 0);
  const multiplier = 1 + Math.log2(Math.max(1, teamSize)) * 0.6;
  return Math.min(400, Math.round(base * multiplier));
}

export function splitTools(text = '') {
  return String(text || '').split(/[,/&]|\band\b/i).map((s) => s.trim()).filter(Boolean);
}

export function analyzeBusiness({ name = '', business = '', pain = '', tools = '', team = '' } = {}) {
  const industry = detectIndustry(`${business} ${tools}`);
  const recommendations = matchAutomations(`${pain} ${tools}`);
  const teamSize = parseTeamSize(team);
  const hoursSaved = estimateHoursSaved(recommendations, teamSize);
  const who = name ? `${name}, ` : '';
  const summary = `${who}here's what I'd automate first for your ${industry.id === 'general' ? 'business' : industry.label.toLowerCase()} — roughly ${hoursSaved} hours/week back for your team of ${teamSize}.`;
  return { industry, recommendations, teamSize, hoursSaved, tools: splitTools(tools), summary };
}
