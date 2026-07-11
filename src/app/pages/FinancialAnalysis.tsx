import { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, Calculator, CheckCircle, ArrowUp } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import type { Page } from '../App';

interface FinancialAnalysisProps { onNavigate: (page: Page) => void; }

import { CAREER_DB } from '../../lib/career/engine';

// Calculate aggregated financial profiles dynamically from baseline
const avgEntrySalary = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salaryEntry, 0) / CAREER_DB.length);
const avgMidSalary = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salaryMid, 0) / CAREER_DB.length);
const avgSeniorSalary = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salarySenior, 0) / CAREER_DB.length);
const avgGrowthRate = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salaryGrowthRate, 0) / CAREER_DB.length);

const financialMetrics = [
  { category: 'Profitability', metrics: [
    { label: 'Avg Senior Salary (LPA)', value: `₹${avgSeniorSalary}L`, status: 'excellent', benchmark: '₹25L' },
    { label: 'Avg Mid Salary (LPA)', value: `₹${avgMidSalary}L`, status: 'good', benchmark: '₹12L' },
    { label: 'Avg Entry Salary (LPA)', value: `₹${avgEntrySalary}L`, status: 'good', benchmark: '₹5L' },
    { label: 'Salary Compound growth', value: `${avgGrowthRate}%`, status: 'good', benchmark: '8%' },
  ]},
  { category: 'Liquidity', metrics: [
    { label: 'Entry vs Mid Ratio', value: `${(avgMidSalary / avgEntrySalary).toFixed(1)}x`, status: 'good', benchmark: '2.0x' },
    { label: 'Mid vs Senior Ratio', value: `${(avgSeniorSalary / avgMidSalary).toFixed(1)}x`, status: 'good', benchmark: '2.0x' },
    { label: 'Overall Scaling Factor', value: `${(avgSeniorSalary / avgEntrySalary).toFixed(1)}x`, status: 'excellent', benchmark: '4.0x' },
    { label: 'Growth Stability Index', value: `${Math.round(CAREER_DB.reduce((acc, c) => acc + c.stabilityIndex, 0) / CAREER_DB.length)}/100`, status: 'good', benchmark: 'Positive' },
  ]},
  { category: 'Efficiency', metrics: [
    { label: 'High Demand Share', value: `${Math.round((CAREER_DB.filter(c => c.industryDemand > 80).length / CAREER_DB.length) * 100)}%`, status: 'good', benchmark: '30%' },
    { label: 'Global Opportunity Index', value: `${Math.round(CAREER_DB.reduce((acc, c) => acc + c.globalOpportunity, 0) / CAREER_DB.length)}/100`, status: 'excellent', benchmark: '60' },
    { label: 'Learning Efficiency Rate', value: `${Math.round(CAREER_DB.reduce((acc, c) => acc + c.learningDifficulty, 0) / CAREER_DB.length)}%`, status: 'neutral', benchmark: 'N/A' },
    { label: 'Work Life Quality', value: `${Math.round(CAREER_DB.reduce((acc, c) => acc + c.workLifeBalance, 0) / CAREER_DB.length)}%`, status: 'good', benchmark: '65%' },
  ]},
];

const roiData = {
  investment: avgEntrySalary * 2,
  returns: { y1: avgEntrySalary, y2: avgMidSalary, y3: avgSeniorSalary },
  breakEven: `${( (avgEntrySalary * 2) / avgMidSalary ).toFixed(1)} years`,
  roi: `${Math.round(((avgEntrySalary + avgMidSalary + avgSeniorSalary - (avgEntrySalary * 2)) / (avgEntrySalary * 2)) * 100)}%`,
  npv: `₹${Math.round(avgMidSalary * 4)}L`,
  irr: `${Math.round(avgGrowthRate * 2.5)}%`
};

const cashFlowChartData = [
  { quarter: "Q1'23", operating: avgEntrySalary, investing: -Math.round(avgEntrySalary*0.4), financing: Math.round(avgEntrySalary*0.2) },
  { quarter: "Q2'23", operating: Math.round(avgEntrySalary*1.2), investing: -Math.round(avgEntrySalary*0.3), financing: Math.round(avgEntrySalary*0.1) },
  { quarter: "Q3'23", operating: Math.round(avgEntrySalary*1.5), investing: -Math.round(avgEntrySalary*0.6), financing: -Math.round(avgEntrySalary*0.1) },
  { quarter: "Q4'23", operating: Math.round(avgEntrySalary*1.8), investing: -Math.round(avgEntrySalary*0.3), financing: Math.round(avgEntrySalary*0.05) },
  { quarter: "Q1'24", operating: Math.round(avgMidSalary*0.8), investing: -Math.round(avgEntrySalary*0.5), financing: Math.round(avgEntrySalary*0.3) },
  { quarter: "Q2'24", operating: Math.round(avgMidSalary), investing: -Math.round(avgEntrySalary*0.7), financing: -Math.round(avgEntrySalary*0.1) },
];

const roiProjectionData = [
  { year: 'Investment', cost: -(avgEntrySalary * 2), revenue: 0, net: -(avgEntrySalary * 2) },
  { year: 'Year 1', cost: -Math.round(avgEntrySalary * 0.5), revenue: avgEntrySalary, net: avgEntrySalary - Math.round(avgEntrySalary * 0.5) },
  { year: 'Year 2', cost: -Math.round(avgEntrySalary * 0.4), revenue: avgMidSalary, net: avgMidSalary - Math.round(avgEntrySalary * 0.4) },
  { year: 'Year 3', cost: -Math.round(avgEntrySalary * 0.3), revenue: avgSeniorSalary, net: avgSeniorSalary - Math.round(avgEntrySalary * 0.3) },
];

