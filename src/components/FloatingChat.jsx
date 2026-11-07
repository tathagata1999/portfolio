import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function FloatingChat() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const chat = document.getElementById('chat');
      const r = chat?.getBoundingClientRect();
      const chatVisible = r && r.top < window.innerHeight && r.bottom > 0;
      setShow(window.scrollY > 600 && !chatVisible);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a href="#chat" aria-label="Chat with my AI assistant"
          initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 20 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 px-5 py-3.5 font-semibold text-ink-950 shadow-glow">
          <span className="absolute inset-0 -z-10 rounded-full bg-cyan-300/50 animate-pulse-ring" aria-hidden="true" />
          <MessageCircle className="h-5 w-5" /><span className="hidden sm:inline">Automate my work</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
