/* ═══════════════════════════════════════════════════════════
   CareerIntelligenceModal — Multi-dimensional Career, Location,
   and Startup Intelligence Suite.
   Glassmorphism, beautiful tabs, animated graphs, and futuristic SaaS design.
   ═══════════════════════════════════════════════════════════ */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Briefcase, Globe, Target, Shield, Rocket, TrendingUp,
  MapPin, HelpCircle, Building2, Landmark, Compass, Award, AlertTriangle, ArrowRight, Zap, Info
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  generateLocationIntelligence,
  type CareerLocationIntelligence,
  type LocationRecommendation,
  type SuitableJob,
  type LaunchCity,
  type AIRiskFactor
} from '../../lib/career/locationEngine';
import type { ParsedResume } from '../../lib/ats/analyzer';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedResume: ParsedResume;
}

const TABS = [
  { id: 'jobs', label: 'Suitable Jobs', icon: Briefcase },
  { id: 'locations', label: 'Location Analytics', icon: Globe },
  { id: 'startup', label: 'Startup & Venture', icon: Rocket },
  { id: 'future', label: 'AI Risk & Future', icon: Shield },
  { id: 'comparison', label: 'Regional Comparison', icon: TrendingUp },
];

export function CareerIntelligenceModal({ isOpen, onClose, parsedResume }: ModalProps) {
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedCity, setSelectedCity] = useState<LocationRecommendation | null>(null);

  if (!isOpen) return null;

  // Calculate intelligence data based on the loaded resume
  const intelData = generateLocationIntelligence(parsedResume);

  const getSignalBadge = (signal: 'green' | 'orange' | 'red') => {
    const configs = {
      green: { text: 'Best Growth Opportunity', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      orange: { text: 'Moderate Potential', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      red: { text: 'High Risk / Weak Opportunity', bg: 'bg-red-500/10 text-red-400 border-red-500/30' }
    };
    const current = configs[signal];
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${current.bg}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {current.text}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          className="relative bg-zinc-950/90 border border-zinc-800 rounded-3xl w-full max-w-[1150px] h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {/* Header background glow */}
          <div className="absolute top-0 left-1/4 w-[50%] h-[150px] bg-gradient-to-b from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-900 relative z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-[18px] font-black text-white tracking-tight">AI Career & Location Intelligence OS</h2>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Custom analysis mapping for {parsedResume.fileName}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-900/60 bg-zinc-950/40 px-6 overflow-x-auto gap-2 shrink-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-[12px] font-bold border-b-2 transition-all shrink-0 ${
                    isActive
                      ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Modal Content Space */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#070708] relative">
            
            {/* TABS CONTAINER */}
            <div className="h-full">
              {/* TAB 1: SUITABLE JOBS */}
              {activeTab === 'jobs' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md">
                    <h3 className="text-[14px] font-extrabold text-white mb-1 flex items-center gap-2">
                      <Briefcase className="w-4.5 h-4.5 text-amber-400" /> Best Jobs Based on Resume
                    </h3>
                    <p className="text-[12px] text-zinc-500">
                      Our intelligence engine matched your skills with global hiring databases to identify roles where your hiring probability is highest.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {intelData.suitableJobs.map((job, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                      >
                        {/* Hover border glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-500">{job.industry}</span>
                            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {job.probability}% match
                            </span>
                          </div>

                          <h4 className="text-[15px] font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{job.role}</h4>
                          
                          <div className="space-y-2 mt-4 text-[12px]">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Work Type</span>
                              <span className="text-zinc-300 font-semibold">{job.workType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Estimated Salary</span>
                              <span className="text-amber-400 font-bold">{job.salaryRange}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-zinc-900/80 pt-4 mt-5">
                          <p className="text-[10px] font-extrabold text-zinc-500 mb-2 uppercase tracking-wide">High-Hiring Companies</p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.companies.map((c, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Future Safe Careers */}
                  <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5">
                    <h4 className="text-[13px] font-extrabold text-white mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" /> Future-Safe Alternative Career Roles
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {intelData.futureSafeCareers.map((car, idx) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl flex items-center justify-between">
                          <span className="text-[12px] font-bold text-zinc-300">{car}</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: LOCATION ANALYTICS */}
              {activeTab === 'locations' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                  
                  {/* Left Column: Location List */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
                      <h3 className="text-[14px] font-extrabold text-white mb-1 flex items-center gap-2">
                        <MapPin className="w-4.5 h-4.5 text-amber-400 animate-bounce" /> Best Locations for Career Growth
                      </h3>
                      <p className="text-[12px] text-zinc-500">
                        Analyzing your specific skill stack, local salary trends, work-life balances, and living indexes to determine high-growth hubs.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {intelData.locations.map((loc, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedCity(loc)}
                          className={`bg-zinc-900/30 border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer transition-all ${
                            selectedCity?.city === loc.city ? 'border-amber-500 bg-amber-500/[0.02]' : 'border-zinc-900 hover:border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-zinc-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-[14px] font-bold text-white">{loc.city}</h4>
                                <span className="text-[10px] text-zinc-500">{loc.state}, {loc.country}</span>
                              </div>
                              <p className="text-[11px] text-zinc-500 mt-1 max-w-[450px] line-clamp-1">{loc.reason}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-3 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t border-zinc-900/40 md:border-0 pt-2.5 md:pt-0">
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-500 uppercase block font-medium">Match Index</span>
                              <span className="text-[14px] font-black text-amber-400">{loc.score}/100</span>
                            </div>
                            {getSignalBadge(loc.signal)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Detailed Location Panel */}
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between">
                    {selectedCity ? (
                      <div className="space-y-6">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-extrabold">Selected Hub</span>
                          <h3 className="text-[20px] font-extrabold text-white mt-2">{selectedCity.city}</h3>
                          <p className="text-[12px] text-zinc-400 mt-1">{selectedCity.state}, {selectedCity.country}</p>
                        </div>

                        <div className="border-t border-zinc-900 pt-4 space-y-3.5 text-[12px]">
                          <div>
                            <span className="text-zinc-500 block">Growth Reason</span>
                            <p className="text-zinc-300 font-medium mt-1 leading-relaxed">{selectedCity.reason}</p>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">Opportunities Depth</span>
                            <p className="text-zinc-300 font-medium mt-1 leading-relaxed">{selectedCity.growthOpportunities}</p>
                          </div>
                        </div>

                        <div className="border-t border-zinc-900 pt-4 space-y-3">
                          <div className="flex justify-between text-[12px]">
                            <span className="text-zinc-500">Cost of Living</span>
                            <span className={`font-bold ${selectedCity.costOfLiving === 'Low' ? 'text-emerald-400' : selectedCity.costOfLiving === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>
                              {selectedCity.costOfLiving}
                            </span>
                          </div>
                          <div className="flex justify-between text-[12px]">
                            <span className="text-zinc-500">Ecosystem Strength</span>
                            <span className="text-white font-bold">{selectedCity.ecosystemScore}/100</span>
                          </div>
                          <div className="flex justify-between text-[12px]">
                            <span className="text-zinc-500">Local Job Demand</span>
                            <span className="text-white font-bold">{selectedCity.demandIndex}/100</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600">
                        <MapPin className="w-10 h-10 mb-3 text-zinc-800" />
                        <p className="text-[12px] font-bold">Select a growth hub city from the list to view granular location intelligence metrics.</p>
                      </div>
                    )}

                    <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-900 mt-6 text-[11px] text-zinc-500 flex items-start gap-2 shrink-0">
                      <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p>Data integrated from real-world regional hiring metrics, local developer wage surveys, and geographic startup ecosystem scorecards.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: STARTUP & VENTURE */}
              {activeTab === 'startup' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Banner */}
                  <div className="relative bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <Rocket className="w-5 h-5 text-amber-400 animate-pulse" />
                          <h3 className="text-[15px] font-extrabold text-white">Startup & Business Intelligence</h3>
                        </div>
                        <p className="text-[12px] text-zinc-500 mt-1">
                          Calculated entrepreneurial index and ecosystem fit by evaluating leadership signals, risk tolerances, and innovation skills.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-zinc-500 font-bold uppercase">Potential Indicator:</span>
                        {getSignalBadge(intelData.startupIntel.potential)}
                      </div>
                    </div>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Scorecard */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 space-y-4">
                      <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Venture Launch Scorecard</p>
                      
                      <div className="space-y-3.5 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Launch Success Prob.</span>
                          <span className="text-amber-400 font-black">{intelData.startupIntel.successProbability}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Ecosystem Connections</span>
                          <span className="text-white font-bold">{intelData.startupIntel.networkingOps}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Sectors Competition</span>
                          <span className="text-white font-bold">{intelData.startupIntel.competitionLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Growth Viability</span>
                          <span className="text-emerald-400 font-bold">{intelData.startupIntel.growthPotential}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-zinc-900/80">
                          <span className="text-zinc-500">Est. Initial Capital</span>
                          <span className="text-amber-400 font-black">{intelData.startupIntel.capitalRequired}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sectors */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 space-y-4">
                      <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Top Startup Sectors to Enter</p>
                      
                      <div className="space-y-2">
                        {intelData.startupIntel.sectors.map((sec, idx) => (
                          <div key={idx} className="bg-zinc-950 border border-zinc-900 px-4 py-2.5 rounded-xl flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-[12px] font-bold text-zinc-300">{sec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ecosystem comparison chart */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 space-y-4">
                      <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Global Funding Access Rating</p>
                      
                      <div className="space-y-3">
                        {intelData.startupIntel.bestLaunchCities.map((city, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-white font-bold">{city.city} ({city.country})</span>
                              <span className="text-amber-400 font-bold">Access: {city.fundingAccess}</span>
                            </div>
                            <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                                style={{ width: `${city.ecosystemStrength}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Launch Cities Reasons */}
                  <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5">
                    <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider mb-3">Best Cities to Launch a Startup</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {intelData.startupIntel.bestLaunchCities.map((city, idx) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-white">{city.city}</span>
                            <span className="text-[10px] text-zinc-500">{city.country}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">{city.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: AI RISK & FUTURE OUTLOOK */}
              {activeTab === 'future' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  
                  {/* Top: AI Threat & Automation risk */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 md:col-span-2">
                      <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider mb-4">AI Automation Threat Analysis</p>
                      
                      <div className="space-y-4">
                        {intelData.aiRiskAnalysis.map((risk, idx) => (
                          <div key={idx} className="space-y-2 border-b border-zinc-900 pb-3.5 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between flex-wrap gap-2 text-[12px]">
                              <span className="text-white font-bold">{risk.factor}</span>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                automation threat: {risk.automationThreat}%
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                              💡 <span className="text-zinc-400 font-semibold">AI Safekeeping Tip:</span> {risk.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chart: Growth forecast */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider mb-1">Annual Salary Growth Trajectory</p>
                        <p className="text-[10px] text-zinc-500">Standard vs. Future-Safe Specialization (₹ LPA)</p>
                      </div>

                      <div className="h-[180px] w-full my-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={intelData.salaryGrowthForecast}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                            <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#71717a' }} />
                            <YAxis tick={{ fontSize: 9, fill: '#71717a' }} />
                            <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 8, fontSize: 10 }} />
                            <Area type="monotone" dataKey="futureSafeSalary" name="Future-Safe Spec" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} strokeWidth={2} />
                            <Area type="monotone" dataKey="standardSalary" name="Standard Path" stroke="#3f3f46" fill="#3f3f46" fillOpacity={0.02} strokeWidth={1.5} strokeDasharray="4 4" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex items-center gap-3 text-[9px] text-zinc-500">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> Future-Safe Growth
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-zinc-600" /> Standard Growth
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: REGIONAL COMPARISON */}
              {activeTab === 'comparison' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
                    <h3 className="text-[14px] font-extrabold text-white mb-1 flex items-center gap-2">
                      <TrendingUp className="w-4.5 h-4.5 text-amber-400" /> Regional Tech Hub Comparison Matrix
                    </h3>
                    <p className="text-[12px] text-zinc-500">
                      Comparing major global hubs side by side across hiring demand, startup indices, salary growth rates, and cost of living.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Comparative chart */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 lg:col-span-2">
                      <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider mb-4">Location Match Matrix Index</p>
                      
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={intelData.locationComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#71717a' }} />
                            <YAxis tick={{ fontSize: 9, fill: '#71717a' }} />
                            <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 8, fontSize: 10 }} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Bar dataKey="hiringDemand" name="Hiring Demand" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="startupEcosystem" name="Startup Ecosystem" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="salaryTrend" name="Salary Growth" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Regional Radar */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between">
                      <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider mb-2">Primary Hub Radar Strength</p>
                      
                      <div className="h-[200px] w-full my-auto">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={[
                            { subject: 'Hiring Demand', value: intelData.locations[0]?.demandIndex || 80 },
                            { subject: 'Ecosystem', value: intelData.locations[0]?.ecosystemScore || 85 },
                            { subject: 'Compensation', value: intelData.locations[0]?.score || 90 },
                            { subject: 'Work-Life', value: 75 },
                            { subject: 'Affordability', value: intelData.locations[0]?.costOfLiving === 'Low' ? 90 : 50 }
                          ]}>
                            <PolarGrid stroke="#18181b" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#71717a' }} />
                            <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                            <Radar name="Primary Hub" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <p className="text-[10px] text-zinc-500 text-center">Comparing {intelData.locations[0]?.city || 'Primary Hub'} multi-dimension metrics.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-8 py-4 border-t border-zinc-900 bg-zinc-950/40 flex items-center justify-between shrink-0 text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Edge OS AI Core — Verification complete</span>
            </div>
            <span>Powered by CideDec Intelligence Suite</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
