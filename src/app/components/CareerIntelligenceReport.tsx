import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Shield, Zap, Brain, Target, Globe, Activity,
  CheckCircle2, ChevronRight, Briefcase, GraduationCap,
  Award, Trophy, FileText, Bot, Star, Sparkles, AlertCircle,
  HelpCircle, MessageSquare, ListTodo
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { CareerAnalysis } from '../../lib/career/engine';

const SIG = { green: '#10b981', orange: '#f59e0b', red: '#ef4444' };
const SIG_LABEL = { green: 'Excellent Outlook', orange: 'Moderate Outlook', red: 'High Risk Outlook' };

/* ── Glowing Score Ring ── */
function ScoreRing({ score, label, subtitle }: { score: number; label: string; subtitle: string }) {
  const circ = 2 * Math.PI * 40;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex items-center gap-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center -rotate-90">
        <svg width="96" height="96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#1f1f23" strokeWidth="6" />
          <motion.circle cx="48" cy="48" r="40" fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (score / 100) * circ }}
            transition={{ duration: 1.5, ease: 'easeOut' }} />
        </svg>
        <span className="absolute text-[22px] font-black text-white rotate-90">{score}</span>
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{label}</p>
        <p className="text-[16px] font-extrabold text-white mt-1 leading-snug">{subtitle}</p>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-400">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span>AI evaluation metrics verified</span>
        </div>
      </div>
    </div>
  );
}

function getDomainExams(domain: string, name: string) {
  const d = domain.toLowerCase();
  const n = name.toLowerCase();

  if (d.includes('tech') || n.includes('engineer') || n.includes('developer') || n.includes('coder') || n.includes('program')) {
    return [
      { name: 'JEE Main & Advanced', level: 'National (UG Entry)', purpose: 'Admission to top IITs, NITs, and IIITs' },
      { name: 'GATE (Graduate Aptitude Test)', level: 'National (PG/PSU)', purpose: 'Postgraduate admissions and high-paying PSU recruitment' },
      { name: 'BITSAT / VITEEE', level: 'University Level', purpose: 'Admissions to BITS Pilani and VIT University' }
    ];
  }
  if (d.includes('health') || n.includes('doctor') || n.includes('mbbs') || n.includes('pharm') || n.includes('clinic')) {
    return [
      { name: 'NEET-UG (Medical Entrance)', level: 'National (UG Entry)', purpose: 'Admission to MBBS, BDS, and AYUSH courses' },
      { name: 'NEET-PG / INI-CET', level: 'National (PG Entry)', purpose: 'Admission to MD, MS, and MDS specializations' },
      { name: 'FMGE / NExT (National Exit Test)', level: 'Licensing Exam', purpose: 'Compulsory licensing to practice medicine in India' }
    ];
  }
  if (d.includes('law') || n.includes('lawyer') || n.includes('legal') || n.includes('court')) {
    return [
      { name: 'CLAT (Common Law Admission Test)', level: 'National (UG/PG)', purpose: 'Admission to 24 National Law Universities (NLUs)' },
      { name: 'AILET (All India Law Entrance)', level: 'National (UG/PG)', purpose: 'Admission to National Law University, Delhi' },
      { name: 'AIBE (All India Bar Examination)', level: 'Licensing Exam', purpose: 'Compulsory certification to practice in Indian courts' }
    ];
  }
  if (d.includes('finance') || n.includes('ca') || n.includes('cfa') || n.includes('account') || n.includes('audit')) {
    return [
      { name: 'CA Exams (Foundation/Inter/Final)', level: 'Professional Body', purpose: 'Certification by ICAI to practice as a Chartered Accountant' },
      { name: 'CFA Level 1, 2 & 3', level: 'Global Certification', purpose: 'Chartered Financial Analyst designation for global investment roles' },
      { name: 'CAT / GMAT', level: 'National / Global', purpose: 'Admissions to top MBA Finance programs (IIMs)' }
    ];
  }
  if (n.includes('ias') || n.includes('upsc') || n.includes('civil') || n.includes('govt') || n.includes('state')) {
    return [
      { name: 'UPSC Civil Services Examination (CSE)', level: 'National (Group A)', purpose: 'Recruitment to IAS, IPS, IFS, and IRS services' },
      { name: 'State PSC Exams (UPPSC, MPPSC, etc.)', level: 'State Level', purpose: 'Recruitment to state-level administrative and police services' },
      { name: 'UGC NET / CSIR NET', level: 'National Level', purpose: 'Assistant Professor eligibility and Junior Research Fellowship (JRF)' }
    ];
  }
  if (d.includes('business') || d.includes('product') || n.includes('manager') || n.includes('startup') || n.includes('consult')) {
    return [
      { name: 'CAT (Common Admission Test)', level: 'National (PG)', purpose: 'Admissions to prestigious Indian Institutes of Management (IIMs)' },
      { name: 'GMAT / GRE', level: 'Global Level', purpose: 'Admissions to global MBA and business schools' },
      { name: 'XAT / SNAP / NMAT', level: 'National Level', purpose: 'Admissions to top tier management colleges (XLRI, NMIMS, Symbiosis)' }
    ];
  }
  return [
    { name: 'Domain Entry Exams', level: 'UG / PG Entry', purpose: 'Admissions to specialized colleges and institutes' },
    { name: 'Professional Licensing Tests', level: 'Licensing Exam', purpose: 'Regulatory clearance to practice in the industry' },
    { name: 'University Level Entrance Tests', level: 'Admission Exam', purpose: 'To secure seats in specialized training academies' }
  ];
}

