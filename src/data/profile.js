// Single source of truth for portfolio content — edit this file to update the site.

export const profile = {
  name: 'Tathagata Mallik',
  shortName: 'Tathagata',
  role: 'LLM & Agentic AI Engineer',
  company: 'Senior Associate Consultant @ Infosys',
  location: 'Kolkata, India',
  email: 'malliktathagata@gmail.com',
  photo: { webp: '/profile.webp', jpg: '/profile.jpg', alt: 'Portrait of Tathagata Mallik', width: 640, height: 640 },
  tagline: 'I build AI that does the boring work — so you can do the work that matters.',
  rotatingLines: [
    'I can automate your tasks with AI.',
    'I build RAG assistants that know your business.',
    'I design multi-agent systems that work while you sleep.',
    'I fine-tune LLMs for your exact problem.',
  ],
  intro:
    'LLM engineer with 4+ years of building production systems — from Jenkins CI/CD for Dell PowerEdge firmware to RAG assistants, CrewAI agent teams and QLoRA fine-tuned models. Now at Infosys, I help teams turn repetitive work into reliable AI workflows.',
  links: {
    linkedin: 'https://www.linkedin.com/in/tathagata-mallik-081591233/',
    huggingface: 'https://huggingface.co/Tatha1999',
    email: 'mailto:malliktathagata@gmail.com',
  },
  stats: [
    { value: 4, suffix: '+', label: 'Years building production systems' },
    { value: 86, suffix: '%', label: 'Accuracy from my LLM + ML ensemble' },
    { value: 6, suffix: '', label: 'Agents in my Food Health Scanner' },
    { value: 3, suffix: '', label: 'Dell server generations shipped (15G–17G)' },
  ],
};

export const services = [
  { id: 'svc-support', icon: 'MessageSquareText', title: 'AI Customer Support',
    text: 'A 24/7 assistant that answers your customers from your own FAQs, catalogue and policies — on WhatsApp, web or email.' },
  { id: 'svc-docs', icon: 'FileScan', title: 'Document & Data Automation',
    text: 'Invoices, forms and PDFs read by AI and pushed straight into Excel, Sheets or your CRM. No more copy-paste.' },
  { id: 'svc-agents', icon: 'Bot', title: 'Multi-Agent Workflows',
    text: 'Teams of specialised AI agents (CrewAI / OpenAI Agents) that research, write, check and act — end to end.' },
  { id: 'svc-rag', icon: 'BrainCircuit', title: 'Private Knowledge Assistants',
    text: 'RAG over your SOPs, Confluence and Drive. Your team asks, the AI answers — with sources.' },
  { id: 'svc-predict', icon: 'TrendingUp', title: 'Prediction & Forecasting',
    text: 'Hybrid ML + fine-tuned LLM models for pricing, demand and scoring — built for your data.' },
  { id: 'svc-devops', icon: 'Workflow', title: 'AI for DevOps',
    text: 'Log-triage agents that read CI/CD failures, find the root cause and suggest the fix.' },
];

