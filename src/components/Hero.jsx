import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageCircle, MapPin } from 'lucide-react';
import { profile } from '../data/profile.js';
import { useTypewriter } from '../hooks/useTypewriter.js';
import AgentTerminal from './AgentTerminal.jsx';
import { LinkedInIcon, HFIcon } from './Icons.jsx';
import ProfilePhoto from './ProfilePhoto.jsx';

const BADGES = [
  { label: '🧠 RAG', cls: 'left-0 top-6', delay: '0s' },
  { label: '🤖 CrewAI', cls: 'right-0 top-2', delay: '-2s' },
  { label: '⚡ QLoRA', cls: 'right-2 top-44', delay: '-4s' },
  { label: '🔗 LangGraph', cls: 'left-2 top-48', delay: '-3s' },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const typed = useTypewriter(profile.rotatingLines);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.3);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bg = useTransform([sx, sy], ([x, y]) =>
    `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(34,211,238,0.13), transparent 45%)`);
  const rotX = useTransform(sy, [0, 1], [6, -6]);
  const rotY = useTransform(sx, [0, 1], [-8, 8]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const item = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="top" onMouseMove={onMove} className="relative isolate min-h-screen overflow-hidden pt-28 sm:pt-36">
      {/* backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-fade bg-grid mask-fade-b" />
        <div className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-cyan-500/25 blur-[110px] animate-blob" />
        <div className="absolute right-[-8rem] top-40 h-[30rem] w-[30rem] rounded-full bg-violet-600/25 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-pink-500/20 blur-[120px] animate-blob animation-delay-4000" />
        <motion.div className="absolute inset-0" style={{ background: bg }} />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.a href="#chat" {...item(0)}
            className="group inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-sm text-cyan-200 hover:bg-cyan-300/15">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 animate-pulse-ring" /><span className="relative h-2 w-2 rounded-full bg-lime-400" /></span>
            Open to AI automation projects
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </motion.a>

          <motion.h1 {...item(1)} className="mt-7 font-display font-semibold tracking-tight text-white">
            <span className="block text-lg sm:text-xl font-medium text-slate-400">Hi, I&apos;m <span className="text-white">{profile.name}</span> 👋</span>
            <span className="sr-only">{profile.rotatingLines[0]}</span>
            <span aria-hidden="true" className="mt-3 block min-h-[2.3em] text-4xl leading-[1.08] sm:text-6xl lg:text-[4.1rem]">
              <span className="text-gradient">{typed}</span>
              <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-1 bg-cyan-300 animate-blink" />
            </span>
          </motion.h1>

          <motion.p {...item(2)} className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-400">
            {profile.tagline} <span className="text-slate-200">{profile.role}</span> · {profile.company}.
          </motion.p>

          <motion.div {...item(3)} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#chat" className="btn-primary group">
              <MessageCircle className="h-4 w-4" /> Tell me about your business
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#projects" className="btn-ghost">See what I&apos;ve built</a>
          </motion.div>

          <motion.div {...item(4)} className="mt-10 flex flex-wrap items-center gap-5 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-cyan-300" />{profile.location}</span>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white" aria-label="LinkedIn profile">
              <LinkedInIcon className="h-4 w-4" /> LinkedIn
            </a>
            <a href={profile.links.huggingface} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white" aria-label="Hugging Face profile">
              <HFIcon className="h-4 w-4" /> Hugging Face
            </a>
          </motion.div>
        </div>

        <motion.div {...item(3)} style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
          className="relative mx-auto w-full max-w-lg">
          <div className="relative flex justify-center">
            <ProfilePhoto priority className="h-52 w-52 sm:h-64 sm:w-64" />
            <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-full border border-lime-300/40 bg-ink-900/90 px-3 py-1 text-xs text-lime-200 backdrop-blur">
              ● Building AI agents @ Infosys
            </span>
            {BADGES.map((b) => (
              <span key={b.label} style={{ animationDelay: b.delay }}
                className={`absolute ${b.cls} z-10 hidden sm:block glass rounded-2xl px-3 py-1.5 font-mono text-xs text-white shadow-lg animate-float`}>
                {b.label}
              </span>
            ))}
          </div>
          <div className="relative mt-10"><AgentTerminal /></div>
        </motion.div>
      </div>

      <a href="#about" aria-label="Scroll to about" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
        <span className="flex h-10 w-6 justify-center rounded-full border border-white/20 pt-2">
          <motion.span className="h-2 w-1 rounded-full bg-cyan-300" animate={{ y: [0, 12, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
        </span>
      </a>
    </section>
  );
}
