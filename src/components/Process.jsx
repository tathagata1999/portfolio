import { processSteps } from '../data/profile.js';
import Reveal from './Reveal.jsx';

export default function Process() {
  return (
    <section id="process" className="section !pt-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 p-8 sm:p-12">
        <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40" aria-hidden="true" />
        <div className="relative">
          <Reveal><p className="eyebrow">// how we work together</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2 mt-4 max-w-2xl">From a 15-minute chat to <span className="text-gradient">hours saved every week.</span></h2></Reveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={0.1 * i} as="li" className="relative">
                {i < processSteps.length - 1 && (
                  <span aria-hidden="true" className="absolute left-14 right-[-2rem] top-6 hidden h-px bg-gradient-to-r from-cyan-300/60 to-transparent md:block" />
                )}
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-ink-900 font-mono text-sm text-cyan-200">{s.n}</span>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
