import ScrollProgress from './components/ScrollProgress.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import SkillsMarquee from './components/SkillsMarquee.jsx';
import Services from './components/Services.jsx';
import Projects from './components/Projects.jsx';
import Process from './components/Process.jsx';
import Experience from './components/Experience.jsx';
import ChatAssistant from './components/ChatAssistant.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import FloatingChat from './components/FloatingChat.jsx';

export default function App() {
  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink-950">Skip to content</a>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <SkillsMarquee />
        <Services />
        <Projects />
        <Process />
        <Experience />
        <ChatAssistant />
        <Contact />
      </main>
      <Footer />
      <FloatingChat />
    </>
  );
}
