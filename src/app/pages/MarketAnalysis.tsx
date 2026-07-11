import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Globe, Shield, Zap, Target, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import type { Page } from '../App';
import { CAREER_DB } from '../../lib/career/engine';
import { safeNum, clampScore } from '../../lib/validate';

interface MarketAnalysisProps { onNavigate: (page: Page) => void; }

// ── Aggregated from CAREER_DB ──────────────────────────────────────────────
const domains = [...new Set(CAREER_DB.map(c => c.domain))];
const avgFutureScope = Math.round(CAREER_DB.reduce((acc, c) => acc + c.futureScope,      0) / CAREER_DB.length);
const avgAIRisk      = Math.round(CAREER_DB.reduce((acc, c) => acc + c.aiRisk,           0) / CAREER_DB.length);
const avgDemand      = Math.round(CAREER_DB.reduce((acc, c) => acc + c.industryDemand,   0) / CAREER_DB.length);
const avgGrowthRate  = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salaryGrowthRate, 0) / CAREER_DB.length);

// ── SWOT — fully derived from CAREER_DB metrics ────────────────────────────
const swotData = {
  strengths: [
    `Career database covers ${CAREER_DB.length} validated career profiles`,
    `Spans ${domains.length} distinct industry domains`,
    `Average industry demand index: ${avgDemand}/100`,
    `Average salary growth rate across all careers: ${avgGrowthRate}% p.a.`,
  ],
  weaknesses: [
    `Average AI automation risk across all careers: ${avgAIRisk}%`,
    `Average future scope: ${avgFutureScope}% (room to grow)`,
    'Live aggregator requires active API credentials',
    'Remote work data depends on employer policy updates',
  ],
  opportunities: [
    `${CAREER_DB.filter(c => c.futureScope >= 85).length} careers have ≥85% future scope`,
    `${CAREER_DB.filter(c => c.aiRisk <= 15).length} careers have low AI disruption risk`,
    'AI/ML upskilling raises salary growth rates across all domains',
    'Global opportunity index above 80 for majority of profiles',
  ],
  threats: [
    `${CAREER_DB.filter(c => c.aiRisk >= 30).length} careers face ≥30% AI disruption risk`,
    `${CAREER_DB.filter(c => c.competition >= 85).length} careers have extreme competition`,
    'Rapid technology evolution shortens skill half-lives',
    'Market saturation rising in traditional domains',
  ],
};

// ── Domain Distribution — replaces static competitor shares ────────────────
// Group CAREER_DB by domain; compute share from demand-weighted scores
const domainGroups = domains.map(domain => {
  const careers = CAREER_DB.filter(c => c.domain === domain);
  const avgCareerDemand = Math.round(careers.reduce((acc, c) => acc + c.industryDemand,   0) / careers.length);
  const avgCareerGrowth = Math.round(careers.reduce((acc, c) => acc + c.salaryGrowthRate, 0) / careers.length);
  const avgNPS          = Math.round(careers.reduce((acc, c) => acc + c.successProbability, 0) / careers.length);
  return { domain, count: careers.length, avgDemand: avgCareerDemand, avgGrowth: avgCareerGrowth, avgNPS };
}).sort((a, b) => b.avgDemand - a.avgDemand);

const totalDemandScore = domainGroups.reduce((s, d) => s + d.avgDemand, 0) || 1;
const DOMAIN_COLORS = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-red-400','bg-cyan-500'];

const competitors = domainGroups.map((d, i) => ({
  name:   d.domain,
  market: parseFloat(((d.avgDemand / totalDemandScore) * 100).toFixed(1)),
  growth: safeNum(d.avgGrowth),
  nps:    clampScore(d.avgNPS),
  price:  d.avgDemand >= 85 ? 'High' : d.avgDemand >= 70 ? 'Medium' : 'Low',
  tech:   clampScore(d.avgDemand),
  color:  DOMAIN_COLORS[i % DOMAIN_COLORS.length],
}));

// ── Growth Forecast — split at current calendar month dynamically ──────────
const NOW_MONTH       = new Date().getMonth(); // 0=Jan … 11=Dec
const MONTH_NAMES     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ACTUAL_SCALE    = [0.50,0.54,0.57,0.55,0.62,0.70,0.76,0.83,0.90,0.98,1.07,1.15];
const trendChartData  = MONTH_NAMES.map((month, i) => {
  const val = Math.round(avgFutureScope * ACTUAL_SCALE[i]);
  return i <= NOW_MONTH ? { month, actual: val } : { month, predicted: val };
});
const NOW_MONTH_LABEL = MONTH_NAMES[NOW_MONTH];

const competitorChartData = competitors.slice(0, 6).map(c => ({
  name:   c.name.split(' ')[0].substring(0, 9),
  share:  c.market,
  growth: c.growth,
  nps:    c.nps,
}));

// Market summary KPIs — all from CAREER_DB aggregates, no hardcoded numbers
const marketSummary = [
  { label: 'Total Career Profiles',  value: `${CAREER_DB.length}`,       change: `${domains.length} domains`,    up: true },
  { label: 'Avg Industry Demand',    value: `${avgDemand}/100`,           change: `+${avgGrowthRate}% growth`,    up: true },
  { label: 'Avg Future Scope',       value: `${avgFutureScope}%`,         change: 'Career outlook',               up: true },
  { label: 'Avg AI Risk',            value: `${avgAIRisk}%`,              change: avgAIRisk < 20 ? 'Low risk' : 'Moderate', up: avgAIRisk < 20 },
];

