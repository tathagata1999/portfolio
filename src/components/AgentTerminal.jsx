import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { IS_TEST } from '../lib/env.js';

const RUNS = [
  [
    { tag: 'INPUT', color: 'text-pink-300', text: '“Reply to 42 customer WhatsApp messages”' },
    { tag: 'RAG', color: 'text-cyan-300', text: 'retrieved 18 chunks from FAQ + catalogue' },
    { tag: 'AGENT', color: 'text-violet-300', text: 'drafting answers · tone: friendly' },
    { tag: 'VERIFY', color: 'text-amber-300', text: '2 answers flagged for human review' },
    { tag: 'DONE', color: 'text-lime-300', text: '40 replies sent in 6.1s ⚡' },
  ],
  [
    { tag: 'INPUT', color: 'text-pink-300', text: '“Enter 120 invoices into Tally”' },
    { tag: 'VISION', color: 'text-cyan-300', text: 'extracting GSTIN, totals, line items' },
    { tag: 'AGENT', color: 'text-violet-300', text: 'validating against purchase orders' },
    { tag: 'VERIFY', color: 'text-amber-300', text: '3 mismatches → refined & re-checked' },
    { tag: 'DONE', color: 'text-lime-300', text: '120 entries posted · 9 hrs saved ⏱' },
  ],
  [
    { tag: 'INPUT', color: 'text-pink-300', text: '“Why did build #4821 fail?”' },
    { tag: 'RAG', color: 'text-cyan-300', text: 'Jenkins logs + Confluence runbooks' },
    { tag: 'CREW', color: 'text-violet-300', text: 'log-analyst → root-cause → fixer' },
    { tag: 'VERIFY', color: 'text-amber-300', text: 'matched known issue SSRE-1193' },
    { tag: 'DONE', color: 'text-lime-300', text: 'fix suggested in 14s 🛠' },
  ],
];

export default function AgentTerminal() {
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(IS_TEST ? RUNS[0].length : 1);

  useEffect(() => {
    if (IS_TEST) return undefined;
    const lines = RUNS[run].length;
    const t = setTimeout(() => {
      if (shown < lines) setShown((n) => n + 1);
      else { setRun((r) => (r + 1) % RUNS.length); setShown(1); }
    }, shown < lines ? 900 : 2600);
    return () => clearTimeout(t);
  }, [run, shown]);

  return (
    <div className="relative" aria-label="Live demo of an AI agent pipeline" role="img">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-aurora opacity-30 blur-3xl animate-spin-slow" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/80 backdrop-blur-xl shadow-glow-violet">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-300/80" />
          <span className="h-3 w-3 rounded-full bg-lime-400/80" />
          <span className="ml-3 flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <Terminal className="h-3.5 w-3.5" /> agent-pipeline.run
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-lime-300">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 animate-pulse-ring" /><span className="relative h-2 w-2 rounded-full bg-lime-400" /></span>
            LIVE
          </span>
        </div>
        <div className="min-h-[190px] space-y-2 p-4 sm:p-5 font-mono text-[13px] leading-relaxed">
          <AnimatePresence mode="popLayout">
            {RUNS[run].slice(0, shown).map((l, i) => (
              <motion.div key={`${run}-${i}`} layout
                initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }} className="flex gap-3">
                <span className={`w-16 shrink-0 font-semibold ${l.color}`}>[{l.tag}]</span>
                <span className="text-slate-300">{l.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <span className="inline-block h-4 w-2 translate-y-0.5 bg-cyan-300 animate-blink" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
