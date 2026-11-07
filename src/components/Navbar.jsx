import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#chat', label: 'AI Chat' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 sm:px-6 py-2.5 transition-all duration-500 ${scrolled ? 'glass mx-3 sm:mx-auto shadow-2xl shadow-black/40' : ''}`}>
        <a href="#top" className="group flex items-center gap-2 font-display text-lg font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-400 text-ink-950 text-sm font-bold transition-transform group-hover:rotate-12">TM</span>
          <span className="hidden sm:inline">Tathagata<span className="text-cyan-300">.ai</span></span>
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}
              className="relative rounded-full px-3.5 py-1.5 text-sm text-slate-300 transition-colors hover:text-white hover:bg-white/5">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#chat" className="hidden sm:inline-flex btn-primary !px-4 !py-2 text-sm">
            <Sparkles className="h-4 w-4" /> Automate my work
          </a>
          <button type="button" className="md:hidden grid h-10 w-10 place-items-center rounded-full glass"
            aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav aria-label="Mobile"
            initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass mx-3 mt-2 rounded-3xl p-3">
            {NAV_LINKS.map((l, i) => (
              <motion.a key={l.href} href={l.href} onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="block rounded-2xl px-4 py-3 text-base text-slate-200 hover:bg-white/5">
                {l.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
