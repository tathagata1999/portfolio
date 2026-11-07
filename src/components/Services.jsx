import { MessageSquareText, FileScan, Bot, BrainCircuit, TrendingUp, Workflow, Sparkles, ArrowRight } from 'lucide-react';

const ICONS = { MessageSquareText, FileScan, Bot, BrainCircuit, TrendingUp, Workflow };
import { services } from '../data/profile.js';
import { useSpotlight } from '../hooks/useSpotlight.js';
import Reveal from './Reveal.jsx';

export default function Services() {
  const onMove = useSpotlight();
  return (
    <section id="services" className="section">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal><p className="eyebrow">// what I can automate for you</p></Reveal>
        <Reveal delay={0.05}><h2 className="h2 mt-4">I can automate your tasks with AI.<br /><span className="text-gradient">You get your hours back.</span></h2></Reveal>
        <Reveal delay={0.1}><p className="mt-5 text-lg text-slate-400">If someone on your team does it every day by copy-paste, it can probably be automated. Here&apos;s where I usually start.</p></Reveal>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = ICONS[s.icon] || Sparkles;
          return (
            <Reveal key={s.id} delay={0.06 * i}>
              <article onMouseMove={onMove}
                className="spotlight group h-full rounded-3xl border border-white/10 p-7 transition-transform duration-500 hover:-translate-y-1.5">
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300/20 to-violet-400/20 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-6 w-6 text-cyan-200" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-400">{s.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2} className="mt-12 text-center">
        <a href="#chat" className="btn-ghost">Not sure what fits? Chat with my AI assistant <ArrowRight className="h-4 w-4" /></a>
      </Reveal>
    </section>
  );
}
