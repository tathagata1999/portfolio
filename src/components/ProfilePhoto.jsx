import { profile } from '../data/profile.js';

/** Circular portrait with an animated gradient ring. `priority` = above-the-fold (hero). */
export default function ProfilePhoto({ className = 'h-64 w-64', priority = false, ring = true }) {
  const { webp, jpg, alt, width, height } = profile.photo;
  return (
    <div className={`relative shrink-0 ${className}`}>
      {ring && (
        <>
          <div className="absolute -inset-3 rounded-full bg-aurora opacity-60 blur-2xl animate-spin-slow" aria-hidden="true" />
          <div className="absolute -inset-[3px] rounded-full bg-aurora animate-spin-slow" aria-hidden="true" />
        </>
      )}
      <picture className="relative block h-full w-full overflow-hidden rounded-full bg-slate-200 ring-4 ring-ink-950">
        <source srcSet={webp} type="image/webp" />
        <img src={jpg} alt={alt} width={width} height={height}
          loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : undefined} decoding="async"
          className="h-full w-full object-cover object-top" />
      </picture>
    </div>
  );
}
