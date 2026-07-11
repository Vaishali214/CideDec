import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, FileText, X, Brain, Target, TrendingUp, Shield, Zap,
  AlertTriangle, CheckCircle2, ArrowRight, BarChart3, Briefcase,
  GraduationCap, Star, RefreshCw, ChevronRight, Activity, Eye, Lightbulb
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import type { Page } from '../App';
import {
  parseResumeText, analyzeResume, extractTextFromFile,
  type ParsedResume, type ATSAnalysis,
} from '../../lib/ats/analyzer';
import { CareerIntelligenceModal } from '../components/CareerIntelligenceModal';

interface ATSProps { onNavigate: (page: Page) => void }

const SIGNAL_COLORS = { green: '#10b981', orange: '#f59e0b', red: '#ef4444' };
const SIGNAL_LABELS = { green: 'Strong', orange: 'Moderate', red: 'Needs Work' };
const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

/* ── Score Ring ── */
function ScoreRing({ score, label, size = 80, color }: { score: number; label: string; size?: number; color?: string }) {
  const c = color || (score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444');
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#27272a" strokeWidth="4" />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth="4"
          strokeLinecap="round" initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${(score/100)*circ} ${circ}` }}
          transition={{ duration: 1.2, ease: 'easeOut' }} />
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={size > 60 ? 18 : 14} fontWeight="800"
          transform={`rotate(90 ${size/2} ${size/2})`}>{score}</text>
      </svg>
      <span className="text-[10px] text-zinc-500 font-semibold text-center leading-tight">{label}</span>
    </div>
  );
}

/* ── Signal Badge ── */
function SignalBadge({ signal }: { signal: 'green' | 'orange' | 'red' }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{ borderColor: SIGNAL_COLORS[signal] + '40', background: SIGNAL_COLORS[signal] + '10' }}>
      <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: SIGNAL_COLORS[signal] }} />
      <span className="text-[12px] font-bold" style={{ color: SIGNAL_COLORS[signal] }}>{SIGNAL_LABELS[signal]}</span>
    </div>
  );
}

export function ATSIntelligence({ onNavigate }: ATSProps) {
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [isIntelModalOpen, setIsIntelModalOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processText = useCallback(async (text: string, fileName: string) => {
    setLoading(true);
    const p = parseResumeText(text, fileName);
    const a = analyzeResume(p);
    
    // Save report to SQLite database
    const { api } = await import('../../lib/api');
    await api.post('/api/ats', {
      file_name: fileName,
      score: a.scores.overall,
      analysis: a
    });

    setParsed(p);
    setAnalysis(a);
    setLoading(false);
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const text = await extractTextFromFile(file);
      processText(text, file.name);
    } catch {
      processText('', file.name);
    }
  }, [processText]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const reset = () => { setParsed(null); setAnalysis(null); setPasteText(''); setPasteMode(false); };

  const a = analysis;
  const s = a?.scores;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-16">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 pt-8">

        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[28px] font-extrabold tracking-tight">ATS Intelligence</h1>
          <p className="text-[14px] text-zinc-500 mt-1">Upload your resume for AI-powered career analysis</p>
        </motion.div>

        {/* ═══ UPLOAD STATE ═══ */}
        {!analysis && !loading && (
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Drop zone */}
            <div className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragOver ? 'border-white bg-white/5' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/40'
            }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
              <Upload className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
              <p className="text-[16px] font-bold text-white mb-1">Drop your resume here</p>
              <p className="text-[13px] text-zinc-500 mb-4">or click to browse — PDF, DOCX, TXT supported</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-[11px] text-zinc-600 bg-zinc-800 px-3 py-1 rounded-full">PDF</span>
                <span className="text-[11px] text-zinc-600 bg-zinc-800 px-3 py-1 rounded-full">DOCX</span>
                <span className="text-[11px] text-zinc-600 bg-zinc-800 px-3 py-1 rounded-full">TXT</span>
              </div>
            </div>

            {/* Or paste text */}
            <div className="text-center">
              <button onClick={() => setPasteMode(!pasteMode)}
                className="text-[13px] text-zinc-500 hover:text-white font-medium transition-colors">
                Or paste resume text directly →
              </button>
            </div>

            <AnimatePresence>
              {pasteMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
                    placeholder="Paste your resume content here..."
                    className="w-full h-48 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-[13px] text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-zinc-600 resize-none" />
                  <motion.button onClick={() => { if (pasteText.trim()) processText(pasteText, 'pasted-resume.txt'); }}
                    disabled={!pasteText.trim()}
                    className="mt-3 px-6 py-2.5 rounded-xl bg-white text-black text-[13px] font-semibold disabled:opacity-30 hover:bg-zinc-200 transition-colors"
                    whileTap={{ scale: 0.97 }}>
                    Analyze Resume
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Privacy notice */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] text-zinc-600">100% private — all analysis happens in your browser</span>
            </div>
          </motion.div>
        )}

        {/* ═══ LOADING ═══ */}
        <AnimatePresence>
          {loading && (
            <motion.div className="flex flex-col items-center py-20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative w-16 h-16 mb-5">
                {[0,1,2].map(i => (
                  <motion.span key={i} className="absolute inset-0 rounded-full border border-white/30"
                    animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 rounded-full border border-zinc-800">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-[15px] font-bold text-white mb-1">Analyzing resume…</p>
              <p className="text-[12px] text-zinc-500">Parsing sections · Matching skills · Scoring ATS compatibility</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ RESULTS ═══ */}
        {a && s && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="text-[14px] font-bold text-white">{parsed?.fileName}</p>
                  <p className="text-[11px] text-zinc-500">{parsed?.metrics.wordCount} words · {parsed?.detectedSkills.tech.length + (parsed?.detectedSkills.soft.length || 0)} skills detected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SignalBadge signal={a.signal} />
                <motion.button onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 text-[12px] text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                  whileTap={{ scale: 0.97 }}>
                  <RefreshCw className="w-3 h-3" /> New Analysis
                </motion.button>
              </div>
            </div>

            {/* Score Rings */}
            <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-4 justify-items-center">
                {/* AI Career Intelligence Glowing Bulb Icon */}
                <div 
                  className="relative group flex flex-col items-center gap-1.5 cursor-pointer"
                  onClick={() => setIsIntelModalOpen(true)}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur opacity-45 group-hover:opacity-85 animate-pulse transition duration-1000 group-hover:duration-200" />
                  <div className="relative w-[80px] h-[80px] rounded-full bg-zinc-950 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.65)] group-hover:border-amber-400 transition-all duration-300">
                    <span className="absolute inset-0 rounded-full border border-amber-500/25 animate-ping opacity-60 pointer-events-none" />
                    <Lightbulb className="w-9 h-9 text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.65)] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] text-amber-400 font-extrabold text-center leading-tight tracking-wider uppercase filter drop-shadow-[0_0_2px_rgba(245,158,11,0.25)]">Career Intel</span>
                </div>

                <ScoreRing score={s.ats} label="ATS Score" />
                <ScoreRing score={s.readability} label="Readability" />
                <ScoreRing score={s.skillMatch} label="Skill Match" />
                <ScoreRing score={s.jobCompatibility} label="Job Fit" />
                <ScoreRing score={s.industryFit} label="Industry Fit" />
                <ScoreRing score={s.experienceStrength} label="Experience" />
                <ScoreRing score={s.hiringProbability} label="Hiring %" />
                <ScoreRing score={100 - s.aiReplacementRisk} label="AI Safety" color={s.aiReplacementRisk < 25 ? '#10b981' : s.aiReplacementRisk < 50 ? '#f59e0b' : '#ef4444'} />
                <ScoreRing score={a.interviewReadiness} label="Interview Ready" />
              </div>
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Radar */}
              <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Skill Radar</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={[
                    { subject: 'ATS', value: s.ats },
                    { subject: 'Skills', value: s.skillMatch },
                    { subject: 'Experience', value: s.experienceStrength },
                    { subject: 'Industry', value: s.industryFit },
                    { subject: 'Readability', value: s.readability },
                    { subject: 'Hiring %', value: s.hiringProbability },
                  ]}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#71717a' }} />
                    <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                    <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Tech/Soft Balance + Career Match */}
              <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Career Match Scores</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={a.careerPaths.slice(0, 5)} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#71717a' }} />
                    <YAxis type="category" dataKey="title" tick={{ fontSize: 10, fill: '#a1a1aa' }} width={120} />
                    <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11, color: '#fff' }} />
                    <Bar dataKey="matchScore" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <p className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider mb-3">✓ Strengths</p>
                <div className="space-y-2">
                  {a.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-zinc-300">{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className="text-[12px] font-bold text-amber-400 uppercase tracking-wider mb-3">⚠ Weaknesses</p>
                <div className="space-y-2">
                  {a.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-zinc-300">{w}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Career Paths */}
            <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Best Career Paths</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {a.careerPaths.slice(0, 4).map((cp, i) => (
                  <div key={i} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-white">{cp.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: cp.matchScore >= 70 ? '#10b98120' : '#f59e0b20', color: cp.matchScore >= 70 ? '#10b981' : '#f59e0b' }}>
                        {cp.matchScore}%
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mb-2">{cp.domain}</p>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between"><span className="text-zinc-500">Demand</span><span className="text-zinc-300 font-semibold">{cp.demand}/100</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Growth</span><span className="text-emerald-400 font-semibold">+{cp.growth}%/yr</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">AI Risk</span><span className={`font-semibold ${cp.aiRisk < 25 ? 'text-emerald-400' : 'text-amber-400'}`}>{cp.aiRisk}%</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Salary</span><span className="text-zinc-300 font-semibold">₹{(cp.salary.min/100000).toFixed(0)}L–{(cp.salary.max/100000).toFixed(0)}L</span></div>
                    </div>
                    {cp.missingSkills.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-zinc-700/50">
                        <p className="text-[9px] text-zinc-600 mb-1">Missing skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {cp.missingSkills.slice(0, 3).map((sk, j) => (
                            <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{sk}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Optimization Roadmap */}
            <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Optimization Roadmap</p>
              <div className="space-y-3">
                {a.optimizationRoadmap.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      step.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      step.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}>{i + 1}</div>
                    <div className="flex-1">
                      <p className="text-[13px] text-zinc-200 font-medium">{step.step}</p>
                      <p className="text-[10px] text-zinc-500">Impact: {step.impact}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      step.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                      step.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-zinc-800 text-zinc-500'
                    }`}>{step.priority}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations + Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Recommendations</p>
                <div className="space-y-2">
                  {a.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-zinc-300 leading-snug">{r}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Salary Prediction</p>
                <div className="text-center py-4">
                  <p className="text-[11px] text-zinc-500 mb-1">Estimated Annual Range</p>
                  <p className="text-[28px] font-extrabold text-white">
                    {a.salaryRange.currency}{(a.salaryRange.min/100000).toFixed(0)}L – {(a.salaryRange.max/100000).toFixed(0)}L
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-2">Based on matched career path & skill level</p>
                </div>
                <div className="border-t border-zinc-800 pt-3 mt-3">
                  <p className="text-[11px] text-zinc-500 mb-2">Missing In-Demand Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {a.missingKeywords.slice(0, 6).map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">{kw}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Detected Skills */}
            <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Detected Skills</p>
              <div className="mb-3">
                <p className="text-[10px] text-zinc-500 mb-2">Technical ({parsed?.detectedSkills.tech.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {parsed?.detectedSkills.tech.map((sk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">{sk}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 mb-2">Soft Skills ({parsed?.detectedSkills.soft.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {parsed?.detectedSkills.soft.map((sk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{sk}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {parsed && (
        <CareerIntelligenceModal
          isOpen={isIntelModalOpen}
          onClose={() => setIsIntelModalOpen(false)}
          parsedResume={parsed}
        />
      )}
    </div>
  );
}
