import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, Brain, Sparkles, CheckCircle2,
  User, MapPin, Trophy, Search, RefreshCw,
  TrendingUp, Compass, Zap, Heart, Star,
  ChevronRight, Target, BookOpen,
} from 'lucide-react';
import type { Page } from '../App';

interface StudentJourneyProps { onNavigate: (page: Page) => void; }

/* ═══════════════════════════════════════════════════════════
   UI ATOMS
═══════════════════════════════════════════════════════════ */
const Pill = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <motion.button onClick={onClick} whileTap={{ scale: 0.95 }}
    className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-200 ${
      selected ? 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-500/25'
               : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'}`}>
    {label}
  </motion.button>
);

const MPill = ({ label, selected, onClick, c = 'violet' }: {
  label: string; selected: boolean; onClick: () => void; c?: string;
}) => {
  const map: Record<string, string> = {
    violet:  'bg-violet-500 border-violet-500 text-white shadow-violet-500/25',
    emerald: 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/25',
    blue:    'bg-blue-500 border-blue-500 text-white shadow-blue-500/25',
    amber:   'bg-amber-500 border-amber-500 text-white shadow-amber-500/25',
    pink:    'bg-pink-500 border-pink-500 text-white shadow-pink-500/25',
    rose:    'bg-rose-500 border-rose-500 text-white shadow-rose-500/25',
    cyan:    'bg-cyan-500 border-cyan-500 text-white shadow-cyan-500/25',
    indigo:  'bg-indigo-500 border-indigo-500 text-white shadow-indigo-500/25',
  };
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-200 ${
        selected ? `${map[c] ?? map.violet} shadow-lg`
                 : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'}`}>
      {label}
    </motion.button>
  );
};

