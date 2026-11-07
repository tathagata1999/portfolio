import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { profile } from '../data/profile.js';
import { validateContact } from '../lib/validators.js';
import { IS_TEST } from '../lib/env.js';
import Reveal from './Reveal.jsx';
import { LinkedInIcon, HFIcon } from './Icons.jsx';

const FIELDS = [
  { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
];

export function buildContactMailto({ name, email, message }, to) {
  const body = `${message}\n\n— ${name} (${email})`;
  return `mailto:${to}?subject=${encodeURIComponent(`AI project enquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);

  const update = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })); };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validateContact(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const href = buildContactMailto(form, profile.email);
    setSent({ name: form.name.trim(), href });
    if (!IS_TEST) window.location.href = href;
  };

  const inputCls = (k) => `w-full rounded-2xl border bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 ${errors[k] ? 'border-pink-400/70' : 'border-white/10'}`;

  return (
    <section id="contact" className="section">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 p-8 sm:p-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/15 via-ink-900 to-violet-600/20" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl animate-blob" aria-hidden="true" />
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal><p className="eyebrow">// contact</p></Reveal>
            <Reveal delay={0.05}><h2 className="h2 mt-4">Got a task that eats your week? <span className="text-gradient">Let&apos;s automate it.</span></h2></Reveal>
            <Reveal delay={0.1}><p className="mt-5 text-lg text-slate-400">Tell me what you do and where the hours go. I&apos;ll reply within 24 hours with ideas — no obligation.</p></Reveal>
            <Reveal delay={0.15} className="mt-8 space-y-3">
              <a href={profile.links.email} className="flex items-center gap-3 text-slate-200 hover:text-cyan-200"><Mail className="h-5 w-5 text-cyan-300" />{profile.email}</a>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-200 hover:text-cyan-200"><LinkedInIcon className="h-5 w-5 text-cyan-300" />linkedin.com/in/tathagata-mallik</a>
              <a href={profile.links.huggingface} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-200 hover:text-cyan-200"><HFIcon className="h-5 w-5" />huggingface.co/Tatha1999</a>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            {sent ? (
              <motion.div role="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass grid h-full place-items-center rounded-3xl p-10 text-center">
                <div>
                  <CheckCircle2 className="mx-auto h-14 w-14 text-lime-300" />
                  <p className="mt-4 font-display text-2xl text-white">Thanks, {sent.name}!</p>
                  <p className="mt-2 text-slate-400">Your email app should open with the message ready. If it didn&apos;t, <a className="text-cyan-300 underline" href={sent.href}>click here</a>.</p>
                </div>
              </motion.div>
            ) : (
              <form aria-label="Contact form" noValidate onSubmit={onSubmit} className="glass space-y-5 rounded-3xl p-6 sm:p-8">
                {FIELDS.map((f) => (
                  <div key={f.name}>
                    <label htmlFor={`c-${f.name}`} className="mb-1.5 block text-sm text-slate-300">{f.label}</label>
                    <input id={`c-${f.name}`} type={f.type} autoComplete={f.autoComplete} value={form[f.name]} onChange={update(f.name)}
                      aria-invalid={!!errors[f.name]} aria-describedby={errors[f.name] ? `c-${f.name}-err` : undefined} className={inputCls(f.name)} />
                    {errors[f.name] && <p id={`c-${f.name}-err`} className="mt-1.5 text-sm text-pink-300">{errors[f.name]}</p>}
                  </div>
                ))}
                <div>
                  <label htmlFor="c-message" className="mb-1.5 block text-sm text-slate-300">What should AI automate for you?</label>
                  <textarea id="c-message" rows={4} value={form.message} onChange={update('message')}
                    placeholder="e.g. We spend 10 hours a week entering invoices into Excel…"
                    aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-message-err' : undefined} className={inputCls('message')} />
                  {errors.message && <p id="c-message-err" className="mt-1.5 text-sm text-pink-300">{errors.message}</p>}
                </div>
                <button type="submit" className="btn-primary w-full justify-center">Send message <Send className="h-4 w-4" /></button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
