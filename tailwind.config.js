/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: { 950: '#05060a', 900: '#0a0c14', 800: '#11141f', 700: '#1a1f2e' },
        neon: { cyan: '#22d3ee', violet: '#a78bfa', pink: '#f472b6', lime: '#a3e635' },
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'aurora':
          'conic-gradient(from 180deg at 50% 50%, #22d3ee 0deg, #a78bfa 120deg, #f472b6 240deg, #22d3ee 360deg)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(40px,-60px) scale(1.15)' },
          '66%': { transform: 'translate(-30px,30px) scale(0.92)' },
        },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        blink: { '0%,50%': { opacity: 1 }, '51%,100%': { opacity: 0 } },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: 0.7 },
          '100%': { transform: 'scale(1.6)', opacity: 0 },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 18s ease-in-out infinite',
        marquee: 'marquee 35s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        'spin-slow': 'spinSlow 14s linear infinite',
        blink: 'blink 1s step-end infinite',
        'pulse-ring': 'pulseRing 1.8s cubic-bezier(0.2,0.6,0.4,1) infinite',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(34,211,238,0.45)',
        'glow-violet': '0 0 50px -10px rgba(167,139,250,0.55)',
      },
    },
  },
  plugins: [],
};
