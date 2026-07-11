import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, DollarSign, Users, Target, AlertTriangle,
  BarChart3, Activity, ArrowUp, ArrowDown, RefreshCw, ArrowRight,
  Zap, Globe, ShieldCheck
} from 'lucide-react';
import type { Page } from '../App';
import { api } from '../../lib/api';
import { safeNum, clampScore, avgAtsScore, buildMonthlyChart, buildDomainDistribution } from '../../lib/validate';

interface DashboardProps { onNavigate: (page: Page) => void; }

interface DashStats {
  totalSearches: number;
  savedAnalyses: number;
  atsReports: number;
  streak: number;
  level: string;
  score: number;
  badgeCount: number;
  recentQueries: any[];
  monthlyTrends: number[] | null;
  domainDist: { domain: string; count: number; pct: number }[];
  atsAvgScore: number;
  financialHealth: number;
  marketPosition: number;
  operationalHealth: number;
}

const EMPTY_STATS: DashStats = {
  totalSearches: 0, savedAnalyses: 0, atsReports: 0,
  streak: 0, level: 'beginner', score: 0, badgeCount: 0,
  recentQueries: [], monthlyTrends: null, domainDist: [],
  atsAvgScore: 0, financialHealth: 0, marketPosition: 0, operationalHealth: 0,
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [histRes, savedRes, atsRes, gamRes] = await Promise.all([
        api.get<any>('/api/history'),
        api.get<any>('/api/saved'),
        api.get<any>('/api/ats'),
        api.get<any>('/api/gamification'),
      ]);

      const history: any[] = histRes?.data?.data ?? histRes?.data ?? [];
      const saved: any[]   = savedRes?.data?.data ?? savedRes?.data ?? [];
      const ats: any[]     = atsRes?.data?.data ?? atsRes?.data ?? [];
      const gam: any       = gamRes?.data?.data ?? gamRes?.data ?? {};

      // Monthly chart — null triggers empty state (no fabrication)
      const monthlyTrends = buildMonthlyChart(history);

      // Domain distribution from real search records
      const domainDist = buildDomainDistribution(history);

      // Gamification — all from SQLite gamification table
      const streak    = safeNum(gam.streak, 0);
      const score     = safeNum(gam.total_score, 0);
      const level     = typeof gam.level === 'string' ? gam.level : 'beginner';
      let badges: any[] = [];
      try { badges = Array.isArray(gam.badges) ? gam.badges : JSON.parse(gam.badges || '[]'); }
      catch { badges = []; }
      const badgeCount = badges.length;

      // ATS average computed from real report scores in ats_reports table
      const atsAvg = avgAtsScore(ats);

      // Health KPIs — all computed from real SQLite data, never hardcoded
      const financialHealth   = clampScore(atsAvg > 0 ? atsAvg : ats.length > 0 ? 50 : 0);
      const marketPosition    = clampScore(streak * 4 + badgeCount * 10);
      const operationalHealth = clampScore(history.length * 3 + saved.length * 7);

      setStats({
        totalSearches: history.length,
        savedAnalyses: saved.length,
        atsReports: ats.length,
        streak, level, score, badgeCount,
        recentQueries: history.slice(0, 5),
        monthlyTrends,
        domainDist,
        atsAvgScore: atsAvg,
        financialHealth,
        marketPosition,
        operationalHealth,
      });
    } catch {
      // leave EMPTY_STATS — empty states render, never fabricated data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // KPI cards — every value from SQLite via /api/* endpoints
  const kpis = [
    {
      label: 'Total Searches', value: stats.totalSearches.toString(),
      change: stats.totalSearches > 0 ? `+${stats.totalSearches}` : '0',
      up: stats.totalSearches > 0, icon: Users, color: 'from-purple-400 to-purple-600',
      sub: 'Total AI decision queries · query_history',
    },
    {
      label: 'Saved Analyses', value: stats.savedAnalyses.toString(),
      change: stats.savedAnalyses > 0 ? `+${stats.savedAnalyses}` : '0',
      up: stats.savedAnalyses > 0, icon: Target, color: 'from-blue-400 to-blue-600',
      sub: 'Saved profiles & models · saved_analyses',
    },
    {
      label: 'ATS Reports', value: stats.atsReports.toString(),
      change: stats.atsReports > 0 ? `+${stats.atsReports}` : '0',
      up: stats.atsReports > 0, icon: DollarSign, color: 'from-green-400 to-emerald-600',
      sub: 'Evaluated resumes · ats_reports',
    },
    {
      label: 'Streak Score', value: `${stats.streak} Days`,
      change: `+${stats.streak}d`, up: stats.streak > 0,
      icon: AlertTriangle, color: 'from-orange-400 to-orange-600',
      sub: `${stats.level.toUpperCase()} Level · ${stats.score} XP`,
    },
  ];

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const revenueData = stats.monthlyTrends;
  const maxRev = revenueData ? Math.max(...revenueData, 1) : 1;

  // Quick stats — all from SQLite, atsAvgScore from ats_reports.score
  const quickStats = [
    { label: 'XP Points',       value: stats.score.toString(),                                 icon: '💎', change: `Level: ${stats.level}` },
    { label: 'Badges Earned',   value: stats.badgeCount.toString(),                            icon: '⭐', change: 'Unlocked achievements' },
    { label: 'Streak',          value: `${stats.streak} days`,                                 icon: '📈', change: 'Learning Streak' },
    { label: 'ATS Average',     value: stats.atsAvgScore > 0 ? `${stats.atsAvgScore}%` : '—', icon: '📊', change: stats.atsReports > 0 ? `${stats.atsReports} reports` : 'No reports yet' },
    { label: 'Saved Scenarios', value: stats.savedAnalyses.toString(),                         icon: '⚖️', change: 'Decisions modeled' },
    { label: 'Recent Interest', value: stats.recentQueries[0]?.domain || '—',                 icon: '🎯', change: 'Top Sector' },
  ];

  // Domain pie — built from real history.domain distribution, empty state if no searches
  const TOP_DOMAINS = 5;
  const pieDomains = stats.domainDist.slice(0, TOP_DOMAINS);
  const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const totalDomainCount = pieDomains.reduce((s, d) => s + d.count, 0) || 1;
  const C = 2 * Math.PI * 45;
  let pieOffset = 0;

  // Health sections — scores from real SQLite data, never hardcoded strings
  const healthSections = [
    {
      label: 'ATS Performance', score: stats.financialHealth,
      color: 'from-green-400 to-emerald-600',
      items: [
        `Avg Resume Score: ${stats.atsAvgScore > 0 ? stats.atsAvgScore + '%' : 'No reports yet'}`,
        `Total ATS Reports: ${stats.atsReports}`,
        `Status: ${stats.financialHealth >= 70 ? 'Excellent' : stats.financialHealth >= 40 ? 'Good' : 'Getting Started'}`,
      ],
    },
    {
      label: 'Learning Progress', score: stats.marketPosition,
      color: 'from-blue-400 to-blue-600',
      items: [
        `Streak: ${stats.streak} day${stats.streak !== 1 ? 's' : ''}`,
        `Badges: ${stats.badgeCount} earned`,
        `Level: ${stats.level.charAt(0).toUpperCase() + stats.level.slice(1)}`,
      ],
    },
    {
      label: 'Platform Activity', score: stats.operationalHealth,
      color: 'from-purple-400 to-purple-600',
      items: [
        `Searches: ${stats.totalSearches} queries`,
        `Saved Analyses: ${stats.savedAnalyses}`,
        `XP Earned: ${stats.score} points`,
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Business Dashboard</h1>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              {loading ? 'Loading...' : 'Real-time analytics • Updated just now'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 shadow-sm"
              whileHover={{ scale: 1.02 }} animate={refreshing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.6 }}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </motion.button>
            <motion.button onClick={() => onNavigate('insights')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md"
              whileHover={{ scale: 1.03 }}>
              <Activity className="w-4 h-4" /> AI Insights <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color}`}><Icon className="w-5 h-5 text-white" /></div>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${kpi.up ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
                <p className="text-xs text-gray-400">{kpi.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {quickStats.map((s, i) => (
            <motion.div key={i} className="bg-white/70 rounded-xl p-3 border border-white/60 shadow-sm text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.07 }} whileHover={{ y: -2 }}>
              <div className="text-lg mb-0.5">{s.icon}</div>
              <p className="text-sm font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <span className="text-xs text-green-700 font-semibold">{s.change}</span>
            </motion.div>
          ))}
        </div>

        {/* Monthly Chart + Domain Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Monthly Search Activity</h3>
                <p className="text-xs text-gray-400">Career searches per month — sourced from query_history table</p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{new Date().getFullYear()} — FY</span>
            </div>
            {revenueData === null ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <BarChart3 className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 font-medium">Start exploring careers to build your dashboard.</p>
                <button onClick={() => onNavigate('home')} className="mt-3 text-xs text-blue-500 underline">Explore Careers →</button>
              </div>
            ) : (
              <div className="flex items-end gap-2 h-48">
                {revenueData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs font-semibold bg-gray-900 text-white px-2 py-1 rounded-lg whitespace-nowrap z-10">
                      {val} search{val !== 1 ? 'es' : ''}
                    </div>
                    <motion.div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-purple-500 cursor-pointer hover:from-blue-400 hover:to-purple-400 transition-colors"
                      initial={{ height: 0 }} animate={{ height: val > 0 ? `${(val / maxRev) * 160}px` : '3px' }}
                      transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 80 }}
                      whileHover={{ scale: 1.05 }} />
                    <span className="text-xs text-gray-400">{months[i]}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="font-semibold text-gray-900 mb-4">Career Domain Distribution</h3>
            {pieDomains.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Globe className="w-8 h-8 text-gray-200 mb-2" />
                <p className="text-xs text-gray-400">Search careers to see your domain distribution</p>
              </div>
            ) : (
              <>
                <div className="relative flex items-center justify-center mb-4">
                  <svg viewBox="0 0 120 120" className="w-36 h-36">
                    {pieDomains.map((d, i) => {
                      const pct = (d.count / totalDomainCount) * 100;
                      const dash = (pct / 100) * C;
                      const rot = -90 + (pieOffset / 100) * 360;
                      pieOffset += pct;
                      return (
                        <motion.circle key={d.domain} cx="60" cy="60" r="45" fill="none"
                          stroke={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth="18"
                          strokeDasharray={`${dash} ${C - dash}`}
                          transform={`rotate(${rot} 60 60)`}
                          initial={{ strokeDasharray: `0 ${C}` }}
                          animate={{ strokeDasharray: `${dash} ${C - dash}` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }} />
                      );
                    })}
                    <text x="60" y="56" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1f2937">{pieDomains[0]?.pct}%</text>
                    <text x="60" y="68" textAnchor="middle" fontSize="7" fill="#6b7280">{pieDomains[0]?.domain?.substring(0, 8)}</text>
                  </svg>
                </div>
                <div className="space-y-1.5">
                  {pieDomains.map((d, i) => (
                    <div key={d.domain} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-gray-600">{d.domain}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Health Indicators — all values from SQLite */}
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />Business Health Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {healthSections.map((h, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">{h.label}</span>
                  <span className="text-lg font-bold text-gray-900">{h.score}<span className="text-xs text-gray-400">/100</span></span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <motion.div className={`h-2 rounded-full bg-gradient-to-r ${h.color}`} initial={{ width: 0 }} animate={{ width: `${h.score}%` }} transition={{ delay: 0.7 + i * 0.1 }} />
                </div>
                {h.items.map((item, j) => (
                  <p key={j} className="text-xs text-gray-600 flex items-center gap-1"><span className="text-green-500">✓</span>{item}</p>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Deep Market Analysis', page: 'market' as Page, desc: 'Trends, SWOT, Competitor Matrix, Forecasts', icon: TrendingUp, gradient: 'from-blue-50 to-blue-100', iconColor: 'text-blue-600', border: 'border-blue-200' },
            { label: 'Financial Deep Dive', page: 'financial' as Page, desc: 'ROI, Cash Flow, Feasibility, Ratios', icon: DollarSign, gradient: 'from-green-50 to-green-100', iconColor: 'text-green-600', border: 'border-green-200' },
            { label: 'Comparative Analysis', page: 'comparison' as Page, desc: 'Prior vs Current, Benchmarks, Scenarios', icon: BarChart3, gradient: 'from-purple-50 to-purple-100', iconColor: 'text-purple-600', border: 'border-purple-200' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={i} onClick={() => onNavigate(card.page)}
                className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 border ${card.border} cursor-pointer hover:shadow-lg transition-all`}
                whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                <Icon className={`w-8 h-8 ${card.iconColor} mb-3`} />
                <h4 className="font-semibold text-gray-900 mb-1">{card.label}</h4>
                <p className="text-xs text-gray-500 mb-3">{card.desc}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-700">Explore <ArrowRight className="w-3 h-3" /></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
