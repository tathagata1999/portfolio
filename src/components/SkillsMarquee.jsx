import { skills } from '../data/profile.js';

function Row({ items, reverse }) {
  return (
    <div className="group flex overflow-hidden mask-fade-x">
      <div className={`flex shrink-0 gap-3 pr-3 animate-marquee group-hover:[animation-play-state:paused] ${reverse ? '[animation-direction:reverse]' : ''}`}>
        {[...items, ...items].map((s, i) => (
          <span key={`${s}-${i}`} aria-hidden={i >= items.length}
            className="whitespace-nowrap rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-white">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsMarquee() {
  const half = Math.ceil(skills.length / 2);
  return (
    <section aria-label="Skills" className="space-y-3 py-6">
      <Row items={skills.slice(0, half)} />
      <Row items={skills.slice(half)} reverse />
    </section>
  );
}