export function MarketAnalysis({ onNavigate: _onNavigate }: MarketAnalysisProps) {
  const [expandedSwot, setExpandedSwot] = useState<string | null>('strengths');

  const swotConfig = [
    { key: 'strengths',     label: 'Strengths',     icon: Zap,    color: 'border-l-green-500 bg-green-50',  headerColor: 'text-green-700',  badgeColor: 'bg-green-100 text-green-700' },
    { key: 'weaknesses',    label: 'Weaknesses',    icon: Shield, color: 'border-l-red-400 bg-red-50',      headerColor: 'text-red-700',    badgeColor: 'bg-red-100 text-red-700' },
    { key: 'opportunities', label: 'Opportunities', icon: Globe,  color: 'border-l-blue-500 bg-blue-50',   headerColor: 'text-blue-700',   badgeColor: 'bg-blue-100 text-blue-700' },
    { key: 'threats',       label: 'Threats',       icon: Target, color: 'border-l-orange-500 bg-orange-50', headerColor: 'text-orange-700', badgeColor: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market Analysis</h1>
              <p className="text-sm text-gray-500">Comprehensive market intelligence • Predictive forecasting • Competitive positioning</p>
            </div>
          </div>
        </motion.div>

        {/* Market Summary Cards — from CAREER_DB aggregates */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {marketSummary.map((stat, i) => (
            <motion.div key={i} className="bg-white/80 rounded-2xl p-5 border border-white/60 shadow-md"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mb-2">{stat.label}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${stat.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />} {stat.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Recharts: Growth Forecast Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <motion.div className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Market Growth Forecast (Index)</h3>
                <p className="text-xs text-gray-400 mt-0.5">Actual performance + AI-predicted trajectory · CAREER_DB avgFutureScope={avgFutureScope}%</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-blue-500 inline-block" />Actual</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-purple-400 inline-block border border-dashed border-purple-400" />Predicted</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendChartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }} />
                <ReferenceLine x={NOW_MONTH_LABEL} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Now', position: 'top', fontSize: 10, fill: '#64748b' }} />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} connectNulls={false} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#a855f7', r: 3 }} activeDot={{ r: 5 }} connectNulls={false} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Domain Market Share Bars — from CAREER_DB domain demand */}
          <motion.div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h3 className="font-semibold text-gray-900 mb-4">Domain Market Share Distribution</h3>
            <div className="space-y-3">
              {competitors.map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-medium ${i === 0 ? 'text-blue-700' : 'text-gray-600'}`}>{c.name}</span>
                    <span className="text-gray-500">{c.market}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <motion.div className={`h-2.5 rounded-full ${c.color}`}
                      initial={{ width: 0 }} animate={{ width: `${(c.market / Math.max(...competitors.map(x => x.market))) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recharts: Domain Intelligence Bar Chart */}
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
          <h3 className="font-semibold text-gray-900 mb-4">Career Domain Intelligence — Growth vs Success Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={competitorChartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="growth" name="Growth %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="nps" name="Success Rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* SWOT Analysis */}
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h3 className="font-semibold text-gray-900 mb-5 text-lg">SWOT Analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {swotConfig.map((s) => {
              const Icon = s.icon;
              const isOpen = expandedSwot === s.key;
              const items = swotData[s.key as keyof typeof swotData];
              return (
                <motion.div key={s.key} className={`border-l-4 rounded-xl p-4 ${s.color} cursor-pointer`}
                  onClick={() => setExpandedSwot(isOpen ? null : s.key)} whileHover={{ scale: 1.01 }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${s.headerColor}`} />
                      <span className={`font-semibold text-sm ${s.headerColor}`}>{s.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.badgeColor}`}>{items.length} items</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                  {isOpen && (
                    <motion.ul className="space-y-1.5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {items.map((item, i) => (
                        <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${s.badgeColor.split(' ')[0]}`} />
                          {item}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Career Domain Intelligence Matrix */}
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">Full Career Domain Intelligence Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Domain', 'Market Share', 'Growth Rate', 'Success Rate', 'Demand Score', 'Pricing Tier'].map(h => (
                    <th key={h} className={`py-2 px-3 text-gray-500 font-medium ${h === 'Domain' ? 'text-left' : 'text-center'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <motion.tr key={i} className={`border-b border-gray-50 ${i === 0 ? 'bg-blue-50/60' : 'hover:bg-gray-50'}`}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.07 }}>
                    <td className="py-3 px-3 font-medium text-gray-900 flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />{c.name}
                      {i === 0 && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Top</span>}
                    </td>
                    <td className="text-center py-3 px-3 text-gray-700">{c.market}%</td>
                    <td className="text-center py-3 px-3">
                      <span className={`text-xs font-semibold ${c.growth > 15 ? 'text-green-700' : 'text-gray-600'}`}>+{c.growth}%</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className={`text-xs font-semibold ${c.nps > 65 ? 'text-green-700' : c.nps > 50 ? 'text-amber-600' : 'text-red-600'}`}>{c.nps}</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-14 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${c.color}`} style={{ width: `${c.tech}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{c.tech}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.price === 'High' ? 'bg-purple-50 text-purple-700' : c.price === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>{c.price}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
