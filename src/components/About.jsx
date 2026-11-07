import { Award, GraduationCap, ArrowUpRight } from 'lucide-react';
import { profile, certifications, education } from '../data/profile.js';
import Reveal from './Reveal.jsx';
import Counter from './Counter.jsx';
import ProfilePhoto from './ProfilePhoto.jsx';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal className="flex items-center gap-4">
            <ProfilePhoto ring={false} className="h-16 w-16 ring-2 ring-cyan-300/50 rounded-full" />
            <div>
              <p className="eyebrow">// about me</p>
              <p className="mt-1 font-display text-lg text-white">{profile.name}</p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h2 mt-4">From shipping firmware pipelines to <span className="text-gradient">building AI agents.</span></h2>
          </Reveal>
          <Reveal delay={0.1}><p className="mt-6 text-lg leading-relaxed text-slate-400">{profile.intro}</p></Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 leading-relaxed text-slate-400">
              I care about AI that actually works in production — grounded with retrieval, checked by verification agents,
              monitored like any other system. Not demos. <span className="text-slate-200">Tools your team uses every day.</span>
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="glass rounded-2xl p-4">
              <GraduationCap className="h-5 w-5 text-violet-300" />
              <p className="mt-2 text-sm font-semibold text-white">{education.degree}</p>
              <p className="text-xs text-slate-400">{education.school} · {education.grade}</p>
            </div>
            {certifications.map((c) => (
              <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer"
                className="group glass rounded-2xl p-4 transition-colors hover:border-cyan-300/40">
                <Award className="h-5 w-5 text-cyan-300" />
                <p className="mt-2 text-sm font-semibold text-white">{c.title}</p>
                <p className="flex items-center gap-1 text-xs text-slate-400">{c.issuer} · {c.date}
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></p>
              </a>
            ))}
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4 self-center">
          {profile.stats.map((s, i) => (
            <Reveal key={s.label} delay={0.08 * i}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 ${i % 2 ? 'translate-y-8' : ''}`}>
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl transition-all duration-500 group-hover:bg-violet-400/30" aria-hidden="true" />
              <p className="font-display text-5xl font-semibold text-white"><Counter to={s.value} suffix={s.suffix} /></p>
              <p className="mt-2 text-sm text-slate-400">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