export const projects = [
  {
    id: 'food-health-scanner',
    title: 'Food Health Scanner',
    kicker: 'Live on Hugging Face',
    summary:
      'Snap a photo of any food or type a product name — six cooperating agents (vision, search, nutrition, verification, benefits, pros/cons) find nutrition evidence, verify it, and return gauges, a 1–5 star rating and a downloadable PDF/HTML report.',
    highlights: [
      'Self-verifying agent loop that retries with refined queries when evidence is weak',
      'ChromaDB vector memory (MiniLM embeddings) reuses past analyses — RAG on its own history',
      'Gradio UI + private Node.js API, shipped as a Docker Space',
    ],
    tags: ['Multi-Agent', 'RAG', 'ChromaDB', 'OpenAI', 'Serper', 'Gradio', 'Docker'],
    links: [
      { label: 'Try it live', href: 'https://huggingface.co/spaces/Tatha1999/health_benefit_app' },
      { label: 'Source', href: 'https://huggingface.co/spaces/Tatha1999/health_benefit_app/tree/main' },
    ],
    accent: 'from-lime-400 via-emerald-400 to-cyan-400',
    featured: true,
  },
  {
    id: 'dell-rag-assistant',
    title: 'GenAI DevOps Assistant for Dell',
    kicker: 'Enterprise · Accenture × Dell',
    summary:
      'An internal developer assistant for Dell\'s iDRAC firmware release team: RAG over Confluence docs and Jenkins pipeline logs, plus CrewAI agents that analyse build failures and point engineers to the root cause.',
    highlights: [
      'RAG over Confluence + Jenkins logs for instant CI/CD failure debugging',
      'CrewAI agents for root-cause detection; OpenAI SDK automation for Build Verification Testing',
      'Built on top of Jenkins pipelines serving Dell 15G, 16G and 17G servers, monitored with Prometheus & Grafana',
    ],
    tags: ['RAG', 'CrewAI', 'OpenAI SDK', 'Jenkins', 'Prometheus', 'Grafana'],
    links: [],
    accent: 'from-cyan-400 via-sky-400 to-indigo-400',
  },
  {
    id: 'price-predictor',
    title: 'Hybrid LLM + ML Price Predictor',
    kicker: '86% ensemble accuracy',
    summary:
      'Predicts Amazon product prices from metadata and descriptions by blending a QLoRA-fine-tuned LLaMA 3.2 1B, a fine-tuned OpenAI model, Random Forest and XGBoost — stacked with a linear-regression meta-model.',
    highlights: [
      'QLoRA fine-tune of LLaMA 3.2 1B hit 85% on its own',
      'Weighted ensemble (70/15/10/5) lifted accuracy to 86%',
      'Gradio UI with Pushover mobile alerts',
    ],
    tags: ['QLoRA', 'LLaMA 3.2', 'XGBoost', 'HuggingFace', 'Gradio'],
    links: [],
    accent: 'from-violet-400 via-fuchsia-400 to-pink-400',
  },
  {
    id: 'crewai-team',
    title: 'AI Engineering Team (CrewAI)',
    kicker: 'Agents that ship code',
    summary:
      'A simulated software team of four role-based agents — Project Manager, Backend Engineer, QA Tester and Frontend Developer — that turns a plain-English requirement into a tested Python app with a Gradio UI.',
    highlights: [
      'PM agent breaks down requirements and writes the prompts for the rest of the crew',
      'QA agent tests module-by-module and feeds issues back for another pass',
      'Fully automated: requirement → code → tests → UI',
    ],
    tags: ['CrewAI', 'Agentic AI', 'Python', 'Gradio'],
    links: [],
    accent: 'from-amber-300 via-orange-400 to-pink-500',
  },
];

export const experience = [
  {
    company: 'Infosys',
    role: 'Senior Associate Consultant — LLM Engineer',
    start: 'Oct 2026',
    end: 'Present',
    location: 'Kolkata · Hybrid',
    points: ['Building LLM solutions with a focus on prompt engineering and predictive modeling.'],
  },
  {
    company: 'Accenture',
    role: 'LLM Development Analyst · Application Development Associate',
    start: 'Oct 2022',
    end: 'Oct 2026',
    location: 'Bengaluru · Dell Technologies (SSRE)',
    points: [
      'Designed and deployed a GenAI developer assistant (RAG over Confluence + Jenkins logs) for faster CI/CD debugging.',
      'Implemented CrewAI agents for build-failure root-cause analysis; automated BVT with the OpenAI SDK.',
      'Contributed AI capabilities to Dell\'s internal AiGlobal framework using LLMs and Windsurf.',
      'Managed Jenkins CI/CD for iDRAC firmware across Dell 15G/16G/17G; Prometheus + Grafana monitoring.',
    ],
  },
];

export const skills = [
  'Python', 'LLMs', 'RAG', 'Agentic AI', 'CrewAI', 'OpenAI SDK', 'LangChain', 'LangGraph', 'LangSmith',
  'HuggingFace', 'QLoRA', 'LLaMA', 'Prompt Engineering', 'ChromaDB', 'Gradio', 'Scikit-learn', 'XGBoost',
  'Pandas', 'NumPy', 'SQL', 'Jenkins', 'CI/CD', 'Docker', 'Prometheus', 'Grafana', 'Git', 'Shell',
];

export const certifications = [
  { title: 'AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents', issuer: 'Udemy', date: 'Feb 2026',
    url: 'https://www.udemy.com/certificate/UC-794863a4-20ba-4cb1-9bd3-af57417e1435/' },
  { title: 'AI Engineer Agentic Track: The Complete Agentic Course', issuer: 'Udemy', date: 'Mar 2026',
    url: 'https://www.udemy.com/certificate/UC-4816c8f8-49d3-4bd2-83d1-739cdf7d32d9/' },
];

export const education = {
  school: 'Guru Nanak Institute of Technology, Kolkata',
  degree: 'B.Tech, Computer Science & Engineering',
  year: '2018 – 2022',
  grade: 'CGPA 9.0',
};

export const processSteps = [
  { n: '01', title: 'Discover', text: 'A short chat about your business, your tools and where the hours go.' },
  { n: '02', title: 'Design', text: 'I map the workflow and pick the right mix — RAG, agents, fine-tuning or plain automation.' },
  { n: '03', title: 'Build', text: 'A working prototype in days, tested end-to-end on your real data.' },
  { n: '04', title: 'Automate', text: 'Deploy, monitor and improve — you get your time back every single week.' },
];
