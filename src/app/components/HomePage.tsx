import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search, Mic, ArrowRight, Lightbulb,
  TrendingUp, BarChart3,
  Shield, Target, Activity, Eye, Globe,
  CheckCircle2, Brain,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../AppContext';
import type { Page } from '../App';

const forecastData = [
  { year: '2024', optimistic: 42, projected: 38, conservative: 32 },
  { year: '2025', optimistic: 55, projected: 46, conservative: 37 },
  { year: '2026', optimistic: 72, projected: 58, conservative: 42 },
  { year: '2027', optimistic: 95, projected: 74, conservative: 50 },
  { year: '2028', optimistic: 125, projected: 94, conservative: 60 },
  { year: '2029', optimistic: 160, projected: 118, conservative: 72 },
];

const marketShareData = [
  { name: 'You', value: 38 },
  { name: 'Competitor A', value: 28 },
  { name: 'Competitor B', value: 18 },
  { name: 'Others', value: 16 },
];
const MARKET_COLORS = ['#ffffff', '#a0a0a0', '#666666', '#444444'];

const EXAMPLE_QUERIES = [
  'Computer Science trends',
  'Medical & Health insights',
  'Engineering course analytics',
  'Data Science career forecast',
];

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onOpenAuthModal?: () => void;
}

export function HomePage({ onNavigate, onOpenAuthModal }: HomePageProps) {
  const { isAuthenticated, setPendingQuery } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('Science');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const categories = ['Science', 'Engineering', 'Arts & Humanities'];

  // Auto-cycle through categories slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory(prev => {
        const idx = categories.indexOf(prev);
        return categories[(idx + 1) % categories.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const q = inputValue.trim();
    if (!q) return;
    if (!isAuthenticated) { setPendingQuery(q); onOpenAuthModal?.(); return; }
    setPendingQuery(q);
    onNavigate('insights');
  };

  const handleSearchFocus = () => {
    if (!isAuthenticated) { setPendingQuery(inputValue); onOpenAuthModal?.(); inputRef.current?.blur(); }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white overflow-hidden">

      {/* ── MAIN CONTENT: fills remaining height ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── HERO: takes most space ── */}
        <section className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-white/[0.025] to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 h-full w-full px-8 lg:px-16 flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 xl:gap-16 items-center">

              {/* LEFT */}
              <div>
                <motion.div
                  className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-6"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[12px] text-zinc-400 font-medium">Emotion-Aware AI Platform</span>
                </motion.div>

                <motion.h1
                  className="text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold leading-[1.0] tracking-tight mb-6"
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
                  Smart AI<br />
                  <span className="text-zinc-500">Suggestions</span>
                </motion.h1>

                <motion.p
                  className="text-[17px] text-zinc-400 leading-relaxed max-w-none mb-8"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  Understands your query, detects bias, delivers accurate insights, and evolves with every interaction. Backed by 5-year forecasting.
                </motion.p>

                {/* Category Pills */}
                <motion.div className="flex gap-3 mb-8 items-center"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  {['Science', 'Engineering', 'Arts & Humanities'].map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className="relative px-6 py-2.5 rounded-full text-[14px] font-semibold transition-colors duration-150 overflow-hidden"
                      style={{ zIndex: 0 }}>
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        initial={false}
                        animate={activeCategory === cat
                          ? { backgroundColor: '#ffffff', opacity: 1 }
                          : { backgroundColor: 'transparent', opacity: 1 }
                        }
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        style={{ zIndex: -1 }}
                      />
                      <motion.span
                        className="relative"
                        animate={{ color: activeCategory === cat ? '#000000' : '#a1a1aa' }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      >
                        {cat}
                      </motion.span>
                    </button>
                  ))}
                </motion.div>

                {/* Search Bar */}
                <motion.div className="relative max-w-none mb-5"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-700 rounded-2xl px-5 py-4 backdrop-blur-sm shadow-xl">
                    <Search className="w-5 h-5 text-zinc-500 shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onFocus={handleSearchFocus}
                      onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                      placeholder="Ask anything — marketing ROI, market trends, risk score..."
                      className="flex-1 bg-transparent outline-none text-[14px] font-medium text-zinc-200 placeholder:text-zinc-600"
                      readOnly={!isAuthenticated}
                    />
                    <motion.button
                      onClick={() => {
                        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                        if (!SR) { alert('Speech recognition not supported.'); return; }
                        if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); return; }
                        const rec = new SR();
                        rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
                        rec.onresult = (e: any) => { setInputValue(prev => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript); setIsListening(false); };
                        rec.onerror = () => setIsListening(false);
                        rec.onend = () => setIsListening(false);
                        recognitionRef.current = rec; rec.start(); setIsListening(true);
                      }}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all shrink-0 ${isListening ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 animate-pulse' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                      whileTap={{ scale: 0.95 }}>
                      <Mic className="w-4 h-4" />
                    </motion.button>
                    <motion.button onClick={handleSearch}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black shrink-0 hover:bg-zinc-200 transition-colors"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    <motion.button onClick={() => {
                      if (!isAuthenticated) {
                        setPendingQuery('');
                        onOpenAuthModal?.();
                        return;
                      }
                      onNavigate('ats');
                    }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 hover:bg-amber-500/25 transition-colors"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="ATS Resume Intelligence">
                      <Lightbulb className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Example queries */}
                <motion.div className="flex flex-wrap gap-2 items-center max-w-none"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                  <span className="text-[12px] text-zinc-600 font-medium">Try:</span>
                  {EXAMPLE_QUERIES.map((eq, i) => (
                    <button key={i} onClick={() => setInputValue(eq)}
                      className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors font-medium underline decoration-zinc-700 underline-offset-2 hover:decoration-zinc-500">
                      {eq}
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* RIGHT — Dashboard Preview */}
              <motion.div className="relative"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}>
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 xl:p-8 backdrop-blur-sm shadow-2xl">
                  {/* Metrics row */}
                  <div className="grid grid-cols-4 gap-4 mb-5">
                    {[
                      { label: 'Query Score', value: '85', sub: '/100', detail: 'High Quality', change: '↑ 12%' },
                      { label: 'Confidence',  value: '92', sub: '%',    detail: 'High',         change: '↑ 8%'  },
                      { label: 'Domain',      value: '',   sub: '',     detail: 'Business',     change: 'Detected' },
                      { label: 'Bias',        value: '',   sub: '',     detail: 'Low Risk',     change: '2.4%'  },
                    ].map((m, i) => (
                      <motion.div key={i} className="bg-zinc-800/70 rounded-2xl p-4 xl:p-5 border border-zinc-700/50"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>
                        <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">{m.label}</p>
                        {m.value ? (
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-[30px] xl:text-[34px] font-extrabold text-white leading-none">{m.value}</span>
                            <span className="text-[13px] text-zinc-500 font-semibold">{m.sub}</span>
                          </div>
                        ) : (
                          <p className="text-[18px] xl:text-[20px] font-bold text-white leading-tight mt-0.5">{m.detail}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1.5">
                          {m.value && <p className="text-[10px] text-zinc-500">{m.detail}</p>}
                          <p className={`text-[10px] font-semibold ${m.change.includes('↑') ? 'text-emerald-400' : 'text-zinc-500'}`}>{m.change}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-3 bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] text-zinc-400 font-bold">5-Year Forecast</p>
                        <div className="flex items-center gap-3">
                          {[{ label: 'Optimistic', color: '#10b981' }, { label: 'Projected', color: '#3b82f6' }, { label: 'Conservative', color: '#8b5cf6' }].map((l, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                              <span className="text-[9px] text-zinc-500">{l.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={forecastData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                          <defs>
                            <linearGradient id="gOpt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                            <linearGradient id="gProj" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                            <linearGradient id="gCons" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12, color: '#fff' }} />
                          <Area type="monotone" dataKey="optimistic" stroke="#10b981" strokeWidth={2} fill="url(#gOpt)" dot={false} />
                          <Area type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={2} fill="url(#gProj)" dot={false} />
                          <Area type="monotone" dataKey="conservative" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#gCons)" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="col-span-2 flex flex-col gap-4">
                      <div className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/30 flex-1">
                        <p className="text-[12px] text-zinc-400 font-bold mb-3">Sentiment Score</p>
                        <div className="flex items-center gap-5">
                          <div className="relative w-[80px] h-[80px]">
                            <svg viewBox="0 0 52 52" className="w-full h-full">
                              <circle cx="26" cy="26" r="22" fill="none" stroke="#27272a" strokeWidth="3.5" />
                              <circle cx="26" cy="26" r="22" fill="none" stroke="#10b981" strokeWidth="3.5"
                                strokeDasharray={`${2 * Math.PI * 22 * 0.85} ${2 * Math.PI * 22}`}
                                strokeLinecap="round" transform="rotate(-90 26 26)" />
                              <text x="26" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill="white">85</text>
                            </svg>
                          </div>
                          <div>
                            <p className="text-[15px] text-zinc-200 font-bold">Positive</p>
                            <p className="text-[12px] text-emerald-400 font-semibold">↑ 12%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/30 flex-1">
                        <p className="text-[12px] text-zinc-400 font-bold mb-3">Market Share</p>
                        <div className="flex items-center gap-4">
                          <div className="w-[72px] h-[72px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={marketShareData} dataKey="value" cx="50%" cy="50%" outerRadius={32} innerRadius={17} strokeWidth={0}>
                                  {marketShareData.map((_, i) => <Cell key={i} fill={MARKET_COLORS[i]} />)}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex-1 space-y-1.5">
                            {marketShareData.map((m, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full" style={{ background: MARKET_COLORS[i] }} />
                                  <span className="text-[11px] text-zinc-500">{m.name}</span>
                                </div>
                                <span className="text-[11px] text-zinc-300 font-bold">{m.value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <motion.section className="border-t border-zinc-800/80 bg-zinc-900/40 shrink-0"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <div className="w-full px-8 lg:px-16 py-6">
            <div className="grid grid-cols-5 gap-6">
              {[
                { icon: Globe,        value: '10K+',    label: 'Active Users'       },
                { icon: Search,       value: '50K+',    label: 'Queries Analyzed'   },
                { icon: CheckCircle2, value: '95%',     label: 'Accuracy Rate'      },
                { icon: Shield,       value: '99.9%',   label: 'Data Security'      },
                { icon: Eye,          value: '5 Years', label: 'Forecasting Depth'  },
              ].map((stat, i) => {
                const SIcon = stat.icon;
                return (
                  <motion.div key={i} className="flex items-center gap-5"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.06 }}>
                    <SIcon className="w-7 h-7 text-zinc-500 shrink-0" />
                    <div>
                      <p className="text-[26px] font-extrabold text-white leading-tight">{stat.value}</p>
                      <p className="text-[13px] text-zinc-500 font-medium">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-zinc-800/50 shrink-0 py-4">
          <div className="w-full px-8 lg:px-16 text-center">
            <p className="text-[12px] text-zinc-600">
              <span className="font-semibold text-zinc-500">CideDec</span>
              &nbsp;·&nbsp;Emotion-Aware AI · Bias Detection · 5-Year Forecasting · Decision Intelligence
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