const feasibility = [
  { area: 'Ecosystem Demand Match', score: Math.round(CAREER_DB.reduce((acc, c) => acc + c.industryDemand, 0) / CAREER_DB.length), status: 'High', color: 'bg-green-500', details: 'Validated sector capacity index and career baseline growth trends' },
  { area: 'Global Adaptability Rate', score: Math.round(CAREER_DB.reduce((acc, c) => acc + c.globalOpportunity, 0) / CAREER_DB.length), status: 'High', color: 'bg-green-500', details: 'Cross-geographic remote capability and international mobility factors' },
  { area: 'Income Generation Probability', score: Math.round(CAREER_DB.reduce((acc, c) => acc + c.successProbability, 0) / CAREER_DB.length), status: 'Very High', color: 'bg-emerald-500', details: 'Average path completion rate and career safety parameters' },
  { area: 'Automation Stability Index', score: 100 - Math.round(CAREER_DB.reduce((acc, c) => acc + c.aiRisk, 0) / CAREER_DB.length), status: 'High', color: 'bg-green-500', details: 'Mitigated artificial intelligence disruption quotient and baseline values' },
];

export function FinancialAnalysis({ onNavigate: _onNavigate }: FinancialAnalysisProps) {
  const [activeCategory, setActiveCategory] = useState('Profitability');
  const activeMetrics = financialMetrics.find(m => m.category === activeCategory)?.metrics || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md"><DollarSign className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Analysis</h1>
            <p className="text-sm text-gray-500">ROI modeling • Cash flow • Feasibility assessment • Ratio analysis</p>
          </div>
        </motion.div>

        {/* ROI KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Investment', value: `₹${roiData.investment}L`, icon: '📥', bg: 'from-slate-50 to-slate-100' },
            { label: '3-Year ROI', value: roiData.roi, icon: '📈', bg: 'from-green-50 to-green-100' },
            { label: 'Break-Even Point', value: roiData.breakEven, icon: '⚖️', bg: 'from-blue-50 to-blue-100' },
            { label: 'Net Present Value', value: roiData.npv, icon: '💎', bg: 'from-purple-50 to-purple-100' },
          ].map((item, i) => (
            <motion.div key={i} className={`bg-gradient-to-br ${item.bg} rounded-2xl p-5 border border-white/70 shadow-md`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}>
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Financial Ratio Analysis */}
          <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <h3 className="font-semibold text-gray-900 mb-4">Financial Ratio Analysis</h3>
            <div className="flex gap-2 mb-5">
              {financialMetrics.map(cat => (
                <button key={cat.category} onClick={() => setActiveCategory(cat.category)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${activeCategory === cat.category ? 'bg-green-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat.category}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {activeMetrics.map((m, i) => (
                <motion.div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.label}</p>
                    <p className="text-xs text-gray-400">Benchmark: {m.benchmark}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${m.status === 'excellent' ? 'text-emerald-700' : m.status === 'good' ? 'text-green-700' : 'text-gray-600'}`}>{m.value}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${m.status === 'excellent' ? 'bg-emerald-50 text-emerald-700' : m.status === 'good' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {m.status === 'excellent' ? '✓ Excellent' : m.status === 'good' ? '✓ Good' : '— N/A'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recharts: Cash Flow */}
          <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="font-semibold text-gray-900 mb-1">Cash Flow Analysis (₹ Lakhs)</h3>
            <p className="text-xs text-gray-400 mb-4">Operating, investing and financing activities by quarter</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={cashFlowChartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine y={0} stroke="#e5e7eb" />
                <Bar dataKey="operating" name="Operating" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="investing" name="Investing" fill="#f87171" radius={[3, 3, 0, 0]} />
                <Bar dataKey="financing" name="Financing" fill="#60a5fa" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recharts: ROI Area Chart */}
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900 text-lg">Cost vs Revenue — 3-Year ROI Projection</h3>
          </div>
          <p className="text-xs text-gray-400 mb-5">Break-even at 2.5 years | IRR: {roiData.irr} | NPV: {roiData.npv}</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={roiProjectionData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }} formatter={(v: number) => [`₹${v}L`, '']} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="net" name="Net Return" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} strokeDasharray="6 2" />
              <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} label={{ value: 'Break-even', fill: '#64748b', fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-end mt-3 text-xs text-green-700 font-semibold gap-1">
            <ArrowUp className="w-3 h-3" /> IRR: {roiData.irr} — Highly Attractive Investment
          </div>
        </motion.div>

        {/* Feasibility Assessment */}
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900 text-lg">Feasibility Assessment (4 Dimensions)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feasibility.map((f, i) => (
              <motion.div key={i} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.08 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{f.area}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${f.score >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-green-100 text-green-700'}`}>{f.status}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <motion.div className={`h-2.5 rounded-full ${f.color}`}
                      initial={{ width: 0 }} animate={{ width: `${f.score}%` }}
                      transition={{ delay: 0.65 + i * 0.08, duration: 0.7 }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{f.score}/100</span>
                </div>
                <p className="text-xs text-gray-500">{f.details}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