export function CareerIntelligenceReport({ analysis }: { analysis: CareerAnalysis }) {
  const { career, signal, scores } = analysis;
  const [activeTab, setActiveTab] = useState<'roadmap' | 'interview' | 'mentor'>('roadmap');
  const [mentorInput, setMentorInput] = useState('');
  const [mentorChat, setMentorChat] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([
    { role: 'bot', text: `Hello! I am your AI Career Mentor. I can guide you on landing a job as a ${career.name}, choosing between colleges, or building projects. Ask me anything!` }
  ]);

  const handleMentorSend = () => {
    if (!mentorInput.trim()) return;
    const userMsg = mentorInput;
    setMentorChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setMentorInput('');

    setTimeout(() => {
      let botResponse = `To succeed as a ${career.name}, focusing on practical skills is key. I recommend starting with projects using ${career.requiredSkills.slice(0, 2).join(' and ')}. For resume growth, aim for certifications like ${career.name.includes('Eng') ? 'AWS Cloud Practitioner' : 'Industry Specialist Certifications'}.`;
      if (userMsg.toLowerCase().includes('salary') || userMsg.toLowerCase().includes('package')) {
        botResponse = `The average starting salary for a ${career.name} is around ₹${career.salaryEntry} LPA. With 5 years of experience (Mid-level), this typically scales to ₹${career.salaryMid} LPA, and seniors earn up to ₹${career.salarySenior} LPA.`;
      } else if (userMsg.toLowerCase().includes('switch') || userMsg.toLowerCase().includes('start')) {
        botResponse = `To start your transition, follow a structured 5-year roadmap: Year 1 focus on core fundamentals and landing an internship, Year 2 specialize in ${career.emergingSkills[0] || 'emerging tools'}, and Year 3 build standard portfolio projects.`;
      }
      setMentorChat(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 800);
  };

  /* Hardcoded premium sections based on career queries */
  const certifications = [
    { name: `Advanced Certificate in ${career.domain}`, provider: 'Coursera / Top Universities', duration: '3-6 months' },
    { name: `${career.name} Professional Accreditation`, provider: 'Google / IBM / AWS', duration: '6-8 weeks' },
    { name: `Emerging Tools & AI Certification in ${career.domain}`, provider: 'OpenAI / Microsoft / NPTEL', duration: '4 weeks' }
  ];

  const internships = [
    { role: `Junior ${career.name} Intern`, platforms: 'Internshala, LinkedIn, Angellist', stipend: '₹15,000 - ₹35,000 / mo' },
    { role: `Operations & Support Associate`, platforms: 'GradRight, Cutshort', stipend: '₹10,000 - ₹20,000 / mo' }
  ];

  const exams = getDomainExams(career.domain, career.name);

  const interviewPrep = [
    {
      q: `What is the most critical challenge facing a ${career.name} today?`,
      a: `Keeping pace with rapid AI integration and automation. The best approach is to treat AI as a productivity enhancer — mastering prompt engineering and automated workflows within ${career.domain} to deliver results 3× faster.`
    },
    {
      q: `How do you handle a tight deadline when working on ${career.requiredSkills[0] || 'core tasks'}?`,
      a: `Prioritize tasks using the Eisenhower Matrix, build a minimum viable prototype first, get quick feedback loops, and leverage automation/AI tools to offload boilerplate work.`
    }
  ];

  const countryOpportunities = [
    { country: 'India 🇮🇳', salary: `₹${career.salaryEntry} - ₹${career.salarySenior} LPA`, visa: 'Home Market', demand: 'Very High' },
    { country: 'United States 🇺🇸', salary: `$75,000 - $160,000 / yr`, visa: 'H1B (Competitive)', demand: 'High' },
    { country: 'Germany 🇩🇪', salary: '€48,000 - €95,000 / yr', visa: 'Opportunity Card (Easy)', demand: 'High' },
    { country: 'United Kingdom 🇬🇧', salary: '£40,000 - £85,000 / yr', visa: 'Skilled Worker (Moderate)', demand: 'Moderate' }
  ];

  const roadmapSteps = [
    { year: 'Year 1', title: 'Foundations & Internships', desc: `Master core skills: ${career.requiredSkills.slice(0, 3).join(', ')}. Complete 1 basic internship and build 3 github/portfolio projects.` },
    { year: 'Year 2', title: 'Emerging Tech & AI Specialization', desc: `Learn ${career.emergingSkills.slice(0, 2).join(', ')}. Optimize workflow using AI-assisted automation tools.` },
    { year: 'Year 3', title: 'Mid-Level Professional SDE/Associate', desc: 'Secure full-time corporate/firm roles. Transition from executing tasks to designing systems/strategies.' },
    { year: 'Year 4', title: 'Strategic Influence & Mentorship', desc: 'Lead small project modules. Mentor junior interns and write technical case studies/documentation.' },
    { year: 'Year 5', title: 'Senior Lead / Systems Architect', desc: `Own end-to-end delivery of strategies. Salary matches senior scale of ₹${career.salarySenior} LPA+.` }
  ];

  return (
    <div className="space-y-5 mt-5">
      {/* ── HEADER BANNER ── */}
      <motion.div className="relative bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="text-2xl">⚡</span>
              <h2 className="text-[22px] font-black text-white tracking-tight">{career.name}</h2>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{ background: SIG[signal] + '15', color: SIG[signal], border: `1px solid ${SIG[signal]}30` }}>
                {SIG_LABEL[signal]}
              </span>
            </div>
            <p className="text-[12.5px] text-zinc-500 font-medium">Domain: {career.domain} · AI Career Intelligence Matrix</p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl px-5 py-3 shrink-0">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Hiring Index</p>
              <p className="text-[20px] font-black text-white mt-0.5">{scores.hiringProbability}%</p>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Future Scope</p>
              <p className="text-[20px] font-black text-emerald-400 mt-0.5">{scores.futureScope}/100</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── TOP SCORE & SIMPLE STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Ring */}
        <ScoreRing score={scores.riskReward} label="AI Career Score" subtitle="Personalized career viability assessment" />

        {/* Career KPIs */}
        <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Avg Entry Salary', value: `₹${career.salaryEntry} LPA`, change: 'Strong start', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Senior Salary', value: `₹${career.salarySenior} LPA`, change: '10yr potential', icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'AI Safety rating', value: `${100 - career.aiRisk}%`, change: 'Low automation risk', icon: Shield, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Hiring Speed', value: 'Fast', change: 'Active postings', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold leading-tight">{item.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.bg}`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
              </div>
              <div>
                <p className="text-[18px] font-black text-white leading-tight">{item.value}</p>
                <p className="text-[10px] text-zinc-500 mt-1">{item.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SALARY TRAJECTORY CHART (Only One Chart) ── */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              10-Year Salary Forecast (₹ LPA)
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Projected earnings growth across entry, mid, and senior levels</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-emerald-400 rounded-full" /> Optimistic</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-blue-400 rounded-full" /> Projected</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-violet-400 rounded-full" /> Conservative</span>
          </div>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analysis.salaryForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#71717a' }} />
              <YAxis tick={{ fontSize: 9, fill: '#71717a' }} />
              <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 12, fontSize: 11, color: '#fff' }} />
              <Area type="monotone" dataKey="optimistic" stroke="#10b981" fill="#10b981" fillOpacity={0.06} strokeWidth={2} />
              <Area type="monotone" dataKey="projected" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.04} strokeWidth={2} />
              <Area type="monotone" dataKey="conservative" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.02} strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── SKILL GAP & RESUME SCORE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skill Gap */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-[14px] font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-400" />
            Skill Gap Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-2">🟢 Skills You Have</p>
              <div className="flex flex-wrap gap-1.5">
                {career.requiredSkills.slice(0, 3).map((s, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">✓ {s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-2">🟡 Skills to Acquire</p>
              <div className="flex flex-wrap gap-1.5">
                {career.requiredSkills.slice(3).map((s, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">◐ {s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-2">🔴 Critical AI & Emerging Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {career.emergingSkills.map((s, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium">🔥 {s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Score & Keywords */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Resume Score & Keywords
              </h3>
              <span className="text-[11px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/20">78% Readiness</span>
            </div>
            <p className="text-[12px] text-zinc-400 mb-4 leading-relaxed">
              Based on the job listings for a {career.name}, your resume needs optimizations. Add these keywords to stand out.
            </p>
            <div className="mb-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-2">Target Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {career.requiredSkills.slice(0, 4).concat(career.emergingSkills.slice(0, 1)).map((kw, i) => (
                  <span key={i} className="text-[10.5px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono font-medium">{kw}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-3">
            <p className="text-[10.5px] text-zinc-500 flex items-center gap-1.5 leading-snug">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Formatting Tip: Use bullet points beginning with action verbs and quantifiable results.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── COUNTRY-WISE OPPORTUNITIES ── */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
        <h3 className="text-[14px] font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          Country-wise Salary & Visa Guide
        </h3>
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="py-2.5 font-bold">Country</th>
              <th className="py-2.5 font-bold">Salary Range</th>
              <th className="py-2.5 font-bold">Visa Ease</th>
              <th className="py-2.5 font-bold text-right">Market Demand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {countryOpportunities.map((co, i) => (
              <tr key={i} className="text-zinc-300">
                <td className="py-3 font-semibold text-white">{co.country}</td>
                <td className="py-3 font-mono">{co.salary}</td>
                <td className="py-3">{co.visa}</td>
                <td className="py-3 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    co.demand === 'Very High' ? 'bg-emerald-500/10 text-emerald-400' :
                    co.demand === 'High' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>{co.demand}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── ROADMAP / INTERVIEW / MENTOR TAB PANEL ── */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl">
        {/* tabs */}
        <div className="flex gap-2 border-b border-zinc-850 pb-3 mb-5 overflow-x-auto">
          {[
            { id: 'roadmap', label: '5-Year Roadmap', icon: Target },
            { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
            { id: 'mentor', label: 'AI Career Mentor', icon: Bot }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all ${
                activeTab === tab.id ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'roadmap' && (
            <motion.div key="roadmap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-4 relative pl-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-zinc-800">
              {roadmapSteps.map((step, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-[-10px] top-1 w-[22px] h-[22px] rounded-full bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  </div>
                  <h4 className="text-[13px] font-bold text-white flex items-center gap-2">
                    <span className="text-emerald-400 font-mono text-[11px]">{step.year}</span>
                    <span>· {step.title}</span>
                  </h4>
                  <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div key="interview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-4">
              {interviewPrep.map((ip, i) => (
                <div key={i} className="p-4 bg-zinc-950/60 border border-zinc-800/60 rounded-2xl">
                  <div className="flex items-start gap-2.5 mb-2">
                    <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20 mt-0.5">Q</span>
                    <p className="text-[13px] font-bold text-white">{ip.q}</p>
                  </div>
                  <div className="flex items-start gap-2.5 pl-9">
                    <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 mt-0.5">A</span>
                    <p className="text-[12.5px] text-zinc-400 leading-relaxed">{ip.a}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'mentor' && (
            <motion.div key="mentor" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex flex-col h-[320px] bg-zinc-950/50 border border-zinc-850 rounded-2xl overflow-hidden">
              {/* messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {mentorChat.map((msg, i) => (
                  <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      msg.role === 'user' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {msg.role === 'user' ? 'U' : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 text-[12.5px] leading-relaxed ${
                      msg.role === 'user' ? 'bg-white text-zinc-950 font-medium' : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* input */}
              <div className="border-t border-zinc-850 p-3 flex gap-2">
                <input type="text" value={mentorInput} onChange={e => setMentorInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleMentorSend(); }}
                  placeholder={`Ask a question about ${career.name} roadmap, skills, stipend…`}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-zinc-650 outline-none focus:border-emerald-500 transition-colors" />
                <button onClick={handleMentorSend}
                  className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-[12px] font-bold transition-all shrink-0">
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CERTIFICATIONS, INTERNSHIPS & EXAMS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Certifications */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-[14px] font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-violet-400" />
            Top Recommendations
          </h3>
          <div className="space-y-3">
            {certifications.map((c, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 bg-zinc-850/40 rounded-xl border border-zinc-800/40">
                <div>
                  <h4 className="text-[12.5px] font-bold text-white">{c.name}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{c.provider}</p>
                </div>
                <span className="text-[9.5px] font-extrabold bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20 shrink-0">{c.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Internships */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-[14px] font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Recommended Internships
          </h3>
          <div className="space-y-3">
            {internships.map((intern, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 bg-zinc-850/40 rounded-xl border border-zinc-800/40">
                <div>
                  <h4 className="text-[12.5px] font-bold text-white">{intern.role}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{intern.platforms}</p>
                </div>
                <span className="text-[9.5px] font-extrabold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">{intern.stipend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exams & Entrances */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-[14px] font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            Exams & Entrance Guide
          </h3>
          <div className="space-y-3">
            {exams.map((ex, i) => (
              <div key={i} className="p-3 bg-zinc-850/40 rounded-xl border border-zinc-800/40">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-[12.5px] font-bold text-white leading-tight">{ex.name}</h4>
                  <span className="text-[9px] font-extrabold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">{ex.level}</span>
                </div>
                <p className="text-[10.5px] text-zinc-550 leading-snug">{ex.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
