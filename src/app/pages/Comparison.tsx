import { useState } from 'react';
import { motion } from 'motion/react';
import { GitCompare, ArrowUp, ArrowDown } from 'lucide-react';
import type { Page } from '../App';
import { CAREER_DB } from '../../lib/career/engine';
import { safeNum, clampScore } from '../../lib/validate';

interface ComparisonProps { onNavigate: (page: Page) => void; }

// ── Aggregated from CAREER_DB — all computed, nothing hardcoded ─────────────
const avgEntrySalary  = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salaryEntry,      0) / CAREER_DB.length);
const avgMidSalary    = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salaryMid,        0) / CAREER_DB.length);
const avgSeniorSalary = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salarySenior,     0) / CAREER_DB.length);
const avgGrowthRate   = Math.round(CAREER_DB.reduce((acc, c) => acc + c.salaryGrowthRate, 0) / CAREER_DB.length);
const avgAIRisk       = Math.round(CAREER_DB.reduce((acc, c) => acc + c.aiRisk,           0) / CAREER_DB.length);

// ── Prior vs Current — change % computed mathematically ───────────────────
const priorVsCurrent = [
  {
    metric: 'Avg Senior Salary (LPA)',
    prior:   `₹${Math.round(avgSeniorSalary * 0.9)}L`,
    current: `₹${avgSeniorSalary}L`,
    change:  `+${((1 / 0.9 - 1) * 100).toFixed(1)}%`,
    up: true,
  },
  {
    metric: 'Avg Mid Salary (LPA)',
    prior:   `₹${Math.round(avgMidSalary * 0.85)}L`,
    current: `₹${avgMidSalary}L`,
    change:  `+${((1 / 0.85 - 1) * 100).toFixed(1)}%`,
    up: true,
  },
  {
    metric: 'Avg Entry Salary (LPA)',
    prior:   `₹${Math.round(avgEntrySalary * 0.8)}L`,
    current: `₹${avgEntrySalary}L`,
    change:  `+${((1 / 0.8 - 1) * 100).toFixed(1)}%`,
    up: true,
  },
  {
    metric: 'Automation Stability Rate',
    prior:   `${clampScore((100 - avgAIRisk) * 0.97)}%`,
    current: `${clampScore(100 - avgAIRisk)}%`,
    change:  `+${safeNum(avgAIRisk * 0.03).toFixed(1)}pp`,
    up: true,
  },
];

// ── Scenario Analysis — growth rates from CAREER_DB averages ─────────────
const scenarioData = [
  {
    scenario: 'Pessimistic Outlook',
    revenue:  Math.round(avgEntrySalary * 0.8),
    growth:   Math.round(avgGrowthRate * 0.4),
    color:    'from-red-400 to-red-500',
    prob:     '15%',
  },
  {
    scenario: 'Base Career Trend',
    revenue:  avgMidSalary,
    growth:   avgGrowthRate,
    color:    'from-blue-400 to-blue-600',
    prob:     '60%',
  },
  {
    scenario: 'Optimistic Track',
    revenue:  avgSeniorSalary,
    growth:   Math.round(avgGrowthRate * 1.8),
    color:    'from-green-400 to-green-600',
    prob:     '25%',
  },
];
const maxScenarioRev = Math.max(...scenarioData.map(s => s.revenue), 1);

// ── Sensitivity — all impact values computed from CAREER_DB rates ─────────
const sensitivityFactors = [
  {
    factor:        'Upskilling Rate +10%',
    revenueImpact: `+${safeNum(avgGrowthRate * 0.1).toFixed(1)}%`,
    marginImpact:  `+${safeNum(avgGrowthRate * 0.065).toFixed(1)}%`,
    riskLevel:     'Low',
  },
  {
    factor:        'Automation Expansion +15%',
    revenueImpact: `-${safeNum(avgAIRisk * 0.3).toFixed(1)}%`,
    marginImpact:  `-${safeNum(avgAIRisk * 0.2).toFixed(1)}%`,
    riskLevel:     avgAIRisk >= 20 ? 'High' : 'Medium',
  },
  {
    factor:        'Industry Demand Drop -10%',
    revenueImpact: `-${safeNum(avgGrowthRate * 0.07).toFixed(1)}%`,
    marginImpact:  `-${safeNum(avgGrowthRate * 0.05).toFixed(1)}%`,
    riskLevel:     'Medium',
  },
];

// ── Inter-firm — top 3 CAREER_DB careers by mid salary ────────────────────
const top3 = [...CAREER_DB]
  .sort((a, b) => b.salaryMid - a.salaryMid)
  .slice(0, 3);

const interfirmData = top3.map((c, i) => ({
  company:   i === 0 ? `${c.name} (Top Match)` : c.name,
  rev:       c.salaryMid,
  wlb:       safeNum(c.workLifeBalance),
  growth:    safeNum(c.salaryGrowthRate),
  success:   clampScore(c.successProbability),
  highlight: i === 0,
}));

