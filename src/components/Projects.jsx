import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { projects } from '../data/profile.js';
import { useSpotlight } from '../hooks/useSpotlight.js';
import Reveal from './Reveal.jsx';

function ProjectLinks({ links }) {
  if (!links?.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {links.map((l, i) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
          className={i === 0 ? 'btn-primary !py-2.5 text-sm' : 'btn-ghost !py-2.5 text-sm'}>
          {l.label} <ArrowUpRight className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

function Featured({ p }) {
  const reduce = useReducedMotion();
  return (
    <Reveal>
      <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 p-[1px]">
        <div className={`absolute inset-0 bg-gradient-to-r ${p.accent} opacity-40`} aria-hidden="true" />
        <div className="relative grid gap-10 rounded-[calc(2rem-1px)] bg-ink-900/95 p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="chip !border-lime-300/30 !bg-lime-300/10 !text-lime-200">● {p.kicker}</span>
            <h3 className="mt-5 font-display text-3xl sm:text-4xl font-semibold text-white">{p.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">{p.summary}</p>
            <ul className="mt-6 space-y-2.5">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-slate-300"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lime-300" />{h}</li>
              ))}
            </ul>
            <ProjectLinks links={p.links} />
          </div>
          {/* agent flow visual */}
          <div className="relative grid place-items-center" aria-hidden="true">
            <div className="relative h-72 w-72">
              <div className="absolute inset-0 rounded-full border border-dashed border-white/15 animate-spin-slow" />
              <div className="absolute inset-10 rounded-full border border-white/10" />
              <div className="absolute inset-[42%] grid place-items-center rounded-full bg-gradient-to-br from-lime-300 to-cyan-400 text-2xl shadow-glow">🥗</div>
              {['📷 Vision', '🔎 Search', '🧪 Nutrition', '✅ Verify', '💚 Benefits', '⚖️ Pros/Cons'].map((a, i) => {
                const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
                return (
                  <motion.span key={a}
                    className="absolute glass whitespace-nowrap rounded-full px-3 py-1 text-xs text-white"
                    style={{ left: `${50 + Math.cos(ang) * 46}%`, top: `${50 + Math.sin(ang) * 46}%`, x: '-50%', y: '-50%' }}
                    animate={reduce ? undefined : { scale: [1, 1.12, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(163,230,53,0.7)', 'rgba(255,255,255,0.1)'] }}
                    transition={{ duration: 1.2, delay: i * 0.6, repeat: Infinity, repeatDelay: 2.4 }}>
                    {a}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects() {
  const onMove = useSpotlight();
  const [featured, ...rest] = projects;
  return (
    <section id="projects" className="section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Reveal><p className="eyebrow">// selected work</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2 mt-4">Things I&apos;ve built <span className="text-gradient">that actually run.</span></h2></Reveal>
        </div>
        <Reveal delay={0.1}><p className="max-w-sm text-slate-400">Agents, RAG, fine-tuned models — from enterprise CI/CD to a live food-scanning app.</p></Reveal>
      </div>

      <div className="mt-14"><Featured p={featured} /></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.id} delay={0.08 * i}>
            <article onMouseMove={onMove} className="spotlight group flex h-full flex-col rounded-3xl border border-white/10 p-7">
              <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${p.accent} transition-all duration-500 group-hover:w-28`} aria-hidden="true" />
              <p className="mt-5 font-mono text-xs uppercase tracking-widest text-slate-500">{p.kicker}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-white">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-400">{p.summary}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {p.highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-cyan-300">▹</span>{h}</li>)}
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              <ProjectLinks links={p.links} />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
