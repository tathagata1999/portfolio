import { ArrowUp } from 'lucide-react';
import { profile } from '../data/profile.js';

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 pb-28 pt-10 text-sm text-slate-500 sm:flex-row sm:px-8 sm:pb-24">
        <p>© {new Date().getFullYear()} {profile.name} · Built with React, Tailwind &amp; Framer Motion</p>
        <a href="#top" className="group flex items-center gap-2 hover:text-white">
          Back to top <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
        </a>
      </div>
    </footer>
  );
}