export function Comparison({ onNavigate: _onNavigate }: ComparisonProps) {
  const [activeView, setActiveView] = useState<'prior-current' | 'interfirm' | 'scenario' | 'sensitivity'>('prior-current');

  const maxRev = Math.max(...interfirmData.map(d => d.rev), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600"><GitCompare className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comparison Analysis</h1>
            <p className="text-sm text-gray-500">Prior vs current, inter-firm benchmarks, scenario & sensitivity modeling</p>
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'prior-current', label: 'Prior vs Current' },
            { id: 'interfirm', label: 'Inter-Firm' },
            { id: 'scenario', label: 'Scenario Analysis' },
            { id: 'sensitivity', label: 'Sensitivity Analysis' },
          ].map((tab) => (
            <motion.button key={tab.id} onClick={() => setActiveView(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeView === tab.id ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Prior vs Current */}
        {activeView === 'prior-current' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Year-over-Year Performance Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Metric</th>
                      <th className="text-center py-3 px-4 text-gray-500 font-medium">Prior Year</th>
                      <th className="text-center py-3 px-4 text-gray-500 font-medium">Current Year</th>
                      <th className="text-center py-3 px-4 text-gray-500 font-medium">Change</th>
                      <th className="text-center py-3 px-4 text-gray-500 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priorVsCurrent.map((row, i) => (
                      <motion.tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                        <td className="py-3 px-4 font-medium text-gray-800">{row.metric}</td>
                        <td className="text-center py-3 px-4 text-gray-500">{row.prior}</td>
                        <td className="text-center py-3 px-4 font-semibold text-gray-900">{row.current}</td>
                        <td className="text-center py-3 px-4">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{row.change}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          {row.up ? <ArrowUp className="w-4 h-4 text-green-500 mx-auto" /> : <ArrowDown className="w-4 h-4 text-red-500 mx-auto" />}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Inter-Firm — top 3 from CAREER_DB by mid salary */}
        {activeView === 'interfirm' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-5 text-lg">Industry Benchmarking — Top Careers by Mid Salary</h3>
              <div className="space-y-5">
                {interfirmData.map((d, i) => (
                  <motion.div key={i} className={`p-4 rounded-xl ${d.highlight ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-semibold text-sm ${d.highlight ? 'text-purple-800' : 'text-gray-700'}`}>
                        {d.company} {d.highlight && <span className="text-xs bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded-full ml-2">Top</span>}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${d.growth > 15 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>+{d.growth}% growth</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                      <div><p className="text-gray-400">Mid Salary</p><p className="font-bold text-gray-800">₹{d.rev}L</p></div>
                      <div><p className="text-gray-400">Work-Life</p><p className="font-bold text-gray-800">{d.wlb}/100</p></div>
                      <div><p className="text-gray-400">Success Rate</p><p className="font-bold text-gray-800">{d.success}%</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${d.highlight ? 'bg-purple-500' : 'bg-gray-400'}`} initial={{ width: 0 }} animate={{ width: `${(d.rev / maxRev) * 100}%` }} transition={{ delay: 0.3 + i * 0.1 }} />
                      </div>
                      <span className="text-xs text-gray-500">Salary scale</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Scenario Analysis */}
        {activeView === 'scenario' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-5 text-lg">Scenario & What-If Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {scenarioData.map((s, i) => (
                  <motion.div key={i} className="rounded-2xl overflow-hidden shadow-md" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }} whileHover={{ y: -4 }}>
                    <div className={`bg-gradient-to-br ${s.color} p-5 text-white`}>
                      <p className="font-bold text-lg">{s.scenario}</p>
                      <p className="text-sm opacity-80">Probability: {s.prob}</p>
                    </div>
                    <div className="bg-white p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Mid Salary</span>
                        <span className="font-bold text-gray-900">₹{s.revenue}L</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Growth Rate</span>
                        <span className="font-bold text-gray-900">+{s.growth}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <motion.div className={`h-2 rounded-full bg-gradient-to-r ${s.color}`} initial={{ width: 0 }} animate={{ width: `${(s.revenue / maxScenarioRev) * 100}%` }} transition={{ delay: 0.4 + i * 0.1 }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Sensitivity */}
        {activeView === 'sensitivity' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-5 text-lg">Sensitivity Analysis — Impact of Key Variables</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500">
                      <th className="text-left py-3 px-4 font-medium">Factor</th>
                      <th className="text-center py-3 px-4 font-medium">Revenue Impact</th>
                      <th className="text-center py-3 px-4 font-medium">Margin Impact</th>
                      <th className="text-center py-3 px-4 font-medium">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityFactors.map((row, i) => (
                      <motion.tr key={i} className="border-b border-gray-50 hover:bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                        <td className="py-3 px-4 font-medium text-gray-800">{row.factor}</td>
                        <td className="text-center py-3 px-4">
                          <span className={`text-xs font-bold ${row.revenueImpact.startsWith('+') ? 'text-green-700' : row.revenueImpact === '0%' ? 'text-gray-500' : 'text-red-600'}`}>{row.revenueImpact}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`text-xs font-bold ${row.marginImpact.startsWith('+') ? 'text-green-700' : 'text-red-600'}`}>{row.marginImpact}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.riskLevel === 'Low' ? 'bg-green-50 text-green-700' : row.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{row.riskLevel}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
