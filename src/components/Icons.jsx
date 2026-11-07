// Small inline brand marks (lucide no longer ships brand icons).
export const LinkedInIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <rect x="6.3" y="10" width="2.2" height="7.5" />
    <circle cx="7.4" cy="7.1" r="1.35" />
    <path d="M10.8 10h2.1v1.1c.4-.7 1.3-1.3 2.6-1.3 2.2 0 2.9 1.4 2.9 3.4v4.3h-2.2v-3.9c0-1-.2-1.9-1.3-1.9s-1.9.8-1.9 2v3.8h-2.2z" />
  </svg>
);

export const HFIcon = ({ className = 'h-5 w-5' }) => (
  <span className={`inline-grid place-items-center leading-none ${className}`} aria-hidden="true">🤗</span>
);
