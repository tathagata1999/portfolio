import { useEffect, useReducer, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, RotateCcw, Sparkles, Clock, Mail, User } from 'lucide-react';
import { chatReducer, initialChatState, QUICK_REPLIES, STEPS, buildPlanMailto } from '../lib/chatFlow.js';
import { profile } from '../data/profile.js';
import { IS_TEST } from '../lib/env.js';
import Reveal from './Reveal.jsx';

const TYPING_MS = IS_TEST ? 0 : 750;

function PlanCard({ plan }) {
  return (
    <div data-testid="plan-card" className="w-full rounded-2xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/10 to-violet-400/5 p-4">
      <p className="text-sm text-slate-200">{plan.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="chip !border-violet-300/30 !text-violet-200">{plan.industry.label}</span>
        <span className="chip !border-lime-300/30 !text-lime-200 flex items-center gap-1"><Clock className="h-3 w-3" />~{plan.hoursSaved} hrs/week saved</span>
      </div>
      <ol className="mt-4 space-y-3">
        {plan.recommendations.map((r, i) => (
          <motion.li key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}
            className="rounded-xl border border-white/10 bg-ink-950/60 p-3">
            <p className="flex items-center gap-2 font-semibold text-white"><span className="font-mono text-xs text-cyan-300">0{i + 1}</span>{r.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{r.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{r.stack.map((s) => <span key={s} className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">{s}</span>)}</div>
          </motion.li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-300">💡 {plan.industry.tip}</p>
    </div>
  );
}

function Bubble({ m }) {
  const isBot = m.from === 'bot';
  return (
    <motion.div layout initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }}
      className={`flex items-end gap-2 ${isBot ? '' : 'flex-row-reverse'}`}>
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${isBot ? 'bg-gradient-to-br from-cyan-300 to-violet-400 text-ink-950' : 'bg-white/10 text-slate-200'}`} aria-hidden="true">
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </span>
      {m.kind === 'plan' ? (
        <div className="max-w-[88%]"><PlanCard plan={m.plan} /></div>
      ) : (
        <p className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isBot ? 'rounded-bl-md bg-white/[0.06] text-slate-200' : 'rounded-br-md bg-gradient-to-r from-cyan-400 to-violet-400 font-medium text-ink-950'}`}>
          {m.text}
        </p>
      )}
    </motion.div>
  );
}

export default function ChatAssistant() {
  const [state, dispatch] = useReducer(chatReducer, undefined, initialChatState);
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(state.messages.length);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Reveal bot replies after a short "typing…" pause
  useEffect(() => {
    if (state.messages.length < visible) { setVisible(state.messages.length); return undefined; }
    if (state.messages.length === visible) return undefined;
    const lastUser = state.messages.map((m) => m.from).lastIndexOf('user');
    if (lastUser >= visible) setVisible(lastUser + 1);
    if (TYPING_MS === 0) { setVisible(state.messages.length); return undefined; }
    const t = setTimeout(() => setVisible(state.messages.length), TYPING_MS);
    return () => clearTimeout(t);
  }, [state.messages, visible]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo?.({ top: el.scrollHeight, behavior: 'smooth' });
  }, [visible]);

  const typing = visible < state.messages.length;
  const send = (text) => {
    if (!String(text).trim() || typing) return;
    dispatch({ type: 'USER_INPUT', text });
    setInput('');
    inputRef.current?.focus({ preventScroll: true });
  };
  const onSubmit = (e) => { e.preventDefault(); send(input); };
  const restart = () => { dispatch({ type: 'RESET' }); setInput(''); };

  const shown = state.messages.slice(0, visible);
  const chips = !typing ? QUICK_REPLIES[state.step] || [] : [];
  const done = state.step === STEPS.DONE;
  const placeholder = {
    [STEPS.NAME]: 'Your name…', [STEPS.BUSINESS]: 'e.g. I run a bakery with 2 outlets',
    [STEPS.PAIN]: 'e.g. replying to orders on WhatsApp', [STEPS.TOOLS]: 'e.g. Excel, WhatsApp',
    [STEPS.TEAM]: 'e.g. 5', [STEPS.EMAIL]: 'you@company.com or "skip"', [STEPS.DONE]: 'Conversation complete',
  }[state.step];

  return (
    <section id="chat" className="section">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div className="lg:sticky lg:top-28">
          <Reveal><p className="eyebrow">// let&apos;s have a chat</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2 mt-4">Tell me about your business. <span className="text-gradient">I&apos;ll show you what AI can automate.</span></h2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg text-slate-400">Answer 5 quick questions and my assistant builds a mini automation plan for you — the workflows to automate first, the stack I&apos;d use and roughly how many hours you&apos;ll save.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-3 text-slate-300">
              {['Takes under a minute', 'Tailored to your industry and team size', 'No sign-up — your answers stay in your browser'].map((t) => (
                <li key={t} className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-cyan-300" />{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div role="region" aria-label="AI business assistant"
            className="relative flex h-[640px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900/80 shadow-glow-violet backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 text-ink-950">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink-900 bg-lime-400" />
              </span>
              <div>
                <p className="font-semibold text-white">Tathagata&apos;s AI Assistant</p>
                <p className="text-xs text-slate-400">{typing ? 'typing…' : 'Online · replies instantly'}</p>
              </div>
              <button type="button" onClick={restart} aria-label="Restart conversation"
                className="ml-auto grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:rotate-[-90deg] hover:bg-white/5 hover:text-white">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div ref={listRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
              {shown.map((m) => <Bubble key={m.id} m={m} />)}
              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2" aria-label="Assistant is typing">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 text-ink-950"><Bot className="h-4 w-4" /></span>
                    <span className="flex gap-1 rounded-2xl bg-white/[0.06] px-4 py-3">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-slate-300"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }} />
                      ))}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              {done && !typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center pt-2">
                  <a href={buildPlanMailto(state, profile.email)} className="btn-primary text-sm">
                    <Mail className="h-4 w-4" /> Send to Tathagata
                  </a>
                </motion.div>
              )}
            </div>

            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2 px-5 pb-3">
                {chips.map((c) => (
                  <button key={c} type="button" onClick={() => send(c)}
                    className="rounded-full border border-cyan-300/30 bg-cyan-300/5 px-3 py-1.5 text-xs text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/15">
                    {c}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} disabled={done}
                aria-label="Message" placeholder={placeholder} maxLength={500}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none disabled:opacity-50" />
              <button type="submit" aria-label="Send message" disabled={!input.trim() || done}
                className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 text-ink-950 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
