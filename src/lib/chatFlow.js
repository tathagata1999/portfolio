import { analyzeBusiness } from './automationEngine.js';
import { isValidEmail } from './validators.js';

export const STEPS = {
  NAME: 'name',
  BUSINESS: 'business',
  PAIN: 'pain',
  TOOLS: 'tools',
  TEAM: 'team',
  EMAIL: 'email',
  DONE: 'done',
};

export const QUICK_REPLIES = {
  [STEPS.NAME]: [],
  [STEPS.BUSINESS]: ['Online store', 'Clinic / healthcare', 'Coaching institute', 'Marketing agency', 'Software startup'],
  [STEPS.PAIN]: ['Answering customer questions', 'Data entry from invoices', 'Following up with leads', 'Writing social media posts', 'Making weekly reports'],
  [STEPS.TOOLS]: ['Excel / Google Sheets', 'WhatsApp', 'Shopify', 'Zoho / HubSpot CRM', 'Pen & paper 😅'],
  [STEPS.TEAM]: ['Just me', '2-10', '11-50', '50+'],
  [STEPS.EMAIL]: ['skip'],
  [STEPS.DONE]: [],
};

const MAX_LEN = 500;

const makeMsg = (state, from, text, extra = {}) => ({ id: `m${state.seq + 1}`, from, text, ...extra });

function push(state, from, text, extra) {
  const msg = makeMsg(state, from, text, extra);
  return { ...state, seq: state.seq + 1, messages: [...state.messages, msg] };
}

export function initialChatState() {
  const base = { step: STEPS.NAME, answers: {}, plan: null, messages: [], seq: 0 };
  let s = push(base, 'bot', "Hi 👋 I'm Tathagata's AI assistant. In 5 quick questions I'll show you which parts of your business AI can automate.");
  s = push(s, 'bot', 'First — what should I call you?');
  return s;
}

export function chatReducer(state, action) {
  if (action.type === 'RESET') return initialChatState();
  if (action.type !== 'USER_INPUT') return state;
  if (state.step === STEPS.DONE) return state;

  const text = String(action.text ?? '').trim().slice(0, MAX_LEN);
  if (!text) return state;

  let s = push(state, 'user', text);

  switch (state.step) {
    case STEPS.NAME: {
      s = { ...s, answers: { ...s.answers, name: text }, step: STEPS.BUSINESS };
      return push(s, 'bot', `Nice to meet you, ${text}! What does your business do?`);
    }
    case STEPS.BUSINESS: {
      s = { ...s, answers: { ...s.answers, business: text }, step: STEPS.PAIN };
      return push(s, 'bot', 'Got it. Which tasks eat up most of your (or your team\'s) time every week?');
    }
    case STEPS.PAIN: {
      s = { ...s, answers: { ...s.answers, pain: text }, step: STEPS.TOOLS };
      return push(s, 'bot', 'What tools do you use for that today? (e.g. Excel, WhatsApp, Shopify, a CRM…)');
    }
    case STEPS.TOOLS: {
      s = { ...s, answers: { ...s.answers, tools: text }, step: STEPS.TEAM };
      return push(s, 'bot', 'Last one — how many people are on your team?');
    }
    case STEPS.TEAM: {
      const answers = { ...s.answers, team: text };
      const plan = analyzeBusiness(answers);
      s = { ...s, answers, plan, step: STEPS.EMAIL };
      s = push(s, 'bot', plan.summary, { kind: 'plan', plan });
      return push(s, 'bot', 'Want a detailed automation plan? Drop your email and I\'ll prepare one — or type "skip".');
    }
    case STEPS.EMAIL: {
      if (/^skip$/i.test(text)) {
        s = { ...s, answers: { ...s.answers, email: '' }, step: STEPS.DONE };
        return push(s, 'bot', 'No problem! Hit "Send to Tathagata" below whenever you\'re ready to talk — I reply within 24 hours. 🚀', { kind: 'cta' });
      }
      if (!isValidEmail(text)) {
        return push(s, 'bot', 'Hmm, that doesn\'t look like a valid email. Try again, or type "skip".');
      }
      s = { ...s, answers: { ...s.answers, email: text }, step: STEPS.DONE };
      return push(s, 'bot', `Perfect, ${s.answers.name || 'friend'}! Tap "Send to Tathagata" to share this plan — he'll get back to you at ${text}. 🚀`, { kind: 'cta' });
    }
    default:
      return state;
  }
}

export function buildPlanMailto(state, to) {
  const { answers = {}, plan } = state;
  const lines = [
    `Hi Tathagata,`,
    ``,
    `I chatted with your AI assistant. Here are my details:`,
    `Name: ${answers.name || '-'}`,
    `Business: ${answers.business || '-'}`,
    `Time-consuming tasks: ${answers.pain || '-'}`,
    `Current tools: ${answers.tools || '-'}`,
    `Team size: ${answers.team || '-'}`,
    `My email: ${answers.email || '-'}`,
    ``,
  ];
  if (plan) {
    lines.push(`Suggested automations (~${plan.hoursSaved} hrs/week saved):`);
    plan.recommendations.forEach((r, i) => lines.push(`${i + 1}. ${r.title}`));
  }
  lines.push('', "Let's talk!");
  const subject = `AI automation for ${answers.business || 'my business'}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}