const BigCard = ({ icon, label, sub, selected, onClick, accent = 'violet' }: {
  icon: string; label: string; sub: string; selected: boolean; onClick: () => void; accent?: string;
}) => {
  const styles: Record<string, string> = {
    violet:  'bg-violet-500/15 border-violet-500/50',
    amber:   'bg-amber-500/15 border-amber-500/50',
    emerald: 'bg-emerald-500/15 border-emerald-500/50',
    blue:    'bg-blue-500/15 border-blue-500/50',
    rose:    'bg-rose-500/15 border-rose-500/50',
    cyan:    'bg-cyan-500/15 border-cyan-500/50',
  };
  return (
    <button onClick={onClick}
      className={`text-left p-4 rounded-2xl border transition-all ${
        selected ? styles[accent] ?? styles.violet : 'bg-zinc-900 border-zinc-700/50 hover:border-zinc-600'}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-[13px] font-semibold text-white">{label}</div>
      <div className="text-[11px] text-zinc-500 mt-1">{sub}</div>
    </button>
  );
};

const Textarea = ({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-[14px] text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed" />
);

const QLabel = ({ n, text, sub }: { n: number; text: string; sub?: string }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-1">
      <span className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 text-[11px] font-bold text-violet-400 flex items-center justify-center shrink-0">{n}</span>
      <p className="text-[15px] font-bold text-white leading-snug">{text}</p>
    </div>
    {sub && <p className="text-[12px] text-zinc-500 ml-8 leading-relaxed">{sub}</p>}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PERSONALITY MAPPING ENGINE  (12 profiles — matches document)
═══════════════════════════════════════════════════════════ */
interface PersonalityProfile {
  id: string; name: string; icon: string;
  color: string; bgColor: string; borderColor: string;
  traits: string[]; courses: string[]; careers: string[];
  whyText: (name: string, q1: string[], q4: string[], q12: string) => string;
}

const PERSONALITY_MAP: PersonalityProfile[] = [
  {
    id: 'creative', name: 'Creative & Visual', icon: '🎨',
    color: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/25',
    traits: ['Creative intelligence', 'Visual thinking', 'Aesthetic sensibility', 'Imaginative expression'],
    courses: ['B.Des', 'UI/UX Design', 'Graphic Design', 'Animation', 'Fashion Design', 'Product Design', 'Interior Design', 'Visual Communication'],
    careers: ['UI/UX Designer', 'Product Designer', 'Brand Strategist', 'Creative Director', 'Fashion Entrepreneur', 'Content Creator', 'Video Editor', 'Digital Artist'],
    whyText: (n, q1, q4) => `${n ? n+"'s" : 'Your'} consistent drive toward ${q1.includes('Designing or creating things') ? 'designing and creating' : 'visual expression'} and ${q4.includes('Creating/designing') ? 'creative work' : 'aesthetic thinking'} is the unmistakable fingerprint of a Creative & Visual personality. People with this profile think in images, lead with intuition, and turn ideas into beautiful, meaningful experiences.`,
  },
  {
    id: 'tech', name: 'Logical & Technical', icon: '⚡',
    color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/25',
    traits: ['Analytical thinking', 'Technical intelligence', 'Systems mindset', 'Logical reasoning'],
    courses: ['BTech CSE', 'Artificial Intelligence', 'Data Science', 'Cybersecurity', 'Software Engineering', 'Information Technology', 'Robotics', 'Cloud Computing'],
    careers: ['Software Engineer', 'AI Engineer', 'Data Analyst', 'Cybersecurity Expert', 'App Developer', 'Machine Learning Engineer', 'Tech Consultant'],
    whyText: (n, q1, q4) => `${n ? n+"'s" : 'Your'} pull toward ${q1.includes('Solving logical problems') ? 'solving logical problems' : 'analytical challenges'} and ${q4.includes('Coding/building') ? 'coding and building' : 'technical problem-solving'} reveals a deeply Logical & Technical mind. You see systems where others see chaos — and that ability to engineer solutions is the foundation of every great tech career.`,
  },
  {
    id: 'leadership', name: 'Leadership & Business', icon: '🚀',
    color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/25',
    traits: ['Leadership potential', 'Entrepreneurial mindset', 'Strategic thinking', 'Independent decision-making'],
    courses: ['BBA', 'MBA', 'Entrepreneurship', 'Business Analytics', 'Marketing', 'Finance', 'International Business'],
    careers: ['Entrepreneur', 'Startup Founder', 'Business Consultant', 'Marketing Strategist', 'Product Manager', 'Sales Leader', 'Brand Manager'],
    whyText: (n, q1, q4) => `${n ? n+"'s" : 'Your'} natural tendency to ${q1.includes('Leading or organizing') ? 'lead and organise' : 'take charge'} and ${q4.includes('Business/startups') ? 'build businesses' : 'create impact'} places you firmly in the Leadership & Business category. Founders and CEOs share one trait above all: the belief that they can build something that matters. That belief shows in your answers.`,
  },
  {
    id: 'communication', name: 'Communication & Media', icon: '🎙️',
    color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/25',
    traits: ['Communication strength', 'Social presence', 'Influence & persuasion', 'Networking ability'],
    courses: ['Mass Communication', 'Journalism', 'Public Relations', 'Digital Marketing', 'Media Studies', 'Advertising'],
    careers: ['Public Speaker', 'News Anchor', 'Content Strategist', 'Social Media Manager', 'Influencer', 'PR Specialist', 'Marketing Executive'],
    whyText: (n, q1, q4) => `${n ? n+"'s" : 'Your'} love of ${q1.includes('Making content/videos') ? 'making content and videos' : 'expressing and communicating'} combined with ${q4.includes('Media/content creation') ? 'your pull toward media' : 'public-facing work'} defines a Communication & Media personality. You were built to inform, entertain, and influence — the world needs voices like yours.`,
  },
  {
    id: 'empathy', name: 'Empathetic & People-Oriented', icon: '💚',
    color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/25',
    traits: ['Emotional intelligence', 'Caring & empathetic', 'Patient listener', 'People-support mindset'],
    courses: ['Psychology', 'Counseling', 'Social Work', 'Nursing', 'Healthcare Management', 'Human Development'],
    careers: ['Psychologist', 'Counselor', 'Therapist', 'HR Professional', 'Social Worker', 'Healthcare Advisor'],
    whyText: (n, q1, _q4, q12) => `${n ? n+"'s" : 'Your'} ${q1.includes('Helping people') ? 'natural urge to help others' : 'empathetic core'} and ${q12 === 'Emotional and empathetic' ? 'self-identified empathetic nature' : 'people-first outlook'} reveal a deeply Empathetic & People-Oriented personality. The world's greatest healers, counselors, and HR leaders are defined by exactly this depth of emotional intelligence.`,
  },
  {
    id: 'research', name: 'Research & Discovery', icon: '🔬',
    color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/25',
    traits: ['Deep curiosity', 'Scientific thinking', 'Observation & analysis', 'Knowledge-driven personality'],
    courses: ['Pure Sciences', 'Biotechnology', 'Physics', 'Chemistry', 'Mathematics', 'Research Programs', 'Statistics'],
    careers: ['Scientist', 'Research Analyst', 'Professor', 'Lab Researcher', 'Data Research Specialist'],
    whyText: (n, q1, q4) => `${n ? n+"'s" : 'Your'} ${q1.includes('Researching and learning') ? 'addiction to researching and learning' : 'deep intellectual curiosity'} and ${q4.includes('Research/discovery') ? 'excitement about discovery' : 'love of understanding things deeply'} are the hallmarks of a Research & Discovery personality. The greatest breakthroughs in history came from people who simply could not stop asking "why?"`,
  },
  {
    id: 'management', name: 'Management & Organization', icon: '📋',
    color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/25',
    traits: ['Planning & coordination', 'Event organization', 'Responsibility-taking', 'Team management'],
    courses: ['Management Studies', 'Event Management', 'Hospitality', 'Operations Management', 'Project Management'],
    careers: ['Project Manager', 'Operations Manager', 'Event Manager', 'HR Manager', 'Team Coordinator'],
    whyText: (n, q1) => `${n ? n+"'s" : 'Your'} ${q1.includes('Leading or organizing') ? 'drive to organise and lead' : 'structured, execution-first thinking'} is the signature of a Management & Organization personality. Every great organisation runs because of someone with exactly your ability to bring order, direction, and accountability to complex, moving parts.`,
  },
  {
    id: 'creative_tech', name: 'Creative Technology', icon: '🤖',
    color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/25',
    traits: ['Design + coding fusion', 'Innovation mindset', 'Startup curiosity', 'AI & creativity blend'],
    courses: ['UI/UX + Tech', 'Human Computer Interaction', 'Creative Computing', 'Product Design', 'AI & Design'],
    careers: ['Product Designer', 'Creative Technologist', 'AI Product Builder', 'Frontend Developer', 'Interactive Experience Designer'],
    whyText: (n, q1, q4) => `${n ? n+"'s" : 'Your'} rare fusion of ${q1.includes('Designing or creating things') ? 'creative design' : 'aesthetic sensibility'} and ${q1.includes('Building technical projects') ? 'technical building' : 'technology curiosity'} identifies the rarest personality in the digital age — the Creative Technologist. People who can bridge art and engineering don't just get jobs. They define entirely new categories.`,
  },
  {
    id: 'medical', name: 'Medical & Biology-Oriented', icon: '🩺',
    color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/25',
    traits: ['Healthcare interest', 'Biology fascination', 'Patient & disciplined', 'Service-oriented mindset'],
    courses: ['MBBS', 'BDS', 'B.Pharm', 'Biotechnology', 'Physiotherapy', 'Nursing'],
    careers: ['Doctor', 'Dentist', 'Pharmacist', 'Physiotherapist', 'Medical Researcher'],
    whyText: (n, q1, q4) => `${n ? n+"'s" : 'Your'} ${q4.includes('Healthcare/helping') ? 'draw toward healthcare and helping' : 'service-driven mindset'} and ${q1.includes('Helping people') ? 'deep desire to help people' : 'patient, disciplined nature'} point directly to a Medical & Biology personality. Healthcare rewards the exact combination of intellectual rigour, empathy, and commitment to human wellbeing that you naturally carry.`,
  },
  {
    id: 'law', name: 'Law, Justice & Debate', icon: '⚖️',
    color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/25',
    traits: ['Strong opinions', 'Critical reasoning', 'Justice-oriented mindset', 'Confidence in speaking'],
    courses: ['LLB', 'BA LLB', 'Corporate Law', 'Criminal Law', 'Political Science'],
    careers: ['Lawyer', 'Legal Advisor', 'Corporate Consultant', 'Public Policy Analyst'],
    whyText: (n, _q1, q4) => `${n ? n+"'s" : 'Your'} ${q4.includes('Public speaking') ? 'love of public speaking' : 'confident, argument-driven communication'} and justice-seeking mindset point directly to Law, Justice & Debate. Great lawyers are built on critical reasoning, the courage to argue when everyone else goes quiet, and a relentless pursuit of what is right — and that is exactly what your profile reveals.`,
  },
  {
    id: 'finance', name: 'Finance & Strategic Numbers', icon: '📊',
    color: 'text-lime-400', bgColor: 'bg-lime-500/10', borderColor: 'border-lime-500/25',
    traits: ['Financial curiosity', 'Strategic thinking', 'Numerical intelligence', 'Business-money mindset'],
    courses: ['B.Com', 'Finance', 'Economics', 'CA', 'CFA', 'Accounting'],
    careers: ['Financial Analyst', 'Investment Banker', 'Chartered Accountant', 'Auditor', 'Business Finance Consultant'],
    whyText: (n, q1) => `${n ? n+"'s" : 'Your'} ${q1.includes('Business or money-related work') ? 'instinct for business and money' : 'strategic, numbers-oriented thinking'} is the fingerprint of a Finance & Strategic Numbers personality. The ability to read money as a language and strategy as a game is rare — and it is the foundation of careers in banking, investment, and financial leadership.`,
  },
  {
    id: 'teaching', name: 'Teaching & Mentorship', icon: '📚',
    color: 'text-teal-400', bgColor: 'bg-teal-500/10', borderColor: 'border-teal-500/25',
    traits: ['Explaining concepts', 'Knowledge sharing', 'Patience & guidance', 'Mentorship mindset'],
    courses: ['Education', 'Subject Specialization', 'Psychology', 'Teaching Programs'],
    careers: ['Teacher', 'Professor', 'Academic Mentor', 'Career Coach', 'Trainer'],
    whyText: (n, q1, q4) => `${n ? n+"'s" : 'Your'} ${q4.includes('Problem-solving') ? 'problem-solving drive combined with a' : ''} natural instinct to share knowledge and guide others — and ${q1.includes('Helping people') ? 'your joy in helping people' : 'your patience-first approach'} — defines a Teaching & Mentorship personality. The world's most impactful people are often those who multiply their intelligence by investing it in others.`,
  },
];

/* ═══════════════════════════════════════════════════════════
   DEEP SCORING ENGINE  — uses all 15 questions
═══════════════════════════════════════════════════════════ */
function scorePersonalities(answers: {
  q1: string[];   // lose-track activities (multi)
  q4: string[];   // exciting work types (multi)
  q5: string[];   // people come to you for (multi)
  q6: string;     // what you notice
  q7: string;     // statement most like you
  q8: string;     // ideal environment
  q11: string;    // group role
  q12: string;    // self-description
  q13: string;    // career priority
}): Array<{ profile: PersonalityProfile; score: number; pct: number }> {
  const s: Record<string, number> = {};
  PERSONALITY_MAP.forEach(p => { s[p.id] = 0; });
  const add = (id: string, pts: number) => { if (s[id] !== undefined) s[id] += pts; };

  /* Q1 — lose track activities */
  if (answers.q1.includes('Designing or creating things'))    { add('creative',3); add('creative_tech',2); }
  if (answers.q1.includes('Solving logical problems'))        { add('tech',3); add('research',2); }
  if (answers.q1.includes('Leading or organizing'))           { add('leadership',3); add('management',2); }
  if (answers.q1.includes('Helping people'))                  { add('empathy',3); add('teaching',2); add('medical',1); }
  if (answers.q1.includes('Researching and learning'))        { add('research',3); add('tech',1); add('teaching',1); }
  if (answers.q1.includes('Making content/videos'))           { add('communication',3); add('creative',2); }
  if (answers.q1.includes('Building technical projects'))     { add('tech',3); add('creative_tech',3); }
  if (answers.q1.includes('Business or money-related work'))  { add('leadership',3); add('finance',3); }

  /* Q4 — exciting work types */
  if (answers.q4.includes('Creating/designing'))      { add('creative',3); add('creative_tech',1); }
  if (answers.q4.includes('Coding/building'))         { add('tech',3); add('creative_tech',2); }
  if (answers.q4.includes('Managing people'))         { add('management',3); add('leadership',2); }
  if (answers.q4.includes('Public speaking'))         { add('communication',3); add('law',2); }
  if (answers.q4.includes('Business/startups'))       { add('leadership',3); add('finance',1); }
  if (answers.q4.includes('Healthcare/helping'))      { add('medical',3); add('empathy',2); }
  if (answers.q4.includes('Research/discovery'))      { add('research',3); add('tech',1); }
  if (answers.q4.includes('Media/content creation'))  { add('communication',3); add('creative',2); }
  if (answers.q4.includes('Problem-solving'))         { add('tech',2); add('research',2); add('teaching',1); }

  /* Q5 — people seek you for */
  if (answers.q5.includes('Advice/support'))          { add('empathy',3); add('teaching',2); }
  if (answers.q5.includes('Creativity/design'))       { add('creative',3); add('creative_tech',1); }
  if (answers.q5.includes('Technical help'))          { add('tech',3); add('creative_tech',1); }
  if (answers.q5.includes('Leadership/organization')) { add('leadership',3); add('management',2); }
  if (answers.q5.includes('Studies/explanations'))    { add('teaching',3); add('research',1); }
  if (answers.q5.includes('Motivation'))              { add('communication',2); add('teaching',2); }
  if (answers.q5.includes('Business ideas'))          { add('leadership',2); add('finance',2); }
  if (answers.q5.includes('Communication'))           { add('communication',3); add('law',1); }

  /* Q6 — what you notice */
  if (answers.q6 === 'Visuals and aesthetics')        { add('creative',3); add('communication',1); }
  if (answers.q6 === 'Logic and systems')             { add('tech',3); add('research',2); add('finance',1); }
  if (answers.q6 === "People's emotions")             { add('empathy',3); add('teaching',1); }
  if (answers.q6 === 'Opportunities and ideas')       { add('leadership',3); add('creative_tech',1); }
  if (answers.q6 === 'Mistakes and improvements')     { add('tech',2); add('management',2); add('research',1); }
  if (answers.q6 === 'Trends and creativity')         { add('communication',2); add('creative',2); add('leadership',1); }

  /* Q7 — statement most like you */
  if (answers.q7 === 'I enjoy stability and security.')             { add('management',2); add('finance',1); add('medical',1); }
  if (answers.q7 === 'I enjoy freedom and creativity.')             { add('creative',3); add('communication',2); add('creative_tech',1); }
  if (answers.q7 === 'I enjoy challenges and competition.')         { add('leadership',3); add('finance',2); add('law',1); }
  if (answers.q7 === 'I enjoy helping and connecting with people.') { add('empathy',3); add('teaching',2); add('medical',1); }
  if (answers.q7 === 'I enjoy innovation and building new ideas.')  { add('creative_tech',3); add('tech',2); add('leadership',1); }

  /* Q8 — ideal environment */
  if (answers.q8 === 'Corporate office')              { add('management',2); add('finance',1); }
  if (answers.q8 === 'Startup culture')               { add('leadership',3); add('creative_tech',2); }
  if (answers.q8 === 'Remote/flexible work')          { add('creative',2); add('tech',1); add('communication',1); }
  if (answers.q8 === 'Creative studio')               { add('creative',3); add('communication',2); }
  if (answers.q8 === 'Research lab')                  { add('research',3); add('medical',1); }
  if (answers.q8 === 'Government sector')             { add('law',2); add('management',1); }
  if (answers.q8 === 'Business ownership')            { add('leadership',3); add('finance',2); }
  if (answers.q8 === 'Public-facing/social environment') { add('communication',3); add('empathy',1); }

  /* Q11 — group role */
  if (answers.q11 === 'Leader')              { add('leadership',3); add('management',1); }
  if (answers.q11 === 'Planner')             { add('management',3); add('finance',1); }
  if (answers.q11 === 'Creative thinker')    { add('creative',3); add('creative_tech',2); }
  if (answers.q11 === 'Problem solver')      { add('tech',3); add('research',2); }
  if (answers.q11 === 'Communicator')        { add('communication',3); add('law',1); }
  if (answers.q11 === 'Supportive helper')   { add('empathy',3); add('teaching',2); }
  if (answers.q11 === 'Technical person')    { add('tech',3); add('creative_tech',1); }
  if (answers.q11 === 'Observer')            { add('research',3); add('creative',1); }

  /* Q12 — self-description */
  if (answers.q12 === 'Creative and imaginative')     { add('creative',3); add('communication',1); }
  if (answers.q12 === 'Logical and analytical')       { add('tech',3); add('research',2); add('finance',1); }
  if (answers.q12 === 'Emotional and empathetic')     { add('empathy',3); add('teaching',2); }
  if (answers.q12 === 'Practical and disciplined')    { add('management',2); add('medical',2); add('finance',1); }
  if (answers.q12 === 'Curious and experimental')     { add('research',3); add('creative_tech',2); add('tech',1); }
  if (answers.q12 === 'Ambitious and competitive')    { add('leadership',3); add('finance',2); add('law',1); }

  /* Q13 — career priority */
  if (answers.q13 === 'High income')          { add('finance',3); add('leadership',2); }
  if (answers.q13 === 'Passion and enjoyment'){ add('creative',2); add('teaching',1); add('empathy',1); }
  if (answers.q13 === 'Stability')            { add('management',2); add('medical',2); add('finance',1); }
  if (answers.q13 === 'Creativity')           { add('creative',3); add('creative_tech',2); }
  if (answers.q13 === 'Freedom')              { add('creative',2); add('tech',1); add('communication',1); }
  if (answers.q13 === 'Recognition/status')   { add('communication',2); add('leadership',2); add('law',1); }
  if (answers.q13 === 'Helping society')      { add('empathy',3); add('teaching',2); add('medical',1); }
  if (answers.q13 === 'Innovation and growth'){ add('creative_tech',3); add('tech',2); add('leadership',1); }

  const maxScore = Math.max(...Object.values(s), 1);
  return PERSONALITY_MAP
    .map(p => ({
      profile: p,
      score: s[p.id],
      pct: Math.round(50 + (s[p.id] / maxScore) * 46),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

/* ═══════════════════════════════════════════════════════════
   RESULT CARD
═══════════════════════════════════════════════════════════ */
const ResultCard = ({
  profile, pct, rank, expanded, onToggle, name, q1, q4, q12,
}: {
  profile: PersonalityProfile; pct: number; rank: number;
  expanded: boolean; onToggle: () => void;
  name: string; q1: string[]; q4: string[]; q12: string;
}) => (
  <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: rank * 0.1 }}
    className={`rounded-2xl border overflow-hidden transition-all duration-300 ${profile.bgColor} ${profile.borderColor}`}>
    <button onClick={onToggle} className="w-full text-left p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{profile.icon}</span>
          <div>
            <span className={`text-[15px] font-bold ${profile.color}`}>{profile.name}</span>
            {rank === 0 && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">Primary</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[15px] font-bold ${profile.color}`}>{pct}%</span>
          <ChevronRight className={`w-4 h-4 text-zinc-600 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>
      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full ${profile.color.replace('text-','bg-')}`}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.1, delay: 0.2 + rank * 0.1 }} />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {profile.traits.map(t => (
          <span key={t} className={`text-[11px] px-2.5 py-0.5 rounded-full border ${profile.bgColor} ${profile.borderColor} ${profile.color} font-medium`}>{t}</span>
        ))}
      </div>
    </button>
    <AnimatePresence>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
          className="px-5 pb-5 space-y-4 border-t border-white/5">
          <p className={`pt-4 text-[13px] text-zinc-400 leading-relaxed italic border-l-2 pl-4 ${profile.borderColor}`}>
            "{profile.whyText(name, q1, q4, q12)}"
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${profile.color}`}>📘 Top Courses</p>
              <ul className="space-y-1.5">
                {profile.courses.slice(0, 5).map(c => (
                  <li key={c} className="text-[12px] text-zinc-400 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${profile.color.replace('text-','bg-')}`} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${profile.color}`}>💼 Top Careers</p>
              <ul className="space-y-1.5">
                {profile.careers.slice(0, 5).map(c => (
                  <li key={c} className="text-[12px] text-zinc-400 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${profile.color.replace('text-','bg-')}`} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   SECTION CONFIG  — 5 steps, 3 questions each (Q1–15)
═══════════════════════════════════════════════════════════ */
const SECTIONS = [
  { id: 'start',       title: 'About You',         icon: '👤', qs: '1–3'   },
  { id: 'work',        title: 'Work & Tasks',       icon: '⚡', qs: '4–6'   },
  { id: 'mindset',     title: 'Mindset',            icon: '🧠', qs: '7–9'   },
  { id: 'initiative',  title: 'Initiative',         icon: '🚀', qs: '10–12' },
  { id: 'future',      title: 'Future & Values',    icon: '🔭', qs: '13–15' },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export function StudentJourneyPage({ onNavigate }: StudentJourneyProps) {
  const [step,        setStep]       = useState(0);
  const [showResult,  setShowResult] = useState(false);
  const [expanded,    setExpanded]   = useState<string | null>(null);

  /* ── form state: all 15 answers ── */
  const [name,    setName]    = useState('');
  const [city,    setCity]    = useState('');
  const [stream,  setStream]  = useState('');

  const [q1,  setQ1]  = useState<string[]>([]);   // lose-track (multi)
  const [q2,  setQ2]  = useState('');              // proud achievement (text)
  const [q3,  setQ3]  = useState('');              // ideal life (text)

  const [q4,  setQ4]  = useState<string[]>([]);   // exciting work (multi)
  const [q5,  setQ5]  = useState<string[]>([]);   // people come to you (multi)
  const [q6,  setQ6]  = useState('');             // what you notice (single)

  const [q7,  setQ7]  = useState('');             // statement (single)
  const [q8,  setQ8]  = useState('');             // environment (single)
  const [q9,  setQ9]  = useState('');             // draining tasks (text)

  const [q10, setQ10] = useState('');             // self-started (text)
  const [q11, setQ11] = useState('');             // group role (single)
  const [q12, setQ12] = useState('');             // self-description (single)

  const [q13, setQ13] = useState('');             // career priority (single)
  const [q14, setQ14] = useState('');             // secretly wish (text)
  const [q15, setQ15] = useState('');             // 10-year vision (text)

  const tog = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const total = SECTIONS.length;
  const progress = showResult ? 100 : ((step) / (total - 1)) * 100;

  const handleNext = async () => {
    if (step < total - 1) {
      setStep(s => s + 1);
    } else {
      try {
        const { api } = await import('../../lib/api');
        await api.post('/api/discovery', {
          answers: { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, name, city, stream }
        });
      } catch {
        // Safe non-blocking fallback
      }
      setShowResult(true);
    }
  };
  const handleBack = () => {
    if (showResult) setShowResult(false);
    else if (step > 0) setStep(s => s - 1);
    else onNavigate('choice');
  };

  const results = showResult
    ? scorePersonalities({ q1, q4, q5, q6, q7, q8, q11, q12, q13 })
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden relative">
      {/* ambient glows */}
      <div className="absolute top-[-300px] left-[-200px] w-[700px] h-[700px] bg-violet-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-8 py-5 border-b border-zinc-800/60">
        <button onClick={handleBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-[13px] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {showResult ? 'Back to quiz' : step === 0 ? 'Home' : 'Back'}
        </button>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-violet-400" />
          <span className="text-[13px] font-semibold text-zinc-300">CideDec · Student Intelligence</span>
        </div>
        <span className="text-[12px] text-zinc-600">
          {showResult ? '✓ Complete' : `Step ${step + 1} / ${total}`}
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="relative z-10 h-1 bg-zinc-800/80">
        <motion.div className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 rounded-full"
          animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>

      {/* STEP TABS (hidden on result) */}
      {!showResult && (
        <div className="relative z-10 flex items-center gap-1 px-6 py-3 overflow-x-auto border-b border-zinc-800/40 scrollbar-hide">
          {SECTIONS.map((sec, i) => (
            <div key={sec.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
                i === step   ? 'bg-zinc-800 text-white' :
                i < step     ? 'text-emerald-500' :
                               'text-zinc-700'}`}>
              {i < step
                ? <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                : <span>{sec.icon}</span>}
              <span>{sec.title}</span>
              <span className="text-[10px] opacity-50">Q{sec.qs}</span>
            </div>
          ))}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div key={`step-${step}`}
              initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.28 }}
              className="max-w-2xl mx-auto px-6 py-10 space-y-10">

              {/* ════════════════ STEP 0 — ABOUT YOU (Q1–Q3) ════════════════ */}
              {step === 0 && (<>
                {/* Profile info */}
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-[26px] font-extrabold text-white">Let's start with you 👋</h2>
                    <p className="text-[14px] text-zinc-500">CideDec will use every answer to build your exact personality and career profile.</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-2 block">Your Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aryan Sharma"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-2 block">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Indore, MP"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-3 block">Current Stream</label>
                    <div className="flex flex-wrap gap-2">
                      {['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts / Humanities', 'Vocational', 'Other / Not sure'].map(s => (
                        <Pill key={s} label={s} selected={stream === s} onClick={() => setStream(s)} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Q1 */}
                <div>
                  <QLabel n={1} text="What kind of activities make you lose track of time?"
                    sub="Select all that honestly apply — there are no wrong answers." />
                  <div className="flex flex-wrap gap-2">
                    {['Designing or creating things','Solving logical problems','Leading or organizing',
                      'Helping people','Researching and learning','Making content/videos',
                      'Building technical projects','Business or money-related work'].map(o => (
                      <MPill key={o} label={o} selected={q1.includes(o)} onClick={() => tog(q1, setQ1, o)} c="violet" />
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div>
                  <QLabel n={2} text="Which school activity or achievement made you feel most proud?"
                    sub="Projects, competitions, leadership, helping others — anything that mattered to you." />
                  <Textarea value={q2} onChange={setQ2}
                    placeholder="e.g. I organised our school's science fair and 200 students attended. I felt alive managing the whole event..." rows={3} />
                </div>

                {/* Q3 */}
                <div>
                  <QLabel n={3} text="If nobody judged you and money was guaranteed, what would you genuinely spend your life doing?"
                    sub="Be fully honest. This answer matters more than you think." />
                  <Textarea value={q3} onChange={setQ3}
                    placeholder="e.g. I'd spend my life building software that helps students learn better. Or designing clothes that tell stories..." rows={3} />
                </div>
              </>)}

              {/* ════════════════ STEP 1 — WORK & TASKS (Q4–Q6) ════════════════ */}
              {step === 1 && (<>
                <div className="space-y-1">
                  <h2 className="text-[26px] font-extrabold text-white">Work & Tasks ⚡</h2>
                  <p className="text-[14px] text-zinc-500">How you naturally work and what you're drawn to reveals your career DNA.</p>
                </div>

                {/* Q4 */}
                <div>
                  <QLabel n={4} text="Which type of work sounds most exciting to you?"
                    sub="Select everything that genuinely excites you." />
                  <div className="flex flex-wrap gap-2">
                    {['Creating/designing','Coding/building','Managing people','Public speaking',
                      'Business/startups','Healthcare/helping','Research/discovery',
                      'Media/content creation','Problem-solving'].map(o => (
                      <MPill key={o} label={o} selected={q4.includes(o)} onClick={() => tog(q4, setQ4, o)} c="blue" />
                    ))}
                  </div>
                </div>

                {/* Q5 */}
                <div>
                  <QLabel n={5} text="What kind of problems do people usually come to you for?"
                    sub="Think about friends, family, classmates — who do they turn to you for?" />
                  <div className="flex flex-wrap gap-2">
                    {['Advice/support','Creativity/design','Technical help','Leadership/organization',
                      'Studies/explanations','Motivation','Business ideas','Communication'].map(o => (
                      <MPill key={o} label={o} selected={q5.includes(o)} onClick={() => tog(q5, setQ5, o)} c="emerald" />
                    ))}
                  </div>
                </div>

                {/* Q6 */}
                <div>
                  <QLabel n={6} text="What do you naturally notice more around you?" />
                  <div className="flex flex-wrap gap-2">
                    {['Visuals and aesthetics','Logic and systems',"People's emotions",
                      'Opportunities and ideas','Mistakes and improvements','Trends and creativity'].map(o => (
                      <Pill key={o} label={o} selected={q6 === o} onClick={() => setQ6(o)} />
                    ))}
                  </div>
                </div>
              </>)}

              {/* ════════════════ STEP 2 — MINDSET (Q7–Q9) ════════════════ */}
              {step === 2 && (<>
                <div className="space-y-1">
                  <h2 className="text-[26px] font-extrabold text-white">Your Mindset 🧠</h2>
                  <p className="text-[14px] text-zinc-500">How you think, what energises you, and what drains you reveals the deepest layer of your personality.</p>
                </div>

                {/* Q7 */}
                <div>
                  <QLabel n={7} text="Which statement feels most like you?" />
                  <div className="space-y-2">
                    {[
                      { o: 'I enjoy stability and security.',              icon: '🛡️', sub: 'You value consistency, safety, and structure' },
                      { o: 'I enjoy freedom and creativity.',              icon: '🎨', sub: 'You need space to express and explore' },
                      { o: 'I enjoy challenges and competition.',          icon: '🏆', sub: 'You thrive when there\'s something to win' },
                      { o: 'I enjoy helping and connecting with people.',  icon: '💚', sub: 'Human connection is your energy source' },
                      { o: 'I enjoy innovation and building new ideas.',   icon: '🚀', sub: 'You\'re driven to create what doesn\'t exist yet' },
                    ].map(({ o, icon, sub }) => (
                      <button key={o} onClick={() => setQ7(o)}
                        className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                          q7 === o ? 'bg-violet-500/15 border-violet-500/50' : 'bg-zinc-900 border-zinc-700/50 hover:border-zinc-600'}`}>
                        <span className="text-xl shrink-0">{icon}</span>
                        <div>
                          <p className="text-[13px] font-semibold text-white">{o}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
                        </div>
                        {q7 === o && <CheckCircle2 className="w-4 h-4 text-violet-400 ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q8 */}
                <div>
                  <QLabel n={8} text="What kind of environment would make you happiest in the future?" />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { o: 'Corporate office',              icon: '🏢', sub: 'Structure, stability, clear path' },
                      { o: 'Startup culture',               icon: '🚀', sub: 'Fast, risky, high reward' },
                      { o: 'Remote/flexible work',          icon: '🏠', sub: 'Freedom, own pace' },
                      { o: 'Creative studio',               icon: '🎨', sub: 'Art, design, expression' },
                      { o: 'Research lab',                  icon: '🔬', sub: 'Discovery, depth, science' },
                      { o: 'Government sector',             icon: '🏛️', sub: 'Stability, public service' },
                      { o: 'Business ownership',            icon: '💼', sub: 'Build your own empire' },
                      { o: 'Public-facing/social environment', icon: '🌍', sub: 'People, community, impact' },
                    ].map(({ o, icon, sub }) => (
                      <BigCard key={o} icon={icon} label={o} sub={sub} selected={q8 === o} onClick={() => setQ8(o)} accent="violet" />
                    ))}
                  </div>
                </div>

                {/* Q9 */}
                <div>
                  <QLabel n={9} text="What subjects or tasks make you feel mentally drained or bored quickly?"
                    sub="Knowing what drains you is as important as knowing what energises you." />
                  <Textarea value={q9} onChange={setQ9}
                    placeholder="e.g. I get bored with repetitive calculations and rote memorisation. Writing long essays also drains me fast..." rows={3} />
                </div>
              </>)}

              {/* ════════════════ STEP 3 — INITIATIVE (Q10–Q12) ════════════════ */}
              {step === 3 && (<>
                <div className="space-y-1">
                  <h2 className="text-[26px] font-extrabold text-white">Initiative & Identity 🚀</h2>
                  <p className="text-[14px] text-zinc-500">What you've already started on your own — and how you see yourself — tells CideDec everything.</p>
                </div>

                {/* Q10 */}
                <div>
                  <QLabel n={10} text="Have you ever started something on your own without being told to?"
                    sub="Content page, business idea, design portfolio, coding project, YouTube channel, freelancing, event, helping initiative — anything counts." />
                  <Textarea value={q10} onChange={setQ10}
                    placeholder="e.g. I started an Instagram page sharing study tips. Got 3,000 followers in 3 months without any help. Or: I built a small web app to track my cricket team's scores..." rows={4} />
                  <p className="text-[11px] text-zinc-600 mt-2">If you haven't yet, write what you've thought about starting — that counts too.</p>
                </div>

                {/* Q11 */}
                <div>
                  <QLabel n={11} text="When working in a group, what role do you usually take naturally?" />
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { o: 'Leader',             icon: '👑', sub: 'You set direction and make decisions' },
                      { o: 'Planner',            icon: '📋', sub: 'You organise tasks and timelines' },
                      { o: 'Creative thinker',   icon: '🎨', sub: 'You generate the ideas' },
                      { o: 'Problem solver',     icon: '🔧', sub: 'You fix what\'s broken' },
                      { o: 'Communicator',       icon: '🎙️', sub: 'You present and connect' },
                      { o: 'Supportive helper',  icon: '💚', sub: 'You keep the team motivated' },
                      { o: 'Technical person',   icon: '⚡', sub: 'You handle the hard technical work' },
                      { o: 'Observer',           icon: '👁️', sub: 'You analyse and give deep feedback' },
                    ].map(({ o, icon, sub }) => (
                      <button key={o} onClick={() => setQ11(o)}
                        className={`text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                          q11 === o ? 'bg-amber-500/15 border-amber-500/50' : 'bg-zinc-900 border-zinc-700/50 hover:border-zinc-600'}`}>
                        <span className="text-lg shrink-0">{icon}</span>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-white truncate">{o}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{sub}</p>
                        </div>
                        {q11 === o && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q12 */}
                <div>
                  <QLabel n={12} text="Which describes you better?" />
                  <div className="flex flex-wrap gap-2">
                    {['Creative and imaginative','Logical and analytical','Emotional and empathetic',
                      'Practical and disciplined','Curious and experimental','Ambitious and competitive'].map(o => (
                      <MPill key={o} label={o} selected={q12 === o} onClick={() => setQ12(o)} c="pink" />
                    ))}
                  </div>
                </div>
              </>)}

              {/* ════════════════ STEP 4 — FUTURE & VALUES (Q13–Q15) ════════════════ */}
              {step === 4 && (<>
                <div className="space-y-1">
                  <h2 className="text-[26px] font-extrabold text-white">Future & Values 🔭</h2>
                  <p className="text-[14px] text-zinc-500">Your vision and values are the final layer of your CideDec personality intelligence profile.</p>
                </div>

                {/* Q13 */}
                <div>
                  <QLabel n={13} text="What matters MOST to you in your future career?" />
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { o: 'High income',           icon: '💰', sub: 'Money drives your ambition' },
                      { o: 'Passion and enjoyment', icon: '❤️',  sub: 'Love what you do every day' },
                      { o: 'Stability',             icon: '🛡️', sub: 'Security and predictability' },
                      { o: 'Creativity',            icon: '🎨', sub: 'Express yourself through work' },
                      { o: 'Freedom',               icon: '🌊', sub: 'Own your time and direction' },
                      { o: 'Recognition/status',    icon: '🏆', sub: 'Be known and respected' },
                      { o: 'Helping society',       icon: '🌍', sub: 'Make a real difference' },
                      { o: 'Innovation and growth', icon: '🚀', sub: 'Build the future' },
                    ].map(({ o, icon, sub }) => (
                      <button key={o} onClick={() => setQ13(o)}
                        className={`text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                          q13 === o ? 'bg-emerald-500/15 border-emerald-500/50' : 'bg-zinc-900 border-zinc-700/50 hover:border-zinc-600'}`}>
                        <span className="text-lg shrink-0">{icon}</span>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-white">{o}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{sub}</p>
                        </div>
                        {q13 === o && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q14 */}
                <div>
                  <QLabel n={14} text="What is something you secretly wish you were confident enough to try?"
                    sub="Starting a YouTube channel, building a startup, becoming a doctor, learning to code, speaking on stage — anything." />
                  <Textarea value={q14} onChange={setQ14}
                    placeholder="e.g. I secretly wish I had the confidence to start my own clothing brand. I have so many design ideas but I'm scared of failure..." rows={3} />
                </div>

                {/* Q15 */}
                <div>
                  <QLabel n={15} text="Imagine yourself 10 years from now. Describe your life."
                    sub="Your work · lifestyle · environment · goals · success definition. Be as detailed as possible — this is the most important answer." />
                  <Textarea value={q15} onChange={setQ15}
                    placeholder="e.g. In 10 years I see myself running a tech startup from a modern office in Bangalore. I'm leading a team of 20, building AI products that help millions of students. I work hard but also travel often. My definition of success is freedom, impact, and financial independence..." rows={6} />
                  <div className="mt-3 flex items-start gap-2 text-[12px] text-zinc-600">
                    <Sparkles className="w-4 h-4 text-violet-500/60 shrink-0 mt-0.5" />
                    <span>CideDec uses your Q15 vision to deeply personalise your analysis. The more detail you give, the more accurate your results will be.</span>
                  </div>
                </div>

                {/* Ready banner */}
                <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/25 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-white mb-1">Your CideDec Intelligence Report is ready to generate</p>
                      <p className="text-[12px] text-zinc-500 leading-relaxed">
                        CideDec will now analyse all 15 answers simultaneously — detecting your strongest personality traits,
                        hidden strengths, career compatibility scores, and the exact courses and paths that match your true potential.
                      </p>
                    </div>
                  </div>
                </div>
              </>)}

              {/* ── NAV FOOTER (all steps) ── */}
              <div className="flex items-center justify-between pt-8 border-t border-zinc-800/60">
                <button onClick={handleBack} disabled={step === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-zinc-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {/* dot indicators */}
                <div className="flex items-center gap-1.5">
                  {SECTIONS.map((_, i) => (
                    <span key={i} className={`rounded-full transition-all duration-300 ${
                      i === step   ? 'w-5 h-2 bg-violet-500' :
                      i < step     ? 'w-2 h-2 bg-emerald-500' :
                                     'w-2 h-2 bg-zinc-700'}`} />
                  ))}
                </div>
                <motion.button onClick={handleNext} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25 transition-all">
                  {step === SECTIONS.length - 1
                    ? <><Sparkles className="w-4 h-4" /> Reveal My Analysis</>
                    : <>Next <ArrowRight className="w-4 h-4" /></>}
                </motion.button>
              </div>

            </motion.div>

          ) : (
            /* ══════════════════════════════════════════════════════
               RESULTS SCREEN
            ══════════════════════════════════════════════════════ */
            <motion.div key="results"
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
              className="max-w-2xl mx-auto px-6 py-10">

              {/* Hero */}
              <div className="text-center mb-10">
                <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-500/30 rounded-full px-5 py-2 mb-5">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-[13px] font-semibold text-violet-300">CideDec Personality Intelligence Report</span>
                </motion.div>
                <h2 className="text-[30px] font-extrabold text-white mb-3">
                  {name ? `${name}'s` : 'Your'} Career DNA 🧬
                </h2>
                <p className="text-[14px] text-zinc-500 leading-relaxed max-w-lg mx-auto">
                  Analysed across all 15 dimensions — your strongest personality matches,
                  top courses after 12th, ideal careers, and a personalised explanation for each.
                </p>
                {city && (
                  <p className="flex items-center justify-center gap-1.5 mt-3 text-[12px] text-zinc-600">
                    <MapPin className="w-3.5 h-3.5" /> {city}
                    {stream && <><span className="mx-1">·</span><span>{stream}</span></>}
                  </p>
                )}
              </div>

              {/* Personality cards */}
              <div className="space-y-4 mb-10">
                {results.map(({ profile, score, pct }, idx) => (
                  <ResultCard key={profile.id}
                    profile={profile} pct={pct} rank={idx}
                    expanded={expanded === profile.id}
                    onToggle={() => setExpanded(expanded === profile.id ? null : profile.id)}
                    name={name} q1={q1} q4={q4} q12={q12}
                  />
                ))}
              </div>

              {/* Profile summary strip */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <Brain className="w-4 h-4 text-violet-400" />
                  <p className="text-[13px] font-bold text-white">Your Intelligence Fingerprint</p>
                </div>

                {/* Q3 dream (if filled) */}
                {q3.trim().length > 10 && (
                  <div className="mb-4 p-4 bg-violet-500/8 border border-violet-500/20 rounded-xl">
                    <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider mb-1.5">Your Ideal Life (Q3)</p>
                    <p className="text-[13px] text-zinc-400 leading-relaxed italic">"{q3.slice(0, 200)}{q3.length > 200 ? '…' : ''}"</p>
                  </div>
                )}

                {/* Q15 vision (if filled) */}
                {q15.trim().length > 10 && (
                  <div className="mb-4 p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
                    <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">Your 10-Year Vision (Q15)</p>
                    <p className="text-[13px] text-zinc-400 leading-relaxed italic">"{q15.slice(0, 220)}{q15.length > 220 ? '…' : ''}"</p>
                  </div>
                )}

                {/* signal grid */}
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  {[
                    { icon: '⚡', label: 'Lose-track tasks',     val: q1.slice(0,2).join(', ') || 'Not specified' },
                    { icon: '🧠', label: 'Thinking identity',    val: q12 || 'Not specified' },
                    { icon: '🎯', label: 'Career priority',      val: q13 || 'Not specified' },
                    { icon: '🌍', label: 'Ideal environment',    val: q8  || 'Not specified' },
                    { icon: '👥', label: 'Group role',           val: q11 || 'Not specified' },
                    { icon: '💡', label: 'What you notice',      val: q6  || 'Not specified' },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="flex items-start gap-2 text-zinc-400">
                      <span className="shrink-0 mt-0.5">{icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{label}</p>
                        <p className="text-white font-medium truncate">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
                className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => onNavigate('insights')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-semibold transition-all shadow-lg shadow-violet-500/20">
                  <Search className="w-4 h-4" /> Explore Career Paths on CideDec
                </button>
                <button onClick={() => { setShowResult(false); setStep(0); }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[13px] font-medium transition-all border border-zinc-700">
                  <RefreshCw className="w-4 h-4" /> Retake Analysis
                </button>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
