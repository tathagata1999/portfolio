import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { experience } from '../data/profile.js';
import Reveal from './Reveal.jsx';

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="section">
      <Reveal><p className="eyebrow">// experience</p></Reveal>
      <Reveal delay={0.05}><h2 className="h2 mt-4">Where I&apos;ve <span className="text-gradient">shipped.</span></h2></Reveal>

      <div ref={ref} className="relative mt-14 pl-8 sm:pl-12">
        <div className="absolute left-2 sm:left-4 top-0 h-full w-px bg-white/10" aria-hidden="true" />
        <motion.div style={{ height }} className="absolute left-2 sm:left-4 top-0 w-px bg-gradient-to-b from-cyan-300 via-violet-400 to-pink-400" aria-hidden="true" />
        <ol className="space-y-10">
          {experience.map((e, i) => (
            <Reveal as="li" key={e.company} delay={0.05 * i} className="relative">
              <span className={`absolute -left-[1.85rem] sm:-left-[2.6rem] top-1.5 grid h-5 w-5 place-items-center rounded-full border ${i === 0 ? 'border-lime-300 bg-lime-300/20' : 'border-cyan-300/60 bg-ink-950'}`} aria-hidden="true">
                <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-lime-300' : 'bg-cyan-300'}`} />
              </span>
              <div className="glass rounded-3xl p-6 sm:p-8 transition-colors hover:border-white/20">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
                    <Briefcase className="h-5 w-5 text-cyan-300" aria-hidden="true" />{e.company}
                    {e.end === 'Present' && <span className="chip !border-lime-300/30 !text-lime-200">Current</span>}
                  </h3>
                  <span className="font-mono text-sm text-slate-400">{e.start} — {e.end}</span>
                </div>
                <p className="mt-1 text-slate-300">{e.role}</p>
                <p className="text-sm text-slate-500">{e.location}</p>
                <ul className="mt-4 space-y-2 text-slate-400">
                  {e.points.map((p) => <li key={p} className="flex gap-2"><span className="text-violet-300">▹</span>{p}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
