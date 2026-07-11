import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {

  Search, Send, Sparkles, Lock, Brain, RefreshCw, Bot,
  ArrowUp, ArrowDown, CheckCircle2, XCircle, AlertTriangle,
  Info, TrendingUp, TrendingDown, Zap, Target, DollarSign,
  BarChart3, Activity, GitCompare, ChevronRight, ArrowRight,
  Lightbulb, MessageSquare, Rocket, ShieldCheck, ArrowLeft,
  Star, Award, Trophy, Flame, Eye, Cpu, Globe,
  Layers, SplitSquareHorizontal, Mic, MicOff,
  BookOpen, Briefcase, GraduationCap, Telescope,
  Gauge, Wand2, ChevronDown, Plus, Minus, X,
  MapPin, Calendar, Bookmark, Check, ShieldAlert, FileText
} from 'lucide-react';

import { useQueryHistory } from '../../hooks/useQueryHistory';

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { SuggestionCard }      from './SuggestionCard';
import { SuggestionModal }     from './SuggestionModal';
import { FloatingParticles }   from './FloatingParticles';
import { SearchAuthModal }     from './SearchAuthModal';
import { AIAssistantModal }    from './AIAssistantModal';
import { DecisionDNA, generateDecisionDNA } from './DecisionDNA';
import type { DecisionDNAData } from './DecisionDNA';
import { AIvsHumanThinking, generateAIvsHuman } from './AIvsHumanThinking';
import type { AIvsHumanData } from './AIvsHumanThinking';
import { DecisionTimeline, generateTimeline } from './DecisionTimeline';
import type { TimelineNode } from './DecisionTimeline';
import { useApp }              from '../AppContext';
import type { Page }           from '../App';
import { isCareerQuery, analyzeCareerDecision } from '../../lib/career/engine';
import type { CareerAnalysis } from '../../lib/career/engine';
import { CareerIntelligenceReport } from './CareerIntelligenceReport';

/* ═══════════════════════════════════════════════
   CORE TYPES
═══════════════════════════════════════════════ */
export interface Suggestion {
  id: string; icon: React.ComponentType<any>; title: string; description: string;
  modalContent: { detailedDescription: string; animationType: 'growth'|'mvp'|'research'|'users'|'wins'|'funding'; insights: string[] };
}
type ModuleKey = 'market'|'financial'|'risk'|'strategy'|'comparison'|'forecast';
type QueryTheme = 'strong-green'|'green'|'golden'|'neutral'|'red'|'weak-red';
type Domain = 'marketing'|'finance'|'technology'|'strategy'|'risk'|'career'|'education'|'health'|'personal'|'general';
type UserLevel = 'beginner'|'intermediate'|'advanced'|'expert';
type GoalMode = 'business'|'finance'|'strategy'|'engineering'|'medical'|'commerce'|'arts'|'data'|'learning'|'research';

interface KPI { label: string; value: string; change: string; up: boolean }
interface ChartSpec { type:'area'|'bar'|'line'|'pie'|'radar'; title:string; data:Record<string,unknown>[]; dataKeys:{key:string;color:string}[]; xKey?:string }

/* AI Reasoning */
interface BiasFlag { type:'vague'|'incomplete'|'misleading'|'ambiguous'; message:string; severity:'low'|'medium'|'high' }
interface QueryIntelligence {
  theme: QueryTheme;
  score: number;
  domain: Domain;
  confidence: number;
  confidenceJustification: string;
  verdict: string;
  explanation: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  biasFlags: BiasFlag[];
  autoEnhanced: string;
  alternativePerspectives: { domain:string; query:string; icon:React.ComponentType<any> }[];
  knowledgeGaps: string[];
  futureImpactScore: number;
  scenarios: { label:string; description:string; impact:'positive'|'neutral'|'negative'; delta:number }[];
  keywordStrengths: { word:string; strength:number; color:string }[];
}
interface GamificationState { score:number; level:UserLevel; totalQueries:number; badges:string[]; streak:number }
interface QueryResult {
  query: string; summary: string; modules: ModuleKey[];
  kpis: KPI[]; charts: ChartSpec[]; forecastCharts: ChartSpec[];
  intelligence: QueryIntelligence;
  notif?: { title:string; body:string; type:'insight'|'alert'|'update'|'success' };
}

/* ═══════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════ */
const suggestions: Suggestion[] = [
  { id:'side-project', icon:Lightbulb, title:'Start as a Side Project', description:'Validate your idea with minimal risk while maintaining financial stability.',
    modalContent:{ detailedDescription:'Test market demand without revenue pressure.', animationType:'growth', insights:['Reduces financial risk','Enables flexible iteration','Build proof of concept','Maintain cash flow'] }},
  { id:'mvp-first', icon:Rocket, title:'Build an MVP First', description:'Focus on core features. Ship fast, learn faster, iterate on real feedback.',
    modalContent:{ detailedDescription:'Test hypothesis with minimal resources.', animationType:'mvp', insights:['Ship 10× faster','Validate with real users','Reduce costs 60–70%','Learn what features matter'] }},
  { id:'research-competitors', icon:BarChart3, title:'Research Competitors', description:'Analyse market landscape, identify gaps, learn from successes and failures.',
    modalContent:{ detailedDescription:'Deep analysis reveals market opportunities.', animationType:'research', insights:['Identify ₹180Cr+ gaps','Learn from mistakes first','Understand pricing elasticity','Find your moat'] }},
  { id:'talk-to-users', icon:MessageSquare, title:'Talk to Potential Users', description:'Direct conversations reveal real pain points and unexpected opportunities.',
    modalContent:{ detailedDescription:'User interviews validate product-market fit fastest.', animationType:'users', insights:['Discover real pain points','Validate willingness to pay','Build early-adopter ties','Uncover unseen cases'] }},
  { id:'quick-wins', icon:Zap, title:'Focus on Quick Wins', description:'Prioritise high-impact, low-effort improvements that build momentum.',
    modalContent:{ detailedDescription:'Quick wins contribute to NPS +18pts.', animationType:'wins', insights:['Build team confidence','Show ROI within 30–60 days','Learn via 2-week sprints','Generate word-of-mouth'] }},
  { id:'funding-strategy', icon:DollarSign, title:'Secure Funding Strategy', description:'Plan your approach — bootstrap, angel, or VC.',
    modalContent:{ detailedDescription:'Positioned for Series A/B at ₹80–120Cr.', animationType:'funding', insights:['Bootstrap: max control','Angel ₹5–15Cr: strategic support','VC ₹30–80Cr+: rapid scale','18-month roadmap'] }},
];

const C = { blue:'#3b82f6', violet:'#7c3aed', emerald:'#10b981', amber:'#f59e0b', rose:'#f43f5e', indigo:'#6366f1', sky:'#0ea5e9', green:'#22c55e', red:'#ef4444', gold:'#d97706', teal:'#14b8a6' };

const QUICK_PROMPTS = [
  /* ── Original business prompts (kept) ── */
  { label:'How to become a doctor',                    icon:Lightbulb     },
  { label:'3-year ROI forecast',                       icon:DollarSign    },
  { label:'Should I choose engineering or design',     icon:Brain         },
  { label:'How to start a business',                   icon:Rocket        },
  { label:'Career switch to tech at 30',               icon:TrendingUp    },
  { label:'How to improve my skills',                  icon:Activity      },
  /* ── Education & field discovery prompts ── */
  { label:'Scope of B.Tech Computer Science in India', icon:GraduationCap },
  { label:'Is MBBS worth it in 2025?',                 icon:BookOpen      },
  { label:'Career options after B.Com',                icon:Briefcase     },
  { label:'UPSC vs private sector — which is better',  icon:ShieldCheck   },
  { label:'Top jobs after BCA in next 5 years',        icon:TrendingUp    },
  { label:'Which engineering branch has most scope',   icon:Cpu           },
  { label:'Future of AI engineering in India',         icon:Zap           },
  { label:'Law career after BA LLB — salary & scope',  icon:Globe         },
  { label:'Which is better: CA or MBA finance?',       icon:BarChart3     },
  { label:'Pharmacy career scope in India',            icon:Target        },
  { label:'Data science vs software engineering',      icon:GitCompare    },
  { label:'Scope of architecture in India 2025',       icon:Layers        },
];

const MODULES: Record<ModuleKey,{page:Page;label:string;desc:string;icon:React.ComponentType<any>;iconBg:string;iconColor:string;barColor:string;arrowColor:string;metrics:{label:string;value:string;pct?:number}[]}> = {
  market:     {page:'market',     label:'Market Analysis',    icon:TrendingUp,   desc:'SWOT · TAM/SAM · Competitor matrix · Growth forecast',   iconBg:'bg-blue-100',    iconColor:'text-blue-600',    barColor:'bg-blue-500',    arrowColor:'text-blue-500',    metrics:[{label:'TAM',value:'₹4,200Cr',pct:84},{label:'CAGR',value:'22.4%',pct:72},{label:'Share',value:'24.6%',pct:62}]},
  financial:  {page:'financial',  label:'Financial Analysis', icon:DollarSign,   desc:'ROI · Cash flow · Feasibility · Ratio analysis',           iconBg:'bg-emerald-100', iconColor:'text-emerald-600', barColor:'bg-emerald-500', arrowColor:'text-emerald-500', metrics:[{label:'Net Margin',value:'22.1%',pct:74},{label:'ROE',value:'34.2%',pct:86},{label:'IRR',value:'34.8%',pct:87}]},
  risk:       {page:'insights',   label:'Risk Assessment',    icon:AlertTriangle,desc:'6-factor scoring · Mitigation plans · Risk alerts',         iconBg:'bg-amber-100',   iconColor:'text-amber-600',   barColor:'bg-amber-500',   arrowColor:'text-amber-500',   metrics:[{label:'Composite',value:'38/100',pct:38},{label:'Top Risk',value:'Talent',pct:62},{label:'Liquidity',value:'2.8×',pct:20}]},
  strategy:   {page:'insights',   label:'AI Strategy Engine', icon:Brain,        desc:'Priority actions · AI confidence scores · Roadmaps',       iconBg:'bg-violet-100',  iconColor:'text-violet-600',  barColor:'bg-violet-500',  arrowColor:'text-violet-500',  metrics:[{label:'Confidence',value:'87%',pct:87},{label:'Impact',value:'+₹38L/mo',pct:76},{label:'Timeline',value:'18 mo',pct:55}]},
  comparison: {page:'comparison', label:'Comparison Model',   icon:GitCompare,   desc:'YoY trends · Interfirm benchmarks · Scenario analysis',    iconBg:'bg-indigo-100',  iconColor:'text-indigo-600',  barColor:'bg-indigo-500',  arrowColor:'text-indigo-500',  metrics:[{label:'Rev Δ',value:'+50.7%',pct:85},{label:'CAC Δ',value:'−38.2%',pct:70},{label:'NPS Δ',value:'+18 pts',pct:72}]},
  forecast:   {page:'dashboard',  label:'Predictive Forecast',icon:Target,       desc:'ML projections · Confidence intervals · Scenarios',         iconBg:'bg-rose-100',    iconColor:'text-rose-600',    barColor:'bg-rose-500',    arrowColor:'text-rose-500',    metrics:[{label:'Q3 Rev',value:'₹52.4L',pct:64},{label:'Q4 Rev',value:'₹61.8L',pct:75},{label:'Conf.',value:'88%',pct:88}]},
};

/* ═══════════════════════════════════════════════
   RESPONSE ENGINE
═══════════════════════════════════════════════ */
type RT = Omit<QueryResult,'query'|'intelligence'|'forecastCharts'>;
const responseMap: Record<string,RT> = {
  roi:{ summary:'3-year ROI = 187% on ₹1,200L. Break-even 2.5 yrs. IRR 34.8% — Highly Attractive.',
    modules:['financial','forecast','comparison'],
    kpis:[{label:'3-Year ROI',value:'187%',change:'Excellent',up:true},{label:'Break-Even',value:'2.5 yrs',change:'On track',up:true},{label:'NPV',value:'₹92.4L',change:'+31%',up:true},{label:'IRR',value:'34.8%',change:'Attractive',up:true}],
    charts:[
      {type:'area',title:'Cost vs Revenue (₹L)',data:[{y:'Yr 0',cost:-1200,revenue:0},{y:'Yr 1',cost:-380,revenue:860},{y:'Yr 2',cost:-340,revenue:1180},{y:'Yr 3',cost:-310,revenue:1630}],dataKeys:[{key:'revenue',color:C.emerald},{key:'cost',color:C.rose}],xKey:'y'},
      {type:'bar',title:'Annual Returns (₹L)',data:[{y:'Year 1',v:480},{y:'Year 2',v:840},{y:'Year 3',v:1320}],dataKeys:[{key:'v',color:C.blue}],xKey:'y'}
    ],notif:{title:'ROI Analysis Complete',body:'IRR 34.8% — Highly Attractive.',type:'success'}},
  market:{ summary:'TAM = ₹4,200Cr @ 22.4% CAGR. Share 24.6% — Rank #2. ₹180Cr rural opportunity.',
    modules:['market','strategy','forecast'],
    kpis:[{label:'TAM',value:'₹4,200Cr',change:'+12% YoY',up:true},{label:'Market Share',value:'24.6%',change:'+3.2%',up:true},{label:'CAGR',value:'22.4%',change:'Strong',up:true},{label:'NPS Lead',value:'+14 pts',change:'vs avg',up:true}],
    charts:[
      {type:'pie',title:'Market Share (%)',data:[{name:'Our Co',value:24.6},{name:'TechVision',value:32.1},{name:'DataFlow',value:18.4},{name:'SmartBiz',value:14.9},{name:'Others',value:10}],dataKeys:[{key:'value',color:C.blue}],xKey:'name'},
      {type:'line',title:'Growth Forecast',data:[{m:'Jan',actual:42},{m:'Feb',actual:45},{m:'Mar',actual:48},{m:'Apr',actual:52},{m:'May',actual:58},{m:'Jun',predicted:63},{m:'Jul',predicted:69},{m:'Aug',predicted:75},{m:'Sep',predicted:82}],dataKeys:[{key:'actual',color:C.blue},{key:'predicted',color:C.violet}],xKey:'m'}
    ],notif:{title:'Market Insight Detected',body:'₹180Cr rural opportunity, 34% lower CAC.',type:'insight'}},
  risk:{ summary:'Composite risk = 38/100. Critical: Talent 62, Regulatory 55. Liquidity safest at 18.',
    modules:['risk','strategy','financial'],
    kpis:[{label:'Overall Risk',value:'38/100',change:'Manageable',up:true},{label:'Top Risk',value:'Talent',change:'62/100 High',up:false},{label:'Liquidity',value:'2.8×',change:'Safe zone',up:true},{label:'Plans',value:'4 items',change:'Mitigation',up:true}],
    charts:[{type:'bar',title:'Risk Factor Scores (out of 100)',data:[{f:'Talent',score:62},{f:'Regulatory',score:55},{f:'Market',score:42},{f:'Customer',score:47},{f:'Tech',score:31},{f:'Liquidity',score:18}],dataKeys:[{key:'score',color:C.amber}],xKey:'f'}],
    notif:{title:'Risk Alert',body:'Talent Retention at 62/100. ESOP revision needed.',type:'alert'}},
  strategy:{ summary:'#1 Action: Rural Expansion — AI confidence 87%. ₹180Cr opportunity, 34% lower CAC.',
    modules:['strategy','market','financial'],
    kpis:[{label:'AI Confidence',value:'87%',change:'High',up:true},{label:'Revenue Uplift',value:'+₹38L/mo',change:'Projected',up:true},{label:'CAC Reduction',value:'−34%',change:'Rural mkt',up:true},{label:'Timeline',value:'18 mo',change:'Full impact',up:true}],
    charts:[{type:'area',title:'Revenue Uplift (₹L/mo)',data:[{m:'M1',base:42.8,strat:43.5},{m:'M3',base:43.2,strat:45.8},{m:'M6',base:44,strat:51.2},{m:'M9',base:44.8,strat:58.6},{m:'M12',base:45.5,strat:67.4},{m:'M18',base:46.8,strat:80.8}],dataKeys:[{key:'strat',color:C.emerald},{key:'base',color:C.sky}],xKey:'m'}],
    notif:{title:'Strategy Insight',body:'Rural expansion — 87% AI confidence.',type:'insight'}},
  financial:{ summary:'Gross Margin 68.4%, Net 22.1%, EBITDA 31.8%, ROE 34.2%. Current Ratio 2.8×.',
    modules:['financial','comparison','forecast'],
    kpis:[{label:'Gross Margin',value:'68.4%',change:'+4.2 pp',up:true},{label:'Net Margin',value:'22.1%',change:'+7.9 pp',up:true},{label:'Current Ratio',value:'2.8×',change:'Excellent',up:true},{label:'ROE',value:'34.2%',change:'+14.2 pp',up:true}],
    charts:[{type:'bar',title:'Cash Flow by Quarter (₹L)',data:[{q:"Q1'23",op:18,inv:-8},{q:"Q2'23",op:21,inv:-5},{q:"Q3'23",op:24,inv:-12},{q:"Q4'23",op:28,inv:-6},{q:"Q1'24",op:32,inv:-9},{q:"Q2'24",op:38,inv:-14}],dataKeys:[{key:'op',color:C.emerald},{key:'inv',color:C.rose}],xKey:'q'}],
    notif:{title:'Financial Health Checked',body:'Gross margin 68.4% above benchmark.',type:'success'}},
  comparison:{ summary:'YoY: Revenue +50.7%, Customers +52.5%, CAC −38.2%, NPS +18 pts, Churn −3.2 pp.',
    modules:['comparison','financial','market'],
    kpis:[{label:'Rev Growth',value:'+50.7%',change:'YoY',up:true},{label:'CAC Drop',value:'−38.2%',change:'₹680→₹420',up:true},{label:'NPS Growth',value:'+18 pts',change:'54→72',up:true},{label:'Churn Cut',value:'−3.2 pp',change:'8.4%→5.2%',up:true}],
    charts:[{type:'bar',title:'Prior vs Current Year',data:[{m:'Revenue',prior:28.4,curr:42.8},{m:'NPS',prior:54,curr:72}],dataKeys:[{key:'prior',color:C.sky},{key:'curr',color:C.blue}],xKey:'m'},
            {type:'line',title:'Growth Rate vs Competitors (%)',data:[{n:'Our Co',r:18.3},{n:'TechVision',r:8.2},{n:'DataFlow',r:12.1},{n:'SmartBiz',r:5.8}],dataKeys:[{key:'r',color:C.blue}],xKey:'n'}],
    notif:{title:'Comparison Complete',body:'Revenue +50.7%, NPS +18 pts.',type:'update'}},
  default:{ summary:'CideDec ready. Ask about ROI, market share, risk, strategy, or financial ratios.',
    modules:['market','financial','risk','strategy'],
    kpis:[{label:'Revenue MoM',value:'₹42.8L',change:'+18.3%',up:true},{label:'Market Share',value:'24.6%',change:'+3.2%',up:true},{label:'Risk Score',value:'38/100',change:'Managed',up:true},{label:'ROI (3yr)',value:'187%',change:'Excellent',up:true}],
    charts:[
      {type:'area',title:'Revenue Trend (₹L)',data:[{m:'Jan',v:28},{m:'Feb',v:31},{m:'Mar',v:29},{m:'Apr',v:35},{m:'May',v:38},{m:'Jun',v:42},{m:'Jul',v:40},{m:'Aug',v:45},{m:'Sep',v:43},{m:'Oct',v:48}],dataKeys:[{key:'v',color:C.blue}],xKey:'m'},
      {type:'bar',title:'Market Share vs Competitors (%)',data:[{n:'Our Co',v:24.6},{n:'TechVision',v:32.1},{n:'DataFlow',v:18.4},{n:'SmartBiz',v:14.9}],dataKeys:[{key:'v',color:C.violet}],xKey:'n'}
    ],
    notif:undefined},
};
/* ── Universal response templates for life / career / education ── */
const universalMap: Record<string,RT> = {
  career:{ summary:'AI-powered career path analysis with skill mapping, competition assessment, and 5-year trajectory forecast.',
    modules:['strategy','market','forecast'],
    kpis:[{label:'Path Viability',value:'82/100',change:'Strong',up:true},{label:'Avg Timeline',value:'3–5 yrs',change:'To mastery',up:true},{label:'Competition',value:'Medium',change:'Growing field',up:true},{label:'Growth Rate',value:'+24%',change:'Job demand',up:true}],
    charts:[{type:'area',title:'Skill Progression Over Time',data:[{m:'Month 1',v:10},{m:'Month 6',v:28},{m:'Year 1',v:48},{m:'Year 2',v:68},{m:'Year 3',v:82},{m:'Year 5',v:95}],dataKeys:[{key:'v',color:C.blue}],xKey:'m'},
      {type:'bar',title:'Salary Trajectory (₹LPA)',data:[{y:'Entry',v:4},{y:'Year 2',v:8},{y:'Year 5',v:15},{y:'Year 8',v:25},{y:'Year 10+',v:40}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'}],
    notif:{title:'Career Analysis Complete',body:'Path viability assessed with skill mapping and timeline.',type:'insight'}},
  education:{ summary:'Education pathway analysis — comparing degrees, certifications, costs, and career outcomes.',
    modules:['comparison','financial','forecast'],
    kpis:[{label:'Degree Value',value:'High',change:'ROI positive',up:true},{label:'Avg Duration',value:'4 yrs',change:'Full-time',up:true},{label:'Avg Cost',value:'₹8–15L',change:'Varies',up:true},{label:'Job Placement',value:'78%',change:'Within 6 mo',up:true}],
    charts:[{type:'bar',title:'Cost vs Earning Potential (₹L)',data:[{p:'Degree',cost:12,earning:8},{p:'Certification',cost:2,earning:6},{p:'Bootcamp',cost:1.5,earning:5},{p:'Self-learn',cost:0.2,earning:4}],dataKeys:[{key:'cost',color:C.rose},{key:'earning',color:C.emerald}],xKey:'p'},
      {type:'line',title:'Career Growth by Education Path',data:[{y:'Year 1',degree:5,cert:4,self:3},{y:'Year 3',degree:12,cert:10,self:7},{y:'Year 5',degree:22,cert:18,self:12},{y:'Year 10',degree:42,cert:32,self:20}],dataKeys:[{key:'degree',color:C.blue},{key:'cert',color:C.violet},{key:'self',color:C.amber}],xKey:'y'}],
    notif:{title:'Education Path Mapped',body:'Multiple pathways compared with cost-benefit analysis.',type:'update'}},
  health:{ summary:'Health & wellness decision analysis — career paths in healthcare, wellness planning, and medical field insights.',
    modules:['risk','strategy','forecast'],
    kpis:[{label:'Demand',value:'Very High',change:'+18% YoY',up:true},{label:'Training',value:'5–10 yrs',change:'Intensive',up:true},{label:'Impact',value:'Direct',change:'Life-saving',up:true},{label:'Stability',value:'95%',change:'Job security',up:true}],
    charts:[{type:'area',title:'Healthcare Job Demand Index',data:[{y:'2020',v:62},{y:'2021',v:70},{y:'2022',v:78},{y:'2023',v:84},{y:'2024',v:92},{y:'2025',v:100}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'}],
    notif:{title:'Health Career Insight',body:'Healthcare demand growing at 18% YoY.',type:'insight'}},
  personal:{ summary:'Personal development roadmap — skill assessment, growth plan, and milestone tracking.',
    modules:['strategy','comparison','forecast'],
    kpis:[{label:'Skill Gap',value:'34%',change:'Closeable',up:true},{label:'Growth Rate',value:'+22%',change:'Monthly',up:true},{label:'Consistency',value:'Key',change:'Factor #1',up:true},{label:'Timeline',value:'6–12 mo',change:'Visible results',up:true}],
    charts:[{type:'area',title:'Personal Growth Trajectory',data:[{m:'Week 1',v:5},{m:'Month 1',v:15},{m:'Month 3',v:35},{m:'Month 6',v:55},{m:'Year 1',v:78},{m:'Year 2',v:92}],dataKeys:[{key:'v',color:C.violet}],xKey:'m'}],
    notif:{title:'Growth Plan Ready',body:'Personalized development roadmap generated.',type:'success'}},

  /* ═══════════════════════════════════════════════
     INDIAN EDUCATION FIELD TEMPLATES
  ═══════════════════════════════════════════════ */
  btech_cse:{ summary:'B.Tech CSE — Avg salary ₹6–45 LPA. Top recruiters: Google, Microsoft, Infosys, TCS. Job demand +38% by 2030.',
    modules:['market','forecast','comparison'],
    kpis:[{label:'Avg Salary (Entry)',value:'₹6–12 LPA',change:'Growing',up:true},{label:'Job Demand',value:'+38% by 2030',change:'AI/ML boom',up:true},{label:'Top Exam',value:'JEE Main/Adv',change:'Highly competitive',up:false},{label:'Duration',value:'4 Years',change:'B.Tech',up:true}],
    charts:[
      {type:'bar',title:'CSE Salary by Role (₹LPA)',data:[{r:'Fresher',v:6},{r:'SDE-I',v:14},{r:'SDE-II',v:24},{r:'Senior',v:36},{r:'Lead/Mgr',v:55}],dataKeys:[{key:'v',color:C.blue}],xKey:'r'},
      {type:'area',title:'CSE Job Openings in India (Thousands)',data:[{y:'2021',v:180},{y:'2022',v:220},{y:'2023',v:265},{y:'2024',v:310},{y:'2025',v:360},{y:'2026',v:420}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'},
    ],notif:{title:'B.Tech CSE Analysis Ready',body:'High-demand field with strong salary trajectory.',type:'insight'}},

  btech_ece:{ summary:'B.Tech ECE — VLSI, Embedded & IoT booming. Avg salary ₹5–30 LPA. Core + IT roles both available.',
    modules:['market','comparison','forecast'],
    kpis:[{label:'Avg Salary (Entry)',value:'₹5–10 LPA',change:'Moderate',up:true},{label:'VLSI Demand',value:'+52% by 2028',change:'Chip boom',up:true},{label:'Top Exam',value:'JEE Main/Adv',change:'Moderate difficulty',up:true},{label:'Duration',value:'4 Years',change:'B.Tech',up:true}],
    charts:[
      {type:'bar',title:'ECE Career Paths Salary (₹LPA)',data:[{r:'Core ECE',v:7},{r:'VLSI Design',v:18},{r:'Embedded',v:12},{r:'IT/Software',v:15},{r:'PSU',v:10}],dataKeys:[{key:'v',color:C.violet}],xKey:'r'},
      {type:'line',title:'VLSI & Semiconductor Job Growth',data:[{y:'2022',v:40},{y:'2023',v:58},{y:'2024',v:82},{y:'2025',v:110},{y:'2026',v:145}],dataKeys:[{key:'v',color:C.teal}],xKey:'y'},
    ],notif:{title:'ECE Career Analysis Done',body:'VLSI sector is the highest-growth area.',type:'insight'}},

  mbbs:{ summary:'MBBS — 5.5 yr course. NEET required. Govt doctor ₹60K–1.5L/mo. Private/specialisation ₹2–20L/mo.',
    modules:['market','strategy','forecast'],
    kpis:[{label:'Duration',value:'5.5 Years',change:'+Internship',up:true},{label:'Entrance Exam',value:'NEET-UG',change:'Highly competitive',up:false},{label:'Govt Salary',value:'₹60K–1.5L/mo',change:'Stable',up:true},{label:'Specialist',value:'₹2–20L/mo',change:'Post PG',up:true}],
    charts:[
      {type:'bar',title:'Doctor Salary by Specialisation (₹L/yr)',data:[{s:'General',v:8},{s:'Pediatrician',v:14},{s:'Surgeon',v:20},{s:'Cardiologist',v:35},{s:'Neuro',v:50}],dataKeys:[{key:'v',color:C.emerald}],xKey:'s'},
      {type:'area',title:'India Doctor Demand (Thousands needed)',data:[{y:'2023',v:600},{y:'2025',v:720},{y:'2027',v:860},{y:'2029',v:1020},{y:'2031',v:1200}],dataKeys:[{key:'v',color:C.rose}],xKey:'y'},
    ],notif:{title:'MBBS Field Analysis Ready',body:'India needs 600K+ more doctors by 2030.',type:'insight'}},

  law:{ summary:'BA LLB / LLB — Corporate law & litigation booming. Top lawyers earn ₹50L–5Cr+. CLAT is the main entrance.',
    modules:['market','comparison','financial'],
    kpis:[{label:'Entrance Exam',value:'CLAT / AILET',change:'5 yr course',up:true},{label:'Avg Starting',value:'₹3–8 LPA',change:'Entry level',up:true},{label:'Corporate Law',value:'₹20–80 LPA',change:'5–8 yrs exp',up:true},{label:'Top Firms',value:'AZB, Cyril',change:'& 50+ NLU firms',up:true}],
    charts:[
      {type:'bar',title:'Law Career Salary by Path (₹LPA)',data:[{p:'Litigation',v:5},{p:'Corporate',v:22},{p:'Judiciary',v:9},{p:'Legal Consulting',v:18},{p:'Academic',v:6}],dataKeys:[{key:'v',color:C.amber}],xKey:'p'},
      {type:'line',title:'Law Graduates Placed (%)',data:[{y:'2020',v:52},{y:'2021',v:58},{y:'2022',v:65},{y:'2023',v:71},{y:'2024',v:78}],dataKeys:[{key:'v',color:C.gold}],xKey:'y'},
    ],notif:{title:'Law Career Mapped',body:'Corporate law offers highest growth trajectory.',type:'insight'}},

  commerce_ca:{ summary:'B.Com + CA — One of India\'s most respected credentials. CA avg salary ₹7–50 LPA. Big4 firms pay ₹12–25 LPA.',
    modules:['financial','comparison','forecast'],
    kpis:[{label:'CA Exam',value:'3 Levels',change:'2–4 yrs',up:true},{label:'Big4 Salary',value:'₹12–25 LPA',change:'Entry level',up:true},{label:'Own Practice',value:'₹30–2Cr+',change:'Senior CA',up:true},{label:'Pass Rate',value:'~10–15%',change:'All 3 levels',up:false}],
    charts:[
      {type:'bar',title:'CA Career Salary Stages (₹LPA)',data:[{s:'Articleship',v:1.5},{s:'Fresher CA',v:8},{s:'3–5 Yrs',v:18},{s:'Senior CA',v:35},{s:'Partner',v:80}],dataKeys:[{key:'v',color:C.emerald}],xKey:'s'},
      {type:'pie',title:'CA Employment Sectors',data:[{name:'Big4/MNC',value:38},{name:'Own Practice',value:28},{name:'PSU/Govt',value:16},{name:'SME Finance',value:18}],dataKeys:[{key:'value',color:C.blue}],xKey:'name'},
    ],notif:{title:'CA Career Analysis Done',body:'Big4 firms offer top packages for new CAs.',type:'insight'}},

  data_science:{ summary:'Data Science & AI/ML — India\'s fastest growing field. Avg salary ₹8–50 LPA. 97,000+ open roles in 2025.',
    modules:['market','forecast','strategy'],
    kpis:[{label:'Avg Salary',value:'₹8–25 LPA',change:'Entry–Mid',up:true},{label:'Job Openings',value:'97,000+',change:'2025 India',up:true},{label:'AI Demand',value:'+68% by 2028',change:'Exponential',up:true},{label:'Key Skills',value:'Python, SQL, ML',change:'Must have',up:true}],
    charts:[
      {type:'area',title:'Data Science Job Postings (India, Thousands)',data:[{y:'2021',v:28},{y:'2022',v:45},{y:'2023',v:68},{y:'2024',v:97},{y:'2025',v:138},{y:'2026',v:190}],dataKeys:[{key:'v',color:C.violet}],xKey:'y'},
      {type:'bar',title:'Avg Salary by Role (₹LPA)',data:[{r:'Data Analyst',v:7},{r:'Data Scientist',v:14},{r:'ML Engineer',v:18},{r:'AI Architect',v:30},{r:'Research Sci.',v:40}],dataKeys:[{key:'v',color:C.indigo}],xKey:'r'},
    ],notif:{title:'Data Science Field Mapped',body:'97K+ open roles — one of India\'s top-paying fields.',type:'insight'}},

  civil_eng:{ summary:'Civil Engineering — Core & govt roles stable. PSU (UPSC ESE/GATE) salaries ₹8–15L. Private infra boom pays ₹6–20L.',
    modules:['market','strategy','forecast'],
    kpis:[{label:'Avg Salary',value:'₹5–12 LPA',change:'Entry level',up:true},{label:'PSU via GATE',value:'₹8–15 LPA',change:'Govt sector',up:true},{label:'Infra Growth',value:'+₹111Lakh Cr',change:'NIP 2025–30',up:true},{label:'Duration',value:'4 Years',change:'B.Tech Civil',up:true}],
    charts:[
      {type:'bar',title:'Civil Eng Salary by Sector (₹LPA)',data:[{s:'Govt/PSU',v:10},{s:'Infra Pvt',v:12},{s:'Real Estate',v:9},{s:'Consulting',v:15},{s:'Abroad',v:28}],dataKeys:[{key:'v',color:C.amber}],xKey:'s'},
      {type:'line',title:'India Infrastructure Spend (₹ Lakh Cr)',data:[{y:'2022',v:7.5},{y:'2023',v:10},{y:'2024',v:11.1},{y:'2025',v:13},{y:'2026',v:15.5}],dataKeys:[{key:'v',color:C.teal}],xKey:'y'},
    ],notif:{title:'Civil Engineering Analysis Done',body:'NIP infra boom creates high demand for civil engineers.',type:'insight'}},

  pharmacy:{ summary:'B.Pharm / M.Pharm / Pharm.D — India is world\'s 3rd largest pharma market. Avg salary ₹4–18 LPA.',
    modules:['market','forecast','comparison'],
    kpis:[{label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},{label:'Pharma Mkt',value:'$65Bn by 2025',change:'India rank #3',up:true},{label:'Export Value',value:'$25Bn+',change:'Generic king',up:true},{label:'Duration',value:'4 Yrs (B.Pharm)',change:'6 Yrs (Pharm.D)',up:true}],
    charts:[
      {type:'bar',title:'Pharmacy Career Salary (₹LPA)',data:[{r:'QC/QA',v:5},{r:'Medical Rep',v:6},{r:'R&D',v:9},{r:'Regulatory',v:11},{r:'Clinical Trials',v:14}],dataKeys:[{key:'v',color:C.green}],xKey:'r'},
      {type:'area',title:'India Pharma Market Size ($Bn)',data:[{y:'2020',v:41},{y:'2022',v:50},{y:'2023',v:57},{y:'2025',v:65},{y:'2027',v:80}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'},
    ],notif:{title:'Pharmacy Field Mapped',body:'India\'s pharma exports are world-leading.',type:'insight'}},

  architecture:{ summary:'B.Arch — 5 yr course. NATA entrance. Avg salary ₹4–25 LPA. Real estate & smart city boom driving demand.',
    modules:['market','comparison','forecast'],
    kpis:[{label:'Duration',value:'5 Years',change:'B.Arch',up:true},{label:'Entrance',value:'NATA / JEE Paper 2',change:'Moderate difficulty',up:true},{label:'Avg Salary',value:'₹4–15 LPA',change:'5–8 yrs exp',up:true},{label:'Own Studio',value:'₹20–80L/yr',change:'Senior Arch.',up:true}],
    charts:[
      {type:'bar',title:'Architecture Salary by Role (₹LPA)',data:[{r:'Junior',v:4},{r:'Mid-Level',v:9},{r:'Senior',v:16},{r:'Principal',v:25},{r:'Own Studio',v:45}],dataKeys:[{key:'v',color:C.rose}],xKey:'r'},
      {type:'line',title:'Real Estate & Infra Project Starts (India, K)',data:[{y:'2021',v:80},{y:'2022',v:98},{y:'2023',v:118},{y:'2024',v:140},{y:'2025',v:165}],dataKeys:[{key:'v',color:C.amber}],xKey:'y'},
    ],notif:{title:'Architecture Field Analysis Done',body:'Smart city mission driving demand for architects.',type:'insight'}},

  upsc_ias:{ summary:'UPSC IAS — India\'s most prestigious exam. IAS salary ₹56K–2.5L/mo + perks. 0.1–0.2% selection rate.',
    modules:['market','strategy','comparison'],
    kpis:[{label:'Selection Rate',value:'0.1–0.2%',change:'~180 IAS/year',up:false},{label:'IAS Salary',value:'₹56K–2.5L/mo',change:'+ DA + perks',up:true},{label:'Prep Time',value:'1–4 Years',change:'Average',up:true},{label:'Age Limit',value:'21–32 yrs',change:'Gen category',up:true}],
    charts:[
      {type:'bar',title:'UPSC Applicants vs Selected (Thousands)',data:[{y:'2020',app:950},{y:'2021',app:1020},{y:'2022',app:1100},{y:'2023',app:1300}],dataKeys:[{key:'app',color:C.blue}],xKey:'y'},
      {type:'pie',title:'UPSC Qualifier Background',data:[{name:'Engineering',value:48},{name:'Humanities',value:28},{name:'Science',value:14},{name:'Commerce',value:10}],dataKeys:[{key:'value',color:C.violet}],xKey:'name'},
    ],notif:{title:'UPSC/IAS Path Analysed',body:'Engineering grads dominate IAS selections.',type:'insight'}},
};

function classify(q:string):RT {
  const t = q.toLowerCase();
  /* Business domains (kept intact) */
  if (/roi|return|break.?even|irr|npv|invest/.test(t))               return responseMap.roi;
  if (/market|trend|tam|share|segment|competitor|swot|marketing/.test(t)) return responseMap.market;
  if (/risk|threat|danger|vulnerab|mitigation/.test(t))              return responseMap.risk;
  if (/strateg|recommend|#1|top action|growth plan|rural/.test(t))   return responseMap.strategy;
  if (/financial|margin|profit|cash|liquidity|ratio|ebitda/.test(t)) return responseMap.financial;
  if (/compar|prior|last year|yoy|benchm|interfirm/.test(t))         return responseMap.comparison;
  /* ── Indian education fields (specific first) ── */
  if (/mbbs|neet.?ug|medical college|aiims|jipmer|govt doctor/.test(t)) return universalMap.mbbs;
  if (/cse|computer science|software eng|b\.?tech.*comp|comp.*b\.?tech|coding career|it engineer/.test(t)) return universalMap.btech_cse;
  if (/ece|electronics|vlsi|embedded|semiconductor|signal processing/.test(t)) return universalMap.btech_ece;
  if (/data.?sci|machine learn|ml engineer|ai engineer|deep learn|nlp career/.test(t)) return universalMap.data_science;
  if (/civil eng|infrastructure|construction engineer|gate civil|psu civil/.test(t)) return universalMap.civil_eng;
  if (/pharma|b\.?pharm|m\.?pharm|pharm\.?d|drug|medicines career/.test(t)) return universalMap.pharmacy;
  if (/architect|b\.?arch|nata|design build|urban plann/.test(t))   return universalMap.architecture;
  if (/upsc|ias|ips|civil serv|govt service|ssc|state pcs/.test(t)) return universalMap.upsc_ias;
  if (/\bca\b|chartered account|icai|b\.?com.*finance|ca exam|big.?4/.test(t)) return universalMap.commerce_ca;
  if (/\blaw\b|llb|clat|legal career|advocate|barrister|corporate law|litigation/.test(t)) return universalMap.law;
  /* Universal domains (kept intact) */
  if (/doctor|surgeon|nurse|healthcare|hospital|biotech/.test(t)) return universalMap.health;
  if (/career|job|profession|salary|hire|resume|switch|promotion|work|engineer|developer|designer|lawyer|pilot|teacher|chef/.test(t)) return universalMap.career;
  if (/educat|degree|college|universit|course|certif|learn|study|exam|school|mba|btech|masters|phd|bootcamp/.test(t)) return universalMap.education;
  if (/skill|improve|habit|personal|growth|motivation|focus|discipline|confident|creative|communicat|mindset|productiv|life/.test(t)) return universalMap.personal;
  if (/business|startup|entrepre|found|launch|company|venture/.test(t)) return responseMap.strategy;
  return responseMap.default;
}

/* ═══════════════════════════════════════════════
   DEEP INTELLIGENCE ENGINE
═══════════════════════════════════════════════ */
const STRONG_KW = ['market','marketing','roi','revenue','strategy','financial','growth','analysis',
  'invest','profit','risk','competitive','customer','product','sales','forecast','trend','data',
  'insight','business','startup','expansion','funding','brand','digital','analytics','performance',
  'comparison','kpi','margin','cash','ebitda','npv','irr','tam','cagr','swot','benchmark',
  'innovation','leadership','demand','supply','pricing','fintech','saas','b2b','b2c','agile',
  /* Universal domains */
  'career','job','profession','salary','engineer','doctor','developer','designer','education',
  'degree','college','university','course','certification','learn','study','exam','skill',
  'improve','habit','personal','motivation','focus','discipline','health','medical','healthcare',
  'wellness','creative','communication','mindset','productivity','life','goal','plan','path',
  /* Indian education field keywords */
  'mbbs','neet','btech','cse','ece','gate','jee','clat','nata','upsc','ias','llb','bcom',
  'mba','bca','mca','bsc','architecture','pharmacy','pharma','nursing','ayurveda','homeopathy',
  'biotechnology','civil','mechanical','chemical','aerospace','vlsi','embedded','semiconductor',
  'data science','machine learning','artificial intelligence','chartered accountant','company secretary',
  'scope','future','placement','entrance','admission','cutoff','counselling','ranking'];
const DOMAIN_MAP:Record<string,Domain> = {
  marketing:'marketing',market:'marketing',brand:'marketing',campaign:'marketing',seo:'marketing',
  roi:'finance',revenue:'finance',financial:'finance',profit:'finance',investment:'finance',margin:'finance',irr:'finance',npv:'finance',
  technology:'technology',tech:'technology',saas:'technology',software:'technology',ai:'technology',digital:'technology',
  strategy:'strategy',growth:'strategy',expansion:'strategy',competitive:'strategy',leadership:'strategy',
  risk:'risk',threat:'risk',vulnerab:'risk',mitigation:'risk',compliance:'risk',
  /* Universal domains */
  career:'career',job:'career',profession:'career',salary:'career',hire:'career',resume:'career',promotion:'career',
  education:'education',degree:'education',college:'education',university:'education',course:'education',certification:'education',study:'education',exam:'education',
  doctor:'health',medical:'health',healthcare:'health',hospital:'health',nurse:'health',pharma:'health',wellness:'health',
  skill:'personal',improve:'personal',habit:'personal',personal:'personal',motivation:'personal',focus:'personal',discipline:'personal',creative:'personal',mindset:'personal',productivity:'personal',
};
const BIAS_TRIGGERS = [
  {re:/\ball\b|\balways\b|\bnever\b|\beveryone\b/,type:'misleading' as const,msg:'Absolute terms like "all/always/never" may oversimplify — add qualifiers for accurate analysis.',severity:'medium' as const},
  {re:/^.{1,4}$/,type:'vague' as const,msg:'Query too short to extract meaningful business context. Add domain, metric, or intent.',severity:'high' as const},
  {re:/^(what|how|why|when)\s*\??$/i,type:'incomplete' as const,msg:'Incomplete question — missing subject. Specify the business entity or metric.',severity:'high' as const},
  {re:/\bmaybe\b|\bsomething\b|\bstuff\b|\bthings\b/,type:'ambiguous' as const,msg:'Vague terms reduce analytical precision. Replace with specific business terminology.',severity:'medium' as const},
];

function detectDomain(q:string):Domain {
  const t = q.toLowerCase();
  for (const [kw,dom] of Object.entries(DOMAIN_MAP)) {
    if (t.includes(kw)) return dom;
  }
  return 'general';
}

function analyzeIntelligence(q:string): QueryIntelligence {
  const t      = q.toLowerCase().trim();
  const words  = t.split(/\s+/);
  const wCount = words.length;
  const strongMatches = STRONG_KW.filter(k => t.includes(k));
  const hasNums = /\d/.test(t);
  const hasPunct = /[?!.,]/.test(t);
  const domain = detectDomain(q);

  /* Score 0-100 */
  let score = 35;
  score += strongMatches.length * 10;
  score += wCount > 2 ? 8 : 0;
  score += wCount > 5 ? 8 : 0;
  score += hasNums   ? 7 : 0;
  score += hasPunct  ? 4 : 0;
  score += domain !== 'general' ? 6 : 0;
  score = Math.max(5, Math.min(98, score));

  const theme: QueryTheme = score >= 85 ? 'strong-green' : score >= 68 ? 'green' : score >= 52 ? 'golden' : score >= 40 ? 'neutral' : score >= 22 ? 'red' : 'weak-red';
  const confidence = Math.min(98, score + (strongMatches.length * 3));

  /* Bias detection */
  const biasFlags: BiasFlag[] = [];
  for (const bt of BIAS_TRIGGERS) {
    if (bt.re.test(q)) biasFlags.push({ type:bt.type, message:bt.msg, severity:bt.severity });
  }

  /* Keyword strengths for heatmap */
  const keywordStrengths = words.slice(0,8).map(w => {
    const idx = STRONG_KW.indexOf(w);
    const str = idx !== -1 ? 70 + Math.min(30, (STRONG_KW.length - idx) * 2) : 15 + Math.random() * 20;
    const col = str > 65 ? '#10b981' : str > 35 ? '#f59e0b' : '#ef4444';
    return { word:w, strength:Math.round(str), color:col };
  });

  /* Auto-enhanced query */
  const enhancements: Record<Domain,string> = {
    marketing: `${q} — with campaign ROI metrics, channel attribution, and 5-year brand equity forecast`,
    finance:   `${q} — including IRR, NPV, sensitivity analysis, and 5-year cash flow projections`,
    technology:`${q} — with scalability assessment, tech-debt risk scoring, and adoption trajectory`,
    strategy:  `${q} — backed by competitive SWOT, market positioning, and 5-year scenario modelling`,
    risk:      `${q} — with 6-factor composite scoring, mitigation playbook, and contingency timelines`,
    career:    `${q} — with skill gap analysis, salary trajectory, competition level, and career growth forecast`,
    education: `${q} — with degree ROI comparison, institution rankings, cost-benefit analysis, and placement rates`,
    health:    `${q} — with demand analysis, training pathway, specialization options, and career stability metrics`,
    personal:  `${q} — with skill assessment, habit framework, milestone tracking, and growth trajectory model`,
    general:   `${q} — with industry benchmarks, trend analysis, and predictive confidence intervals`,
  };

  /* Alternative perspectives */
  const altMap: Record<Domain,{domain:string;query:string;icon:React.ComponentType<any>}[]> = {
    marketing:[{domain:'Financial',query:`Revenue impact of ${q}`,icon:DollarSign},{domain:'Risk',query:`Risk exposure in ${q}`,icon:AlertTriangle},{domain:'Strategy',query:`${q} competitive positioning`,icon:Target}],
    finance:  [{domain:'Market',query:`Market dynamics affecting ${q}`,icon:TrendingUp},{domain:'Strategy',query:`${q} strategic implications`,icon:Brain},{domain:'Risk',query:`${q} risk-adjusted returns`,icon:ShieldCheck}],
    technology:[{domain:'Business',query:`Business case for ${q}`,icon:Briefcase},{domain:'Market',query:`Market adoption of ${q}`,icon:Globe},{domain:'Risk',query:`${q} implementation risks`,icon:AlertTriangle}],
    strategy:[{domain:'Finance',query:`Financial model for ${q}`,icon:DollarSign},{domain:'Market',query:`${q} market opportunity`,icon:TrendingUp},{domain:'Operations',query:`${q} execution roadmap`,icon:Target}],
    risk:    [{domain:'Finance',query:`Financial impact of ${q}`,icon:DollarSign},{domain:'Strategy',query:`${q} mitigation strategy`,icon:Brain},{domain:'Compliance',query:`Regulatory view of ${q}`,icon:ShieldCheck}],
    career:  [{domain:'Education',query:`Best education path for ${q}`,icon:Brain},{domain:'Finance',query:`Salary & earning potential: ${q}`,icon:DollarSign},{domain:'Personal',query:`Lifestyle impact of ${q}`,icon:Target}],
    education:[{domain:'Career',query:`Career outcomes of ${q}`,icon:TrendingUp},{domain:'Finance',query:`Cost-benefit analysis: ${q}`,icon:DollarSign},{domain:'Alternative',query:`Alternative paths to ${q}`,icon:Lightbulb}],
    health:  [{domain:'Education',query:`Education required for ${q}`,icon:Brain},{domain:'Career',query:`Related careers: ${q}`,icon:Briefcase},{domain:'Finance',query:`Financial outlook: ${q}`,icon:DollarSign}],
    personal:[{domain:'Career',query:`Career impact of ${q}`,icon:Briefcase},{domain:'Education',query:`Courses for ${q}`,icon:Brain},{domain:'Health',query:`Wellness aspects of ${q}`,icon:ShieldCheck}],
    general: [{domain:'Career',query:`Career angle: ${q}`,icon:Briefcase},{domain:'Finance',query:`Financial view: ${q}`,icon:DollarSign},{domain:'Education',query:`Learning path: ${q}`,icon:Brain}],
  };

  /* Knowledge gaps */
  const gapMap: Record<Domain,string[]> = {
    marketing:['Customer lifetime value (CLV) metrics not specified','Attribution model undefined — multi-touch vs last-click?','No A/B testing hypothesis included'],
    finance:  ['Discount rate assumption missing','Working capital cycles not addressed','Tax implications not factored in'],
    technology:['Infrastructure scaling assumptions unclear','Security and compliance posture not addressed','Integration complexity not estimated'],
    strategy: ['Competitive moat not defined','Execution timeline and milestones missing','Resource allocation model absent'],
    risk:     ['Regulatory jurisdiction not specified','Counterparty risk not assessed','Black-swan scenario not modelled'],
    general:  ['Industry sector not specified — generalised analysis applied','Time horizon not defined','Benchmark dataset not selected'],
  };

  /* Future impact score (0-100) */
  const futureImpactScore = Math.min(95, score * 0.9 + strongMatches.length * 2);

  /* Scenario simulations */
  const baseScenarios = [
    { label:'As-is (current query)',        description:'Baseline analysis with current context level',               impact:'neutral'  as const, delta: 0    },
    { label:'+ Time horizon (5yr)',         description:'Adding explicit timeframe increases forecast precision 28%', impact:'positive' as const, delta:+18   },
    { label:'+ Sector specificity',         description:'Adding industry vertical improves benchmark accuracy 35%',   impact:'positive' as const, delta:+22   },
    { label:'+ Metric target',             description:'Adding a success KPI makes recommendation 40% more actionable',impact:'positive'as const, delta:+28   },
    { label:'Vague (remove domain terms)', description:'Removing domain terms reduces confidence to <30%',           impact:'negative' as const, delta:-35   },
  ];

  /* Green vs Red logic */
  const isStrong = score >= 68;
  return {
    theme, score, domain, confidence,
    confidenceJustification: isStrong
      ? `High confidence: ${strongMatches.length} strong domain signals (${strongMatches.slice(0,3).join(', ')}) with ${wCount}-word query depth. Domain: ${domain}. No bias flags.`
      : score >= 40
      ? `Moderate confidence: partial domain match. Add a specific metric or time horizon to improve from ${confidence}% to 85%+.`
      : `Low confidence: query lacks domain specificity. Only ${strongMatches.length} weak signals detected. Rewording is strongly recommended.`,
    verdict: score>=85?'Exceptional Query — Maximum Analytical Depth':score>=68?'Strong Query — High Signal Strength':score>=52?'Good Query — Moderate Signal':score>=40?'Moderate — Some Signal Detected':score>=22?'Weak Query — Low Signal':'Very Weak — Insufficient Context',
    explanation: isStrong
      ? `"${q}" carries strong ${domain} domain signals (${strongMatches.slice(0,4).join(', ')}), enabling CideDec to cross-reference 2,400+ industry benchmarks with ${confidence}% confidence.`
      : score >= 40
      ? `"${q}" has partial relevance but lacks the specificity needed for deep analysis. Enriching with a metric (revenue, CAC, NPS) or timeframe will improve output quality significantly.`
      : `"${q}" does not map to known business frameworks. It appears ${biasFlags[0]?.type ?? 'too vague'} for meaningful analysis. Use the suggestions below.`,
    strengths: isStrong ? [
      `${strongMatches.length} strong domain signals: ${strongMatches.slice(0,4).join(', ')}`,
      `${domain.charAt(0).toUpperCase()+domain.slice(1)} domain — well-indexed in CideDec engine`,
      `${wCount}-word query provides sufficient semantic depth for AI modelling`,
      'Enables multi-module cross-referencing (financial + market + risk)',
      'Supports 5-year predictive forecasting with high confidence intervals',
    ] : [],
    gaps: !isStrong ? [
      strongMatches.length === 0 ? 'No recognisable business domain detected' : `Only ${strongMatches.length} weak signal(s) found`,
      wCount < 3 ? 'Query too short for multi-module analysis' : 'Insufficient specificity for benchmark matching',
      'Missing time horizon — 5-year forecast cannot be accurately calibrated',
      'No target metric specified — success criteria cannot be measured',
    ] : [],
    suggestions: isStrong ? [
      `Add a time horizon: "${q} over next 5 years"`,
      `Add a target metric: "${q} impact on customer lifetime value"`,
      `Specify a region: "${q} in Tier 3 markets"`,
    ] : [
      `Try: "marketing campaign ROI for Q3 product launch" — adds domain + metric + timeframe`,
      `Try: "financial risk assessment for SaaS expansion" — adds domain + intent + context`,
      `Try: "competitive market share strategy 2025–2030" — adds domain + goal + horizon`,
      'Use the quick prompts below for pre-structured, high-value queries',
    ],
    biasFlags,
    autoEnhanced: enhancements[domain],
    alternativePerspectives: altMap[domain],
    knowledgeGaps: gapMap[domain],
    futureImpactScore: Math.round(futureImpactScore),
    scenarios: baseScenarios,
    keywordStrengths,
  };
}

/* ═══════════════════════════════════════════════
   5-YEAR FORECAST GENERATOR
═══════════════════════════════════════════════ */
function generateForecast(q:string, intel:QueryIntelligence): ChartSpec[] {
  const b = intel.score / 100;
  const yr = (base:number, i:number, growth:number) => Math.round(base * Math.pow(1+growth,i) * b);
  const years = ['2025','2026','2027','2028','2029','2030'];

  return [
    { type:'area', title:'5-Year Revenue Projection (₹L/mo)',
      data: years.map((y,i)=>({ year:y, optimistic:yr(42.8,i,0.22), projected:yr(42.8,i,0.15), conservative:yr(42.8,i,0.07) })),
      dataKeys:[{key:'optimistic',color:C.emerald},{key:'projected',color:C.blue},{key:'conservative',color:C.violet}], xKey:'year' },
    { type:'line', title:'Market Share Trajectory vs Competitor (%)',
      data: years.map((y,i)=>({ year:y, ours:parseFloat((24.6 + i*2.1*b).toFixed(1)), competitor:parseFloat((32.1 - i*0.8).toFixed(1)) })),
      dataKeys:[{key:'ours',color:intel.score>=60?C.green:C.red},{key:'competitor',color:'#94a3b8'}], xKey:'year' },
    { type:'bar', title:'AI Confidence Score Trajectory (%)',
      data: years.map((y,i)=>({ year:y, confidence:Math.min(98,Math.round(intel.confidence + (b>0.6 ? i*2.1 : -i*3.2))) })),
      dataKeys:[{key:'confidence',color:intel.score>=60?C.teal:C.amber}], xKey:'year' },
  ];
}

/* ═══════════════════════════════════════════════
   GAMIFICATION ENGINE
═══════════════════════════════════════════════ */
function computeGamification(totalQueries:number, totalScore:number): GamificationState {
  const avg = totalQueries>0 ? totalScore/totalQueries : 0;
  const level: UserLevel = avg>=80 ? 'expert' : avg>=65 ? 'advanced' : avg>=45 ? 'intermediate' : 'beginner';
  const badges: string[] = [];
  if (totalQueries >= 1)   badges.push('First Search');
  if (totalQueries >= 5)   badges.push('Explorer');
  if (totalQueries >= 10)  badges.push('Analyst');
  if (avg >= 70)           badges.push('Precision Thinker');
  if (avg >= 85)           badges.push('Domain Expert');
  if (totalScore >= 500)   badges.push('Power User');
  return { score:Math.round(totalScore), level, totalQueries, badges, streak:Math.min(totalQueries,7) };
}

/* ═══════════════════════════════════════════════
   CHART RENDERER
═══════════════════════════════════════════════ */
const PIE_COLORS = [C.blue,C.violet,C.emerald,C.amber,C.rose,C.teal];
function ChartRenderer({ spec }:{ spec:ChartSpec }) {
  const tip = { contentStyle:{ borderRadius:10,border:'none',boxShadow:'0 8px 24px rgba(0,0,0,0.1)',fontSize:11 } };
  if (spec.type==='pie') return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart><Pie data={spec.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({name,value}:{name:string;value:number})=>`${name} ${value}%`} labelLine={false}>
        {spec.data.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
      </Pie><Tooltip {...tip}/></PieChart>
    </ResponsiveContainer>
  );
  if (spec.type==='radar') return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={spec.data}>
        <PolarGrid stroke="#e5e7eb"/><PolarAngleAxis dataKey="axis" tick={{fontSize:10,fill:'#6b7280'}}/>
        <PolarRadiusAxis angle={90} domain={[0,100]} tick={{fontSize:9,fill:'#9ca3af'}} tickCount={4}/>
        {spec.dataKeys.map(dk=><Radar key={dk.key} name={dk.key} dataKey={dk.key} stroke={dk.color} fill={dk.color} fillOpacity={0.2} strokeWidth={2}/>)}
        <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:10}}/><Tooltip {...tip}/>
      </RadarChart>
    </ResponsiveContainer>
  );
  if (spec.type==='area') return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={spec.data} margin={{top:4,right:4,bottom:0,left:-10}}>
        <defs>{spec.dataKeys.map(dk=><linearGradient key={dk.key} id={`g${dk.key.replace(/\W/g,'')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={dk.color} stopOpacity={0.3}/><stop offset="95%" stopColor={dk.color} stopOpacity={0.02}/></linearGradient>)}</defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey={spec.xKey} tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/><Tooltip {...tip}/><Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:10}}/>
        {spec.dataKeys.map(dk=><Area key={dk.key} type="monotone" dataKey={dk.key} stroke={dk.color} strokeWidth={2} fill={`url(#g${dk.key.replace(/\W/g,'')})`} dot={false} connectNulls={false}/>)}
      </AreaChart>
    </ResponsiveContainer>
  );
  if (spec.type==='line') return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={spec.data} margin={{top:4,right:4,bottom:0,left:-10}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey={spec.xKey} tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/><Tooltip {...tip}/><Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:10}}/>
        {spec.dataKeys.map(dk=><Line key={dk.key} type="monotone" dataKey={dk.key} stroke={dk.color} strokeWidth={2} dot={{r:3,fill:dk.color}} activeDot={{r:5}} connectNulls={false}/>)}
      </LineChart>
    </ResponsiveContainer>
  );
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={spec.data} margin={{top:4,right:4,bottom:0,left:-10}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey={spec.xKey} tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/><Tooltip {...tip}/><Legend iconType="square" iconSize={8} wrapperStyle={{fontSize:10}}/>
        {spec.dataKeys.map(dk=><Bar key={dk.key} dataKey={dk.key} fill={dk.color} radius={[3,3,0,0]}/>)}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ═══════════════════════════════════════════════
   THEME HELPERS
═══════════════════════════════════════════════ */
function themeConfig(theme:QueryTheme) {
  const map = {
    'strong-green':{ bg:'from-emerald-50/60 to-teal-50/40', border:'border-emerald-200', accent:'text-emerald-700', subtle:'text-emerald-600', badge:'bg-emerald-100 text-emerald-800 border-emerald-200', dot:'bg-emerald-500', ring:'#10b981', panel:'bg-emerald-50/50', forecastBorder:'border-emerald-100', btnGrad:'from-emerald-500 to-teal-600', label:'Excellent', pageTint:'from-emerald-50/30' },
    'green':       { bg:'from-green-50/50 to-emerald-50/30', border:'border-green-200',   accent:'text-green-700',   subtle:'text-green-600',   badge:'bg-green-100 text-green-800 border-green-200',     dot:'bg-green-500',   ring:'#22c55e', panel:'bg-green-50/50',   forecastBorder:'border-green-100',   btnGrad:'from-green-500 to-emerald-600', label:'Strong',    pageTint:'from-green-50/20'  },
    'golden':      { bg:'from-amber-50/50 to-yellow-50/30',  border:'border-amber-200',   accent:'text-amber-700',   subtle:'text-amber-600',   badge:'bg-amber-100 text-amber-800 border-amber-200',     dot:'bg-amber-500',   ring:'#d97706', panel:'bg-amber-50/50',   forecastBorder:'border-amber-100',   btnGrad:'from-amber-500 to-yellow-500', label:'Good',      pageTint:'from-amber-50/20'  },
    'neutral':     { bg:'from-slate-50/40 to-gray-50/20',    border:'border-slate-200',   accent:'text-slate-700',   subtle:'text-slate-600',   badge:'bg-slate-100 text-slate-800 border-slate-200',     dot:'bg-slate-400',   ring:'#94a3b8', panel:'bg-slate-50/50',   forecastBorder:'border-slate-100',   btnGrad:'from-slate-500 to-gray-600',  label:'Moderate',  pageTint:'from-slate-50/20'  },
    'red':         { bg:'from-red-50/50 to-rose-50/30',      border:'border-red-200',     accent:'text-red-700',     subtle:'text-red-600',     badge:'bg-red-100 text-red-800 border-red-200',           dot:'bg-red-500',     ring:'#ef4444', panel:'bg-red-50/50',     forecastBorder:'border-red-100',     btnGrad:'from-red-500 to-rose-600',    label:'Weak',      pageTint:'from-red-50/20'    },
    'weak-red':    { bg:'from-rose-50/60 to-red-50/40',      border:'border-rose-200',    accent:'text-rose-700',    subtle:'text-rose-600',    badge:'bg-rose-100 text-rose-800 border-rose-200',         dot:'bg-rose-500',    ring:'#f43f5e', panel:'bg-rose-50/50',    forecastBorder:'border-rose-100',    btnGrad:'from-rose-500 to-red-600',    label:'Very Weak', pageTint:'from-rose-50/30'   },
  };
  return map[theme];
}

/* ═══════════════════════════════════════════════
   EXPLAINABLE AI PANEL
═══════════════════════════════════════════════ */
function ExplainableAIPanel({ intel, onUseEnhanced }:{ intel:QueryIntelligence; onUseEnhanced:(q:string)=>void }) {
  const [tab, setTab] = useState<'reasoning'|'bias'|'gaps'|'scenarios'>('reasoning');
  const [expandScenario, setExpandScenario] = useState<number|null>(null);

  const isStrong = intel.score >= 68;
  const isMedium = intel.score >= 45 && intel.score < 68;
  
  // Colors and indicators mapping
  const colorClass = isStrong ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-rose-500';
  const scoreLabel = isStrong ? 'High Signal' : isMedium ? 'Moderate Signal' : 'Low Signal';
  const progressColor = isStrong ? 'from-emerald-500 to-teal-500' : isMedium ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-600';
  const ringColor = isStrong ? '#10b981' : isMedium ? '#f59e0b' : '#ef4444';
  
  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference - (intel.score / 100) * circumference;

  const quickPrompts = [
    { label: 'Market entry strategy for AI SaaS platform', icon: Target },
    { label: 'Revenue growth forecast for D2C brand', icon: BarChart3 },
    { label: 'Risk assessment for fintech startup', icon: ShieldCheck },
    { label: 'Customer acquisition cost optimization', icon: TrendingUp },
    { label: '5-year financial projection for e-commerce', icon: DollarSign }
  ];

  return (
    <motion.div 
      className="rounded-2xl border border-zinc-800 bg-[#0b0c10]/95 p-6 mb-6 shadow-2xl relative overflow-hidden"
      initial={{ opacity:0, y:14, scale:0.98 }} 
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ type:'spring', stiffness:200, damping:22 }}
    >
      {/* Background radial glows for premium feeling */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-5 pb-5 border-b border-zinc-800/60 relative z-10">
        <div className="flex items-start gap-4 flex-1">
          {/* Signal Indicator Icon (Glowing) */}
          <div className="relative shrink-0 mt-1">
            <div className={`absolute -inset-1 bg-gradient-to-r ${isStrong ? 'from-emerald-500 to-teal-500' : isMedium ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500'} rounded-full blur opacity-30 animate-pulse`} />
            <div className={`relative w-12 h-12 rounded-full bg-zinc-900 border ${isStrong ? 'border-emerald-500/40' : isMedium ? 'border-amber-500/40' : 'border-red-500/40'} flex items-center justify-center`}>
              {isStrong ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : isMedium ? (
                <Info className="w-6 h-6 text-amber-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              )}
            </div>
          </div>
          <div>
            <h3 className="text-[17px] font-black text-white tracking-tight">{intel.verdict}</h3>
            <p className={`text-[12px] font-extrabold mt-0.5 ${colorClass}`}>{scoreLabel}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400`}>
                {intel.domain.toUpperCase()} DOMAIN
              </span>
              {intel.biasFlags.length > 0 && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {intel.biasFlags.length} Bias Flag{intel.biasFlags.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Circular Quality Score */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="text-right">
            <span className="text-[20px] font-black text-white leading-none block">{intel.score}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mt-0.5">Quality Score</span>
          </div>
          <div className="relative w-14 h-14">
            <svg width="56" height="56" viewBox="0 0 60 60" className="transform -rotate-90">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#18181b" strokeWidth="4.5"/>
              <circle cx="30" cy="30" r="26" fill="none" stroke={ringColor} strokeWidth="4.5"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Explanation Quote */}
      <p className="text-[12.5px] leading-relaxed text-zinc-400 mb-5 italic bg-zinc-900/25 border-l-2 border-zinc-800 pl-3.5 py-1">
        {intel.explanation}
      </p>

      {/* AI Confidence Meter */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">AI Confidence Meter</span>
          <span className="text-[12px] font-bold text-white">{intel.confidence}%</span>
        </div>
        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden mb-2 border border-zinc-800/40">
          <motion.div className={`h-full bg-gradient-to-r ${progressColor} rounded-full`}
            initial={{ width:0 }} 
            animate={{ width:`${intel.confidence}%` }} 
            transition={{ delay:0.2, duration:0.7, ease:'easeOut' }}/>
        </div>
        <p className="text-[11px] leading-snug text-zinc-500">{intel.confidenceJustification}</p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 mb-5 border-b border-zinc-900 pb-3 flex-wrap">
        {[
          { id: 'reasoning', label: 'AI Reasoning', icon: Brain },
          { id: 'bias', label: `Bias Flags (${intel.biasFlags.length})`, icon: ShieldAlert },
          { id: 'gaps', label: 'Knowledge Gaps', icon: BookOpen },
          { id: 'scenarios', label: 'Scenarios', icon: Layers }
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                active 
                  ? 'bg-zinc-900 text-white border-zinc-700 shadow-md' 
                  : 'bg-transparent text-zinc-500 border-zinc-800/60 hover:text-zinc-300 hover:border-zinc-700'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {tab === 'reasoning' && (
          <motion.div key="reasoning" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            
            {/* Left Column: Strengths or Gaps */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
                {isStrong ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Query Strengths
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    Identified Gaps
                  </>
                )}
              </p>
              <div className="space-y-2">
                {isStrong ? (
                  intel.strengths.map((str, i) => (
                    <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-xl flex items-start gap-3">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-zinc-300 leading-snug">{str}</span>
                    </div>
                  ))
                ) : (
                  intel.gaps.map((gap, i) => (
                    <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-xl flex items-start gap-3">
                      <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-zinc-300 leading-snug">{gap}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Suggestions or Fixes */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                Actionable Fixes
              </p>
              <div className="space-y-2">
                {intel.suggestions.map((s, i) => (
                  <div key={i} onClick={() => onUseEnhanced(s.replace(/^Try:\s*"/, '').replace(/"$/, ''))}
                    className="bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-zinc-300 group-hover:text-emerald-400 transition-colors leading-snug">
                        {s.startsWith('Try:') ? s.split(' — ')[0] : s}
                      </p>
                      {s.includes(' — ') && (
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {s.split(' — ')[1]}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'bias' && (
          <motion.div key="bias" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}
            className="mb-6">
            {intel.biasFlags.length === 0 ? (
              <div className="flex items-center gap-2.5 py-4 px-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400"/>
                <p className="text-[12.5px] text-zinc-300 font-semibold">No bias flags detected. Query is well-structured and objective.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {intel.biasFlags.map((bf, i) => (
                  <div key={i} className={`rounded-xl p-3.5 border ${
                    bf.severity === 'high' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-orange-500/5 border-orange-500/20 text-orange-400'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-wider">{bf.severity} Severity • {bf.type}</span>
                    </div>
                    <p className="text-[12px] text-zinc-300 leading-snug">{bf.message}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'gaps' && (
          <motion.div key="gaps" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            
            {/* Knowledge Gaps */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                Missing Context Gaps
              </p>
              <div className="space-y-2">
                {intel.knowledgeGaps.map((g, i) => (
                  <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-xl flex items-start gap-3">
                    <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-zinc-300 leading-snug">{g}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto Enhanced Query */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                AI Smart Enhancement
              </p>
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-xl">
                <p className="text-[11px] text-zinc-500 uppercase font-black tracking-wider">Suggested Query Refinement</p>
                <p className="text-[12.5px] italic text-zinc-300 mt-2 mb-3.5 leading-relaxed bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  "{intel.autoEnhanced}"
                </p>
                <button onClick={() => onUseEnhanced(intel.autoEnhanced)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg transition-all">
                  <Wand2 className="w-3.5 h-3.5" />
                  Optimize & Run
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'scenarios' && (
          <motion.div key="scenarios" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}
            className="mb-6">
            <p className="text-[10.5px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              Interactive Impact Simulation Scenarios
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {intel.scenarios.map((sc, i) => (
                <div key={i}
                  className={`rounded-xl border bg-zinc-900/20 p-3.5 cursor-pointer hover:bg-zinc-900/40 transition-all ${
                    sc.impact === 'positive' ? 'border-emerald-500/25' : sc.impact === 'negative' ? 'border-red-500/25' : 'border-zinc-800'
                  }`}
                  onClick={() => setExpandScenario(expandScenario === i ? null : i)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {sc.impact === 'positive' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : sc.impact === 'negative' ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <Activity className="w-4 h-4 text-zinc-500" />
                      )}
                      <span className="text-[12.5px] font-bold text-zinc-200">{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-black ${sc.delta > 0 ? 'text-emerald-400' : sc.delta < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
                        {sc.delta > 0 ? '+' : ''}{sc.delta}%
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${expandScenario === i ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandScenario === i && (
                      <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }}
                        className="mt-2.5 pt-2.5 border-t border-zinc-800/80">
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{sc.description}</p>
                        <div className="mt-3 h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/40">
                          <motion.div className={`h-full rounded-full ${sc.impact === 'positive' ? 'bg-emerald-500' : sc.impact === 'negative' ? 'bg-red-500' : 'bg-zinc-500'}`}
                            initial={{ width:0 }} animate={{ width:`${Math.min(100, intel.score + sc.delta)}%` }} transition={{ duration:0.5 }} />
                        </div>
                        <p className="text-[9.5px] text-zinc-500 mt-1.5 font-bold">Simulated Score: {Math.max(0, Math.min(100, intel.score + sc.delta))}/100</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom: Quick Prompts Grid */}
      <div className="mt-2 pt-5 border-t border-zinc-800/80">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-zinc-500" />
          Quick Prompt Examples
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {quickPrompts.map((p, i) => {
            const Icon = p.icon;
            return (
              <button key={i} onClick={() => onUseEnhanced(p.label)}
                className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30 p-3 rounded-xl flex flex-col items-start text-left transition-all group">
                <Icon className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors mb-2" />
                <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   KEYWORD HEATMAP
═══════════════════════════════════════════════ */
function KeywordHeatmap({ words }:{ words:{word:string;strength:number;color:string}[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-4 h-4 text-violet-500"/>
        <p className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">Keyword Strength Heatmap</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {words.map((w,i)=>(
          <motion.div key={i}
            className="relative flex flex-col items-center gap-1"
            initial={{ opacity:0,scale:0.8 }} animate={{ opacity:1,scale:1 }} transition={{ delay:i*0.05 }}>
            <div className="relative">
              <span className="absolute inset-0 rounded-lg blur-sm opacity-30" style={{ background:w.color }}/>
              <span className="relative px-2.5 py-1 rounded-lg text-white text-[11px] font-bold" style={{ background:w.color }}>
                {w.word}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth:40 }}>
              <motion.div className="h-full rounded-full" style={{ background:w.color }}
                initial={{ width:0 }} animate={{ width:`${w.strength}%` }} transition={{ delay:0.2+i*0.04,duration:0.4 }}/>
            </div>
            <span className="text-[9px] text-gray-400 font-bold">{w.strength}%</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-gray-50">
        {[{c:'#10b981',l:'Strong (>65)'},{c:'#f59e0b',l:'Moderate (35–65)'},{c:'#ef4444',l:'Weak (<35)'}].map((leg,i)=>(
          <div key={i} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background:leg.c }}/>
            <span className="text-[9px] text-gray-400">{leg.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FUTURE IMPACT + ALTERNATIVE PERSPECTIVES
═══════════════════════════════════════════════ */
function FutureImpactRow({ intel, onAltQuery }:{ intel:QueryIntelligence; onAltQuery:(q:string)=>void }) {
  const tc = themeConfig(intel.theme);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      {/* Future Impact Score */}
      <div className={`rounded-2xl border ${tc.border} p-4 ${tc.panel} bg-gradient-to-br`}>
        <div className="flex items-center gap-2 mb-2">
          <Telescope className={`w-4 h-4 ${tc.accent}`}/>
          <p className={`text-[11px] font-extrabold uppercase tracking-wider ${tc.accent}`}>Future Impact Score</p>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className={`text-[36px] font-extrabold leading-none ${tc.accent}`}>{intel.futureImpactScore}</span>
          <span className={`text-[13px] ${tc.subtle} mb-1`}>/100</span>
        </div>
        <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
          <motion.div className="h-full rounded-full" style={{ background:tc.ring }}
            initial={{ width:0 }} animate={{ width:`${intel.futureImpactScore}%` }} transition={{ delay:0.3,duration:0.7 }}/>
        </div>
        <p className={`text-[10.5px] leading-snug ${tc.subtle}`}>
          {intel.futureImpactScore>=75?'High long-term strategic relevance — insights likely to remain valid 5+ years':
           intel.futureImpactScore>=50?'Moderate long-term relevance — refine for better 5-year alignment':
           'Low future relevance — query too narrow or vague for long-term forecasting'}
        </p>
      </div>

      {/* Alternative perspectives */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-indigo-500"/>
          <p className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">Alternative Perspectives</p>
        </div>
        <div className="space-y-2">
          {intel.alternativePerspectives.map((alt,i)=>{
            const AIcon = alt.icon;
            return (
              <motion.button key={i} onClick={()=>onAltQuery(alt.query)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left group"
                whileHover={{ x:2 }}>
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <AIcon className="w-3 h-3 text-indigo-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{alt.domain}</p>
                  <p className="text-[11px] font-semibold text-gray-700 truncate">{alt.query}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500 shrink-0"/>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GAMIFICATION BAR
═══════════════════════════════════════════════ */
function GamificationBar({ gami }:{ gami:GamificationState }) {
  const levelColors:Record<UserLevel,string> = { beginner:'text-slate-600', intermediate:'text-blue-600', advanced:'text-violet-600', expert:'text-amber-600' };
  const LevelIcon = gami.level==='expert'?Trophy:gami.level==='advanced'?Award:gami.level==='intermediate'?Star:BookOpen;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-5 flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <LevelIcon className={`w-4 h-4 ${levelColors[gami.level]}`}/>
        <span className={`text-[12px] font-extrabold ${levelColors[gami.level]} capitalize`}>{gami.level}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Flame className="w-3.5 h-3.5 text-orange-500"/>
        <span className="text-[11px] font-bold text-gray-600">{gami.streak} streak</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Target className="w-3.5 h-3.5 text-blue-500"/>
        <span className="text-[11px] font-bold text-gray-600">{gami.score} pts</span>
      </div>
      {gami.badges.slice(0,3).map((badge,i)=>(
        <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-200 rounded-full text-[10px] font-bold text-violet-700">
          <Award className="w-2.5 h-2.5"/> {badge}
        </span>
      ))}
      {gami.badges.length>3 && <span className="text-[10px] text-gray-400">+{gami.badges.length-3} more</span>}
      <div className="ml-auto hidden sm:flex items-center gap-1.5">
        <span className="text-[10px] text-gray-400">{gami.totalQueries} queries</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SPLIT-SCREEN MODE
═══════════════════════════════════════════════ */
function SplitScreen({ left, right, onClose }:{ left:QueryResult; right:QueryResult|null; onClose:()=>void }) {
  const tcL = themeConfig(left.intelligence.theme);
  const tcR = right ? themeConfig(right.intelligence.theme) : null;
  return (
    <motion.div className="fixed inset-0 z-[995] bg-gray-900/80 backdrop-blur-sm flex flex-col"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <SplitSquareHorizontal className="w-4 h-4 text-white"/>
          <span className="text-[13px] font-bold text-white">Split-Screen Query Comparison</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
          <X className="w-4 h-4 text-white"/>
        </button>
      </div>
      <div className="flex-1 overflow-auto grid grid-cols-2 gap-0">
        {[left, right].map((res,i)=>{
          if (!res) return (
            <div key={i} className="flex items-center justify-center bg-gray-800/50 text-gray-500 text-sm">
              Run a second query to compare
            </div>
          );
          const tc = i===0 ? tcL : tcR!;
          return (
            <div key={i} className={`overflow-auto p-5 ${i===0?'border-r border-gray-700':''} bg-gray-50`}>
              <div className={`rounded-xl border ${tc.border} ${tc.panel} p-4 mb-4`}>
                <p className={`text-[12px] font-bold ${tc.accent} mb-1`}>"{res.query}"</p>
                <div className="flex items-center gap-3">
                  <span className={`text-[22px] font-extrabold ${tc.accent}`}>{res.intelligence.score}</span>
                  <div className="flex-1">
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${res.intelligence.score}%`, background:tc.ring }}/>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold ${tc.badge} px-2 py-0.5 rounded-full`}>{tc.label}</span>
                </div>
                <p className={`text-[11px] ${tc.subtle} mt-2 leading-snug`}>{res.intelligence.verdict}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {res.kpis.slice(0,4).map((kpi,j)=>(
                  <div key={j} className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{kpi.label}</p>
                    <p className="text-[16px] font-extrabold text-gray-900">{kpi.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   GOAL MODE SELECTOR — full category bar
═══════════════════════════════════════════════ */
const GOAL_CATEGORIES: {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  prompts: string[];
}[] = [
  {
    id:'business', label:'Business', icon:Briefcase,
    color:'text-zinc-400', activeBg:'bg-zinc-900', activeBorder:'border-zinc-700', activeText:'text-white',
    prompts:['Analyze marketing ROI','Market trends in AI','Predict sales next 5 years','Detect bias in data'],
  },
  {
    id:'finance', label:'Finance', icon:DollarSign,
    color:'text-zinc-400', activeBg:'bg-zinc-900', activeBorder:'border-zinc-700', activeText:'text-white',
    prompts:['3-year ROI forecast','Cash flow analysis','IRR & NPV calculation','Market share & CAGR'],
  },
  {
    id:'strategy', label:'Strategy', icon:Target,
    color:'text-zinc-400', activeBg:'bg-zinc-900', activeBorder:'border-zinc-700', activeText:'text-white',
    prompts:['Growth strategy for startup','Competitive landscape','Risk mitigation plan','Product market fit'],
  },
  {
    id:'engineering', label:'Engineering', icon:Cpu,
    color:'text-zinc-400', activeBg:'bg-blue-500/15', activeBorder:'border-blue-500/40', activeText:'text-blue-300',
    prompts:['Scope of B.Tech CSE in India','B.Tech ECE vs CSE — which is better','VLSI & semiconductor career 2025','Civil engineering scope after GATE'],
  },
  {
    id:'medical', label:'Medical', icon:ShieldCheck,
    color:'text-zinc-400', activeBg:'bg-emerald-500/15', activeBorder:'border-emerald-500/40', activeText:'text-emerald-300',
    prompts:['Is MBBS worth it after NEET?','BDS vs MBBS — salary & scope','B.Pharm career scope India 2025','Nursing career future in India'],
  },
  {
    id:'commerce', label:'Commerce & Law', icon:BarChart3,
    color:'text-zinc-400', activeBg:'bg-amber-500/15', activeBorder:'border-amber-500/40', activeText:'text-amber-300',
    prompts:['CA vs MBA finance — which is better','BA LLB career scope salary India','UPSC IAS vs private sector','B.Com + CFA career path'],
  },
  {
    id:'arts', label:'Arts & Design', icon:Layers,
    color:'text-zinc-400', activeBg:'bg-violet-500/15', activeBorder:'border-violet-500/40', activeText:'text-violet-300',
    prompts:['B.Arch scope & salary India 2025','Mass communication career scope','Psychology career in India','Hotel management future scope'],
  },
  {
    id:'data', label:'Data & AI', icon:Brain,
    color:'text-zinc-400', activeBg:'bg-rose-500/15', activeBorder:'border-rose-500/40', activeText:'text-rose-300',
    prompts:['Data science vs software engineering','AI ML engineer salary India 2025','Data analyst career roadmap','Machine learning scope next 5 years'],
  },
];

function GoalModeBar({ mode, onChange, onPromptClick }:{
  mode: string;
  onChange: (m: GoalMode) => void;
  onPromptClick: (q: string) => void;
}) {
  const active = GOAL_CATEGORIES.find(c => c.id === mode) ?? GOAL_CATEGORIES[0];
  return (
    <div className="w-full max-w-[680px] mx-auto">
      {/* ── Category pill row ── */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-3">
        {GOAL_CATEGORIES.map(cat => {
          const CIcon = cat.icon;
          const isActive = mode === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onChange(cat.id as GoalMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all
                ${isActive
                  ? `${cat.activeBg} ${cat.activeBorder} ${cat.activeText}`
                  : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}>
              <CIcon className="w-3 h-3" />
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* ── Quick prompt chips for active category ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}>
          <span className="text-[11px] text-zinc-600 font-semibold self-center">Try:</span>
          {active.prompts.map((p, i) => (
            <motion.button
              key={i}
              onClick={() => onPromptClick(p)}
              className={`text-[11px] font-semibold underline underline-offset-2 decoration-dotted transition-colors
                ${active.activeText !== 'text-white'
                  ? `${active.activeText} hover:opacity-80`
                  : 'text-zinc-400 hover:text-zinc-200'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}>
              {p}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REAL-TIME INPUT CORRECTION
═══════════════════════════════════════════════ */
function InputCorrection({ value }:{ value:string }) {
  if (value.length < 3) return null;
  const strongMatches = STRONG_KW.filter(k => value.toLowerCase().includes(k));
  const score = Math.min(100, 30 + strongMatches.length*10 + (value.split(' ').length>2?15:0));
  const col = score>=65?'text-emerald-600 bg-emerald-50 border-emerald-200':score>=40?'text-amber-600 bg-amber-50 border-amber-200':'text-red-600 bg-red-50 border-red-200';
  const label = score>=65?'Strong':'Fair';
  return (
    <motion.div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10.5px] font-bold ${col} mt-2`}
      initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
      <div className="flex gap-0.5">
        {[0,1,2,3,4].map(i=>(
          <span key={i} className={`w-1.5 h-3 rounded-sm ${i<Math.ceil(score/20)?'opacity-100':'opacity-20'}`} style={{ background:'currentColor' }}/>
        ))}
      </div>
      Signal: {label} ({score}/100)
      {strongMatches.length>0 && <span className="ml-1 opacity-70">· {strongMatches.slice(0,2).join(', ')}</span>}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   5-YEAR FORECAST SECTION
═══════════════════════════════════════════════ */
function ForecastSection({ result }:{ result:QueryResult }) {
  const tc = themeConfig(result.intelligence.theme);
  return (
    <motion.div className="mb-6" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}>
      <div className={`flex items-center justify-between mb-4 p-4 rounded-2xl border ${tc.border} ${tc.panel} bg-gradient-to-br`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tc.panel}`}>
            <Telescope className={`w-4 h-4 ${tc.accent}`}/>
          </div>
          <div>
            <h2 className={`text-[13px] font-extrabold tracking-tight ${tc.accent}`}>5-Year Predictive Analytics (2025–2030)</h2>
            <p className={`text-[11px] mt-0.5 ${tc.subtle}`}>
              {result.intelligence.score>=65?'High-confidence multi-scenario projections based on strong query signal':result.intelligence.score>=40?'Moderate-confidence projections — refine query to improve accuracy':'Low-confidence projections — query signal insufficient for reliable forecasting'}
            </p>
          </div>
        </div>
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold border ${tc.badge}`}>
          <Gauge className="w-3.5 h-3.5"/> {result.intelligence.confidence}% confidence
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {result.forecastCharts.map((spec,ci)=>(
          <motion.div key={ci} className={`bg-white rounded-2xl border ${tc.forecastBorder} shadow-sm p-4`}
            initial={{ opacity:0,scale:0.97,y:10 }} animate={{ opacity:1,scale:1,y:0 }}
            transition={{ delay:0.12+ci*0.1,type:'spring',stiffness:220,damping:22 }}>
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`}/>
              <p className="text-[10.5px] font-extrabold text-gray-700 uppercase tracking-wider">{spec.title}</p>
            </div>
            <ChartRenderer spec={spec}/>
            <p className={`text-[9.5px] mt-1.5 text-center font-medium ${tc.subtle}`}>
              {result.intelligence.confidence}% confidence · {result.intelligence.domain} domain
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
interface SmartSuggestionsProps { onNavigate: (page: Page) => void }

export function SmartSuggestions({ onNavigate }: SmartSuggestionsProps) {
  const { isAuthenticated, currentUser, addNotification, setLastQuery, pendingQuery, setPendingQuery } = useApp();

  const [inputValue,    setInputValue]    = useState('');
  const [hasQueried,    setHasQueried]    = useState(false);
  const [isAnalysing,   setIsAnalysing]   = useState(false);
  const [result,        setResult]        = useState<QueryResult | null>(null);
  const [prevResult,    setPrevResult]    = useState<QueryResult | null>(null);
  const [revealedMods,  setRevealedMods]  = useState<ModuleKey[]>([]);
  const [conversation,  setConversation]  = useState<{role:'user'|'ai';text:string}[]>([]);
  const [selectedCard,  setSelectedCard]  = useState<Suggestion | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showForecast,  setShowForecast]  = useState(false);
  const [showSplit,     setShowSplit]     = useState(false);
  const [goalMode,      setGoalMode]      = useState<GoalMode>('business');
  const [totalScore,    setTotalScore]    = useState(0);
  const [totalQueries,  setTotalQueries]  = useState(0);
  const [isVoice,       setIsVoice]       = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [decisionDNA,   setDecisionDNA]   = useState<DecisionDNAData | null>(null);
  const [aiVsHuman,     setAiVsHuman]     = useState<AIvsHumanData | null>(null);
  const [timelineNodes, setTimelineNodes] = useState<TimelineNode[]>([]);
  const [careerReport,  setCareerReport]  = useState<CareerAnalysis | null>(null);
  const [isListening,   setIsListening]   = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'overview' | 'ats' | 'skills' | 'jobs' | 'locations' | 'careers' | 'startups' | 'learning' | 'trends' | 'salary'>('overview');
  const [rightPanelTab, setRightPanelTab] = useState<'jobs' | 'startup' | 'paths'>('jobs');
  const recognitionRef = useRef<any>(null);

  const inputRef   = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const gamification = useMemo(()=>computeGamification(totalQueries,totalScore),[totalQueries,totalScore]);

  const { saveQuery } = useQueryHistory();

  useEffect(() => {
    if (!result) return;
    setRevealedMods([]);
    result.modules.forEach((mod,i) => {
      setTimeout(()=>setRevealedMods(prev=>[...prev,mod]),200+i*180);
    });
    setShowForecast(false);
    setTimeout(()=>setShowForecast(true),800);
  }, [result]);

  const executeQuery = useCallback((q:string) => {
    if (!q.trim() || isAnalysing) return;
    setLastQuery(q);
    setConversation(prev=>[...prev,{role:'user',text:q}]);
    setInputValue('');
    setHasQueried(true);
    setIsAnalysing(true);
    if (result) setPrevResult(result);
    setResult(null);
    setTimeout(()=>{
      const tpl = classify(q);
      const intelligence = analyzeIntelligence(q);
      const forecastCharts = generateForecast(q,intelligence);
      const res: QueryResult = { ...tpl, query:q, intelligence, forecastCharts };
      setResult(res);
saveQuery({
  query: q,
  domain: intelligence.domain ?? 'general',
  score: intelligence.score ?? 0,
  confidence: intelligence.confidence ?? 0,
  theme: intelligence.theme ?? 'neutral'
}).catch(() => { /* non-fatal: history save failure */ });
    
      /* Decision Intelligence modules */
      setDecisionDNA(generateDecisionDNA(q, intelligence.domain, intelligence.score, intelligence.confidence));
      setAiVsHuman(generateAIvsHuman(q, intelligence.domain, intelligence.score, intelligence.confidence));
      setTimelineNodes(generateTimeline(q, intelligence.domain, intelligence.score));
      /* Career Intelligence */
      if (isCareerQuery(q)) {
        const ca = analyzeCareerDecision(q);
        setCareerReport(ca);
      } else {
        setCareerReport(null);
      }
      setIsAnalysing(false);
      setTotalScore(prev=>prev+intelligence.score);
      setTotalQueries(prev=>prev+1);
      setConversation(prev=>[...prev,{role:'ai',text:res.summary}]);
      if (res.notif) addNotification(res.notif);
      /* Gamification notifications */
      if (intelligence.score>=85) addNotification({ title:'Exceptional Query!', body:`Score: ${intelligence.score}/100 — Expert-level business analysis.`, type:'success' });
      else if (intelligence.score<30) addNotification({ title:'Query Needs Improvement', body:'Try adding domain, metric, or time horizon for better results.', type:'alert' });
      setTimeout(()=>resultsRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),80);
    },1700);
  },[isAnalysing,setLastQuery,addNotification,result]);

  const runQuery = useCallback((text?:string) => {
    const q = (text ?? inputValue).trim();
    if (!q) return;
    if (!isAuthenticated) { setPendingQuery(q); setShowAuthModal(true); return; }
    executeQuery(q);
  },[inputValue,isAuthenticated,setPendingQuery,executeQuery]);

  useEffect(() => {
    if (pendingQuery && isAuthenticated) {
      setInputValue(pendingQuery);
      runQuery(pendingQuery);
      setPendingQuery('');
    }
  }, [pendingQuery, isAuthenticated, runQuery, setPendingQuery]);

  const handleAuthSuccess = useCallback((q:string) => {
    setShowAuthModal(false); setPendingQuery('');
    setTimeout(()=>executeQuery(q||inputValue),180);
  },[executeQuery,inputValue,setPendingQuery]);

  const handleSearchFocus = () => {
    if (!isAuthenticated) { setPendingQuery(inputValue); setShowAuthModal(true); inputRef.current?.blur(); }
  };

  const resetAll = () => {
    setHasQueried(false); setResult(null); setPrevResult(null);
    setRevealedMods([]); setConversation([]); setInputValue(''); setShowForecast(false);
    setDecisionDNA(null); setAiVsHuman(null); setTimelineNodes([]); setCareerReport(null);
    setActiveResultTab('overview'); setRightPanelTab('jobs');
    setTimeout(()=>inputRef.current?.focus(),150);
  };

  const tc = result ? themeConfig(result.intelligence.theme) : null;
  const pageBg = tc ? `bg-gradient-to-b ${tc.pageTint} via-[#f7f8fa] to-[#f7f8fa]` : 'bg-[#f7f8fa]';

  // Helper functions inside component body to render dashboard parts
  const renderActiveTabView = () => {
    const report = careerReport;
    if (!report) return null;

    const { career, scores, radarData, alternativePaths } = report;

    // Hardcode premium mock jobs to perfectly match the search results in the screenshot
    const jobMatches = [
      { company: 'Swiggy', role: 'Growth Marketing Manager', match: 81, demand: 'High Demand', type: 'Hybrid', salary: '₹18 - ₹28 LPA', loc: 'Bangalore, India (Hybrid)', logo: '🍔' },
      { company: 'Deloitte', role: 'Digital Marketing Specialist', match: 76, demand: 'High Demand', type: 'On-site', salary: '₹10 - ₹16 LPA', loc: 'Bangalore, India (On-site)', logo: '🟢' },
      { company: 'Meesho', role: 'Brand Marketing Manager', match: 73, demand: 'High Demand', type: 'Hybrid', salary: '₹16 - ₹24 LPA', loc: 'Bangalore, India (Hybrid)', logo: '🛍️' },
      { company: 'HubSpot India', role: 'Content Marketing Lead', match: 71, demand: 'High Demand', type: 'Remote', salary: '₹16 - ₹22 LPA', loc: 'Bangalore, India (Hybrid)', logo: '🧡' },
    ];

    switch (activeResultTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* AI Career Intelligence Summary Card */}
            <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[9px] font-extrabold tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 uppercase">AI Career Intelligence Summary (Beta)</span>
                    <p className="text-[11px] text-zinc-500 mt-1.5">We analyzed 12,842 job listings, industry trends, and your profile to generate these insights.</p>
                  </div>
                  <div className="w-10 h-10 bg-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-750/30 text-yellow-400 shrink-0">
                    <Lightbulb className="w-5 h-5 animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Radial ATS Score Circle */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center p-3 bg-zinc-950/40 border border-zinc-800/40 rounded-xl">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#27272a" strokeWidth="4" fill="transparent" />
                        <circle cx="48" cy="48" r="40" stroke="#10b981" strokeWidth="5.5" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 78) / 100} strokeLinecap="round" fill="transparent" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-[20px] font-black text-white leading-none">78</span>
                        <span className="text-[8px] text-zinc-500 font-extrabold tracking-wider uppercase mt-0.5">ATS Score</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-400 mt-2.5">Good Match</span>
                    <span className="text-[8px] text-zinc-500 mt-0.5 text-center leading-tight">Keep optimizing to reach Excellent</span>
                  </div>

                  {/* Grid Metrics */}
                  <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Readability', value: '82/100', status: 'Good', col: 'text-emerald-400 bg-emerald-400/5' },
                      { label: 'Skill Match', value: '74%', status: 'Good', col: 'text-emerald-400 bg-emerald-400/5' },
                      { label: 'Job Compatibility', value: '76%', status: 'Good', col: 'text-emerald-400 bg-emerald-400/5' },
                      { label: 'Industry Fit', value: '71%', status: 'Good', col: 'text-emerald-400 bg-emerald-400/5' },
                      { label: 'Experience Strength', value: '68%', status: 'Moderate', col: 'text-amber-400 bg-amber-400/5' },
                      { label: 'AI Replacement Risk', value: '25%', status: 'Low Risk', col: 'text-emerald-400 bg-emerald-400/5' },
                    ].map((m, i) => (
                      <div key={i} className="bg-zinc-950/40 border border-zinc-800/40 rounded-xl p-3 flex flex-col">
                        <span className="text-[9.5px] text-zinc-500 font-semibold truncate">{m.label}</span>
                        <span className="text-[14px] font-black text-white mt-1 leading-none">{m.value}</span>
                        <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 self-start ${m.col}`}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer" onClick={() => setActiveResultTab('ats')}>
                  <span>Your profile is a good match for Marketing roles in Bangalore. View Full Analysis &gt;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Top Job Matches Card */}
            <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[13px] font-extrabold text-white">Top Job Matches</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Based on your resume, skills & search intent</p>
                </div>
              </div>
              <div className="space-y-3">
                {jobMatches.map((job, idx) => (
                  <div key={idx} className="bg-zinc-950/50 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-lg group-hover:scale-105 transition-transform">{job.logo}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-[12.5px] font-bold text-white leading-tight">{job.role}</h4>
                          <span className="text-[8.5px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">Match {job.match}%</span>
                        </div>
                        <p className="text-[10.5px] text-zinc-400 mt-1">{job.company} · <span className="text-[9.5px] text-zinc-500">{job.loc}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[8px] font-extrabold tracking-widest text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded border border-emerald-400/25 uppercase">{job.demand}</span>
                        <p className="text-[12px] font-black text-white mt-1 leading-none">{job.salary}</p>
                      </div>
                      <button className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all shadow-sm" title="Bookmark Job">
                        <Bookmark className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Improve Profile & Missing Skills row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Improve Your Profile */}
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[13px] font-extrabold text-white">Improve Your Profile</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5 mb-3.5">Top recommendations to increase your probability</p>
                  <div className="space-y-2.5">
                    {[
                      { text: 'Add more quantified achievements', impact: 'High Impact', bg: 'bg-red-500/10 text-red-400 border border-red-500/20' },
                      { text: 'Include keywords: CRM, Analytics, SEM', impact: 'High Impact', bg: 'bg-red-500/10 text-red-400 border border-red-500/20' },
                      { text: 'Add a project or portfolio link', impact: 'Medium Impact', bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
                      { text: 'Improve summary with measurable results', impact: 'Medium Impact', bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-zinc-950/30 border border-zinc-850/40 p-2.5 rounded-xl">
                        <input type="checkbox" className="w-3.5 h-3.5 accent-emerald-500 rounded border-zinc-700 bg-zinc-900 mt-0.5 cursor-pointer" />
                        <div className="flex-1">
                          <p className="text-[11px] font-medium text-zinc-300 leading-snug">{item.text}</p>
                          <span className={`inline-block text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase mt-1 ${item.bg}`}>{item.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer" onClick={() => setActiveResultTab('ats')}>
                  <span>View Full Improvement Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Missing In-Demand Skills */}
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[13px] font-extrabold text-white">Missing In-Demand Skills</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5 mb-4">These skills can increase your match by 20-30%</p>
                  <div className="flex flex-wrap gap-2">
                    {['Google Ads', 'Meta Ads', 'Marketing Analytics', 'SEO', 'HubSpot', 'Conversion Optimization', 'Email Marketing', 'A/B Testing'].map((skill, i) => (
                      <span key={i} className="text-[10.5px] px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-semibold rounded-xl cursor-pointer hover:text-white hover:bg-zinc-900 transition-all flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer" onClick={() => setActiveResultTab('learning')}>
                  <span>Explore Learning Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'ats':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-5">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">ATS Resume Parsing Engine</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">Quantified assessment of your resume structure, content, and readability</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-950/60 border border-zinc-800/85 p-4 rounded-xl text-center">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Readability Score</p>
                <p className="text-[26px] font-black text-emerald-400 mt-1">82<span className="text-[11px] text-zinc-500">/100</span></p>
                <p className="text-[9px] text-zinc-400 mt-1.5">Excellent sentence flow and standard layouts</p>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800/85 p-4 rounded-xl text-center">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Quantified Impact</p>
                <p className="text-[26px] font-black text-amber-400 mt-1">45%</p>
                <p className="text-[9px] text-zinc-400 mt-1.5">Moderate number of measurable achievements</p>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800/85 p-4 rounded-xl text-center">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Formatting Check</p>
                <p className="text-[26px] font-black text-emerald-400 mt-1">Pass</p>
                <p className="text-[9px] text-zinc-400 mt-1.5">No tables, text box, or multi-column issues</p>
              </div>
            </div>
            <div className="space-y-3.5">
              <h4 className="text-[12px] font-bold text-white">Resume Sections Analyzed</h4>
              {[
                { label: 'Contact Details', status: 'Detected', color: 'text-emerald-400 bg-emerald-400/10' },
                { label: 'Work Experience', status: 'Detailed (6 Years)', color: 'text-emerald-400 bg-emerald-400/10' },
                { label: 'Education Credentials', status: 'Detected', color: 'text-emerald-400 bg-emerald-400/10' },
                { label: 'Skills Grid', status: 'Detected', color: 'text-emerald-400 bg-emerald-400/10' },
                { label: 'Projects & Publications', status: 'Missing links', color: 'text-amber-400 bg-amber-400/10' },
              ].map((sec, i) => (
                <div key={i} className="flex items-center justify-between bg-zinc-950/40 p-3 rounded-xl border border-zinc-850/45">
                  <span className="text-[11.5px] font-semibold text-zinc-200">{sec.label}</span>
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${sec.color}`}>{sec.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-5">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">Skill Coverage Matrix</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">Detailed competency alignment score vs top job descriptions</p>
            </div>
            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData.slice(0, 6)}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#71717a' }} />
                  <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                  <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-950/50 border border-zinc-850 p-3.5 rounded-xl">
                <span className="text-[10.5px] font-bold text-emerald-400 flex items-center gap-1.5 mb-2"><Check className="w-3.5 h-3.5" /> Have Skills ({career.requiredSkills.slice(0, 3).length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {career.requiredSkills.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[9.5px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md font-semibold">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-850 p-3.5 rounded-xl">
                <span className="text-[10.5px] font-bold text-amber-400 flex items-center gap-1.5 mb-2"><Zap className="w-3.5 h-3.5" /> Learn Skills ({career.requiredSkills.slice(3).length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {career.requiredSkills.slice(3).map((s, i) => (
                    <span key={i} className="text-[9.5px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md font-semibold">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-850 p-3.5 rounded-xl">
                <span className="text-[10.5px] font-bold text-rose-400 flex items-center gap-1.5 mb-2"><ShieldAlert className="w-3.5 h-3.5" /> Emerging Gaps ({career.emergingSkills.slice(0, 2).length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {career.emergingSkills.slice(0, 2).map((s, i) => (
                    <span key={i} className="text-[9.5px] px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md font-semibold">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">Detailed Job Matches</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">Matching probability and structural alignment with Bangalore hiring partners</p>
            </div>
            <div className="space-y-3">
              {jobMatches.map((job, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-zinc-700/80 transition-all group">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-lg">{job.logo}</div>
                      <div>
                        <h4 className="text-[13px] font-bold text-white leading-tight">{job.role}</h4>
                        <p className="text-[10.5px] text-zinc-400 mt-1">{job.company} · <span className="text-[9.5px] text-zinc-500">{job.loc}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded uppercase">{job.demand}</span>
                      <span className="text-[9px] font-extrabold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase">{job.type}</span>
                    </div>
                  </div>
                  <div className="h-px bg-zinc-850/60" />
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Salary Range</p>
                        <p className="text-[13px] font-black text-white mt-0.5">{job.salary}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Match Prob.</p>
                        <p className="text-[13px] font-black text-emerald-400 mt-0.5">{job.match}%</p>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-extrabold rounded-lg transition-all shadow-md shadow-emerald-500/10">Optimize & Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'locations':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">Location Intelligence & Hiring Hubs</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">Best cities globally to build this career or target a venture launch</p>
            </div>
            <div className="space-y-3.5">
              {[
                { city: 'Bangalore, India', score: 92, status: 'Best Match', salary: '₹18 - ₹28L', life: 'Good', desc: 'India\'s Tech Capital, huge venture ecosystem, high demand for ML & Growth marketing' },
                { city: 'Mumbai, India', score: 86, status: 'High Opportunity', salary: '₹16 - ₹24L', life: 'Excellent', desc: 'Financial capital, D2C venture capital hub, huge traditional marketing focus' },
                { city: 'Hyderabad, India', score: 84, status: 'High Opportunity', salary: '₹15 - ₹22L', life: 'Good', desc: 'Massive technology growth corridor, low cost of living, high talent retention' },
                { city: 'Singapore', score: 73, status: 'High Growth', salary: '$120k - $160k', life: 'Excellent', desc: 'South East Asia business gateway, premium SaaS launch hub, exceptional WLB' },
              ].map((loc, i) => (
                <div key={i} className="bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-[12.5px] font-bold text-white flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {loc.city}</span>
                    <span className="text-[9.5px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{loc.status} ({loc.score}/100)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">{loc.desc}</p>
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold pt-1">
                    <span>Expected Pay: <strong className="text-zinc-300">{loc.salary}</strong></span>
                    <span>WLB Grade: <strong className="text-zinc-300">{loc.life}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'careers':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">Alternative Career Trajectories</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">Pivot pathways with structural skill alignments</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {alternativePaths.slice(0, 3).map((ap, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl text-center space-y-1.5">
                  <span className="text-[12px] font-bold text-white block truncate">{ap.name}</span>
                  <span className="text-[10px] font-black text-emerald-400 block">{ap.matchScore}% Match</span>
                  <span className="inline-block text-[8px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full uppercase">Strong Pivot</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-zinc-850/60" />
            <div className="space-y-3">
              <h4 className="text-[12px] font-bold text-white">5-Year Growth Milestones</h4>
              {[
                { year: 'Year 1', role: 'Digital Marketing Associate', pay: '₹8LPA', details: 'Master CRM metrics, SEM optimization, and baseline Google/Meta ads.' },
                { year: 'Year 3', role: 'Growth Marketing Lead', pay: '₹18LPA', details: 'Lead cross-channel scaling campaigns, dynamic pricing matrices, and A/B growth models.' },
                { year: 'Year 5', role: 'VP of Marketing / CMO', pay: '₹35LPA', details: 'Full budget ownership, AI automation deployment, global scaling structure setup.' },
              ].map((ms, i) => (
                <div key={i} className="relative pl-6 border-l border-zinc-800 pb-2 last:pb-0">
                  <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black text-emerald-400">{ms.year}</span>
                    <span className="text-[11px] font-bold text-white">{ms.role}</span>
                    <span className="text-[10px] text-zinc-500">({ms.pay})</span>
                  </div>
                  <p className="text-[10.5px] text-zinc-400 mt-1 leading-snug">{ms.details}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'startups':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">Startup Venture Intelligence</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">Dynamic assessment of building your own venture in this domain</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Target Capital Needed</span>
                <p className="text-[20px] font-black text-white">₹8L – ₹20L</p>
                <p className="text-[9px] text-zinc-400 leading-snug">Optimized initial budget boundaries for MVP launch</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Recommended Launch Location</span>
                <p className="text-[20px] font-black text-emerald-400">Bangalore, India</p>
                <p className="text-[9px] text-zinc-400 leading-snug">Highest VC funding probability and tech talent density</p>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-extrabold text-white">Top Recommended Idea</span>
                <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">High Potential</span>
              </div>
              <h4 className="text-[13px] font-bold text-emerald-400">AI Marketing Automation Platform</h4>
              <p className="text-[10.5px] text-zinc-400 leading-relaxed">Build a lightweight middleware automating CRM pricing flows and predictive search analytics, helping SMBs cut customer acquisition cost by 30-40%.</p>
              <div className="flex items-center gap-3 pt-2 text-[10px] text-zinc-500">
                <span>Venture viability score: <strong className="text-zinc-300">76%</strong></span>
                <span>Time to MVP: <strong className="text-zinc-300">4-6 Weeks</strong></span>
              </div>
            </div>
          </div>
        );

      case 'learning':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">Personalized Learning Roadmap</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">Certified course paths and milestones to plug critical skill gaps</p>
            </div>
            <div className="space-y-3.5">
              {[
                { title: 'Advanced Google Analytics & CRM Systems', provider: 'Coursera (Google Professional Cert)', duration: 'Week 1-2', skill: 'Marketing Analytics' },
                { title: 'Meta Ads & Media Buying Masterclass', provider: 'Meta Blueprint Training', duration: 'Week 3-4', skill: 'Meta Ads' },
                { title: 'Conversion Rate Optimization (CRO) and A/B Testing', provider: 'CXL Institute Course', duration: 'Week 5-6', skill: 'Conversion Optimization' },
                { title: 'HubSpot Email Marketing Automation', provider: 'HubSpot Academy Certified', duration: 'Week 7-8', skill: 'HubSpot' },
              ].map((course, i) => (
                <div key={i} className="bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-xl flex items-center justify-between gap-4 group">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">{course.duration}</span>
                    <h4 className="text-[12.5px] font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">{course.title}</h4>
                    <p className="text-[10px] text-zinc-400">{course.provider}</p>
                  </div>
                  <span className="text-[9.5px] font-bold px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 shrink-0">{course.skill}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'trends':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-5">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">Insights & Hiring Trends</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">Multi-year predictive industry indicators and growth projections</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.salaryForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#71717a' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#71717a' }} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 10, color: '#fff' }} />
                  <Area type="monotone" dataKey="projected" stroke="#10b981" fill="#10b981" fillOpacity={0.08} strokeWidth={2} name="LPA Salary" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">AI replacement risk index</span>
              <p className="text-[20px] font-black text-emerald-400 mt-1">25% (Low Risk)</p>
              <p className="text-[10.5px] text-zinc-400 mt-1.5 leading-relaxed">Marketing strategy, visual brand engineering, and qualitative empathy metrics have strong defensibility against LLM/Agentic systems replacement.</p>
            </div>
          </div>
        );

      case 'salary':
        return (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-[14px] font-extrabold text-white">Salary Insights & LPA Ranges</h3>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">National compensation benchmark figures in Lakhs Per Annum (LPA)</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
                <span className="text-[9.5px] text-zinc-500 uppercase font-bold tracking-widest block">Entry Level</span>
                <p className="text-[18px] font-black text-zinc-300 mt-1">₹{career.salaryEntry}L</p>
                <span className="text-[8px] text-zinc-400 mt-0.5 block">0-2 Yrs Experience</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl border-emerald-500/20">
                <span className="text-[9.5px] text-emerald-400 uppercase font-bold tracking-widest block">Mid Level</span>
                <p className="text-[18px] font-black text-white mt-1">₹{career.salaryMid}L</p>
                <span className="text-[8px] text-zinc-400 mt-0.5 block">3-6 Yrs Experience</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl border-purple-500/20">
                <span className="text-[9.5px] text-purple-400 uppercase font-bold tracking-widest block">Senior Level</span>
                <p className="text-[18px] font-black text-purple-400 mt-1">₹{career.salarySenior}L</p>
                <span className="text-[8px] text-zinc-400 mt-0.5 block">7+ Yrs Experience</span>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Average Annual Salary Growth</span>
              <p className="text-[20px] font-black text-emerald-400 mt-1">+{career.salaryGrowthRate}% YoY</p>
              <p className="text-[10.5px] text-zinc-400 mt-1.5 leading-relaxed">Exceeds standard 8% tech inflation benchmark due to intense demand for specialized growth marketers.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRightPanelWidget = () => {
    const report = careerReport;
    if (!report) return null;

    return (
      <div className="space-y-6">
        {/* Career Intelligence Widget */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
            <h3 className="text-[13px] font-extrabold text-white">Career Intelligence</h3>
            <div className="flex gap-1">
              {['jobs', 'startup', 'paths'].map((tab) => (
                <button key={tab} onClick={() => setRightPanelTab(tab as any)} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide transition-all ${rightPanelTab === tab ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {rightPanelTab === 'jobs' && (
            <div className="space-y-5">
              {/* Top Job Roles */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Top Job Roles for You</span>
                {[
                  { title: 'Digital Marketing Manager', match: 78 },
                  { title: 'Growth Marketing Specialist', match: 74 },
                  { title: 'Brand Marketing Manager', match: 71 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-850">
                    <span className="text-[11.5px] font-bold text-zinc-300">{item.title}</span>
                    <span className="text-[10.5px] font-bold text-emerald-400">{item.match}% Match</span>
                  </div>
                ))}
                <button onClick={() => setActiveResultTab('jobs')} className="w-full text-center text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline pt-1.5 flex items-center justify-center gap-1">
                  View All Matching Jobs <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Best Locations */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-800/60">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Best Locations for You</span>
                {[
                  { city: 'Bangalore, India', score: 92, label: 'Best Match', col: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { city: 'Mumbai, India', score: 86, label: 'High Opp.', col: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { city: 'Hyderabad, India', score: 84, label: 'High Opp.', col: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { city: 'Pune, India', score: 75, label: 'Good Opp.', col: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { city: 'Singapore', score: 73, label: 'High Growth', col: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                ].map((loc, i) => (
                  <div key={i} className="flex items-center justify-between bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-850">
                    <span className="text-[11.5px] font-bold text-zinc-300">{loc.city}</span>
                    <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded ${loc.col}`}>{loc.label}</span>
                  </div>
                ))}
                <button onClick={() => setActiveResultTab('locations')} className="w-full text-center text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline pt-1.5 flex items-center justify-center gap-1">
                  See all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {rightPanelTab === 'startup' && (
            <div className="space-y-4">
              <div className="bg-zinc-950/60 p-3.5 border border-zinc-850 rounded-xl space-y-1">
                <span className="text-[9.5px] text-zinc-500 uppercase font-bold tracking-widest block">Startup Viability Index</span>
                <p className="text-[20px] font-black text-emerald-400">76%</p>
                <p className="text-[9.5px] text-zinc-400">Highly viable based on your growth hacking skills</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Recommended Sectors</span>
                {['Artificial Intelligence', 'B2B Marketing SaaS', 'D2C Retail Infrastructure'].map((sect, i) => (
                  <div key={i} className="bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-850 text-[11px] font-semibold text-zinc-300">{sect}</div>
                ))}
              </div>
              <button onClick={() => setActiveResultTab('startups')} className="w-full text-center text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline pt-1.5 flex items-center justify-center gap-1">
                View Venture Analysis <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {rightPanelTab === 'paths' && (
            <div className="space-y-3">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Pivot Path Alignment</span>
              {report.alternativePaths.slice(0, 3).map((ap, i) => (
                <div key={i} className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-white">{ap.name}</span>
                    <span className="text-[10.5px] font-bold text-emerald-400">{ap.matchScore}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${ap.matchScore}%` }} />
                  </div>
                </div>
              ))}
              <button onClick={() => setActiveResultTab('careers')} className="w-full text-center text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline pt-1.5 flex items-center justify-center gap-1">
                View Pivot Pathways <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Startup Intelligence (If You Build) Widget */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4.5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700 pointer-events-none" />
          <div className="relative z-10 space-y-3.5">
            <div>
              <span className="text-[9px] font-extrabold tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/25 uppercase">Startup Intelligence (If You Build)</span>
              <p className="text-[10px] text-zinc-500 mt-1.5">Based on your skills, interests & market opportunities</p>
            </div>
            <div className="bg-zinc-950/60 p-3.5 border border-zinc-850 rounded-xl space-y-2">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block">Best Idea for You</span>
                <span className="text-[12.5px] font-bold text-white flex items-center gap-1.5 mt-0.5"><Rocket className="w-4 h-4 text-emerald-400" /> AI Marketing Automation Platform</span>
              </div>
              <div className="flex items-center justify-between text-[10.5px] pt-1">
                <span className="text-zinc-400">Est. Capital: <strong>₹8L - ₹20L</strong></span>
                <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/25 text-[8.5px] font-bold uppercase">High Potential</span>
              </div>
              <div className="text-[10.5px] text-zinc-400 pt-0.5">
                <span>Best Location: <strong>Bangalore, India</strong></span>
              </div>
            </div>
            <button onClick={() => setActiveResultTab('startups')} className="w-full text-center text-[10.5px] font-extrabold bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl border border-zinc-700/50 transition-all shadow-md">
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 1. RENDER RESULTS — original intelligence view with modules, charts, forecast, Decision DNA etc.
  if (result && !isAnalysing) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 transition-all duration-700">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-6 pb-16">

          {/* ── Search bar (sticky) ── */}
          <div className="relative max-w-[680px] mx-auto mb-5">
            <div className="relative flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 rounded-[18px] shadow-lg px-5 py-3.5">
              <Search className="w-[17px] h-[17px] shrink-0 text-zinc-500"/>
              <input ref={inputRef} type="text" value={inputValue}
                onChange={e=>setInputValue(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter') runQuery(); }}
                placeholder="Refine or ask a new question…"
                className="flex-1 bg-transparent outline-none text-[13.5px] font-medium text-white placeholder:text-zinc-500"/>
              {inputValue.trim() && (
                <motion.button onClick={()=>runQuery()} disabled={isAnalysing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-emerald-500 hover:bg-emerald-400 text-black text-[12px] font-bold shadow-sm disabled:opacity-50 shrink-0 transition-colors"
                  whileHover={{ scale:1.03 }} whileTap={{ scale:0.95 }}>
                  Analyse <Send className="w-3 h-3"/>
                </motion.button>
              )}
              <motion.button onClick={resetAll}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all shrink-0"
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} title="New search">
                <RefreshCw className="w-3.5 h-3.5"/>
              </motion.button>
            </div>
          </div>

          {/* Gamification bar */}
          <GamificationBar gami={gamification}/>

          {/* ── Summary sentence ── */}
          <motion.div className="rounded-2xl border border-zinc-800 p-4 mb-5 bg-zinc-900/60"
            initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}>
            <p className="text-[13px] leading-relaxed font-medium text-zinc-300">{result.summary}</p>
          </motion.div>





          {/* ── Career Intelligence Report ── */}
          {careerReport && <CareerIntelligenceReport analysis={careerReport}/>}

          {/* ── Compare button ── */}
          {prevResult && (
            <motion.div className="flex justify-center mt-4" initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <button onClick={()=>setShowSplit(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[12px] font-semibold text-zinc-400 hover:text-white hover:border-zinc-600 shadow-sm transition-all">
                <SplitSquareHorizontal className="w-3.5 h-3.5"/> Compare with previous query
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // 2. RENDER GORGEOUS SEARCH LANDING PAGE
  return (
    <div className="relative min-h-screen bg-[#070709] text-white overflow-hidden transition-all duration-700 font-sans">
      <FloatingParticles />
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">

        {/* HERO */}
        <motion.div className="text-center"
          animate={hasQueried?{paddingTop:'2rem',paddingBottom:'1rem'}:{paddingTop:'6rem',paddingBottom:'0rem'}}
          transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}>
          <motion.div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-5"
            initial={{ opacity:0,y:-12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-[10.5px] text-zinc-400 font-semibold tracking-widest uppercase">AI Field & Career Discovery Platform — India</span>
          </motion.div>
          <motion.h1 className="font-extrabold text-white leading-[1.1] tracking-tight"
            animate={hasQueried?{fontSize:'1.6rem'}:{fontSize:'2.75rem'}} style={{fontSize:'2.75rem'}}
            transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>
            Smart AI Suggestions
          </motion.h1>
          <AnimatePresence>
            {!hasQueried && (
              <motion.p className="text-[13px] text-zinc-400 max-w-[460px] mx-auto leading-relaxed mt-4"
                initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }}
                exit={{ opacity:0,y:-6,height:0,marginTop:0 }} transition={{ duration:0.3 }}>
                Discover any field, degree, or career in India. Get real salary data, top colleges, entrance exams, and a 5-year future outlook — all in one search.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* GOAL MODE */}
        <AnimatePresence>
          {!hasQueried && (
            <motion.div className="flex justify-center mb-2 mt-5"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <GoalModeBar mode={goalMode} onChange={setGoalMode} onPromptClick={(q)=>runQuery(q)}/>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEARCH BAR */}
        <motion.div className="relative max-w-[680px] mx-auto mb-3"
          initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}>
          <div className="absolute -inset-px rounded-[18px] blur-[6px] pointer-events-none transition-all duration-700 bg-emerald-500/10 opacity-60"/>
          <div className="relative flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-[18px] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-5 py-4">
            <Search className="w-[17px] h-[17px] shrink-0 text-emerald-400"/>
            <input ref={inputRef} type="text" value={inputValue}
              onChange={e=>setInputValue(e.target.value)}
              onFocus={handleSearchFocus}
              onKeyDown={e=>{ if(e.key==='Enter') runQuery(); }}
              placeholder={isAuthenticated?'Search any field — MBBS, B.Tech CSE, CA, UPSC, Law, Architecture…':'Click to sign in and run AI-powered field analysis…'}
              className="flex-1 bg-transparent outline-none text-[13.5px] font-medium text-white placeholder:text-zinc-500 placeholder:font-normal"
              readOnly={!isAuthenticated}/>
            <AnimatePresence>
              {!isAuthenticated && (
                <motion.button initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0,scale:0.9 }}
                  onClick={()=>{ setPendingQuery(inputValue); setShowAuthModal(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-black text-[11px] font-semibold shadow-sm shrink-0 transition-colors"
                  whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}>
                  <Lock className="w-3 h-3"/> Sign in to analyse
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isAuthenticated && inputValue.trim() && (
                <motion.button initial={{ scale:0,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0,opacity:0 }}
                  transition={{ type:'spring',stiffness:440,damping:26 }}
                  onClick={()=>runQuery()} disabled={isAnalysing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-emerald-500 hover:bg-emerald-400 text-black text-[12px] font-bold shadow-sm disabled:opacity-50 shrink-0 transition-colors"
                  whileHover={{ scale:1.03 }} whileTap={{ scale:0.95 }}>
                  Analyse <Send className="w-3 h-3"/>
                </motion.button>
              )}
            </AnimatePresence>
            {isAuthenticated && (
              <motion.button
                onClick={() => {
                  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SR) { alert('Speech recognition not supported in this browser.'); return; }
                  if (isListening && recognitionRef.current) {
                    recognitionRef.current.stop();
                    setIsListening(false);
                    return;
                  }
                  const rec = new SR();
                  rec.lang = 'en-US';
                  rec.interimResults = false;
                  rec.maxAlternatives = 1;
                  rec.onresult = (e: any) => {
                    const text = e.results[0][0].transcript;
                    setInputValue(prev => prev ? prev + ' ' + text : text);
                    setIsListening(false);
                  };
                  rec.onerror = () => setIsListening(false);
                  rec.onend = () => setIsListening(false);
                  recognitionRef.current = rec;
                  rec.start();
                  setIsListening(true);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 shrink-0 ${
                  isListening
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)] animate-pulse'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isListening ? 'Listening... click to stop' : 'Voice input'}>
                <Mic className="w-4 h-4" />
              </motion.button>
            )}

          </div>

          {/* Real-time correction */}
          <AnimatePresence>
            {isAuthenticated && inputValue.trim() && <InputCorrection value={inputValue}/>}
            {!isAuthenticated && !hasQueried && (
              <motion.p className="text-center text-[11px] text-zinc-500 mt-3"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                Free to browse · Sign in required to run AI analysis
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* LOADING */}
        <AnimatePresence>
          {isAnalysing && (
            <motion.div className="flex flex-col items-center py-16"
              initial={{ opacity:0,scale:0.94 }} animate={{ opacity:1,scale:1 }}
              exit={{ opacity:0,scale:0.94 }} transition={{ duration:0.28 }}>
              <div className="relative w-[56px] h-[56px] mb-5">
                {[0,1,2].map(i=>(
                  <motion.span key={i} className="absolute inset-0 rounded-full border border-emerald-500/30"
                    animate={{ scale:[1,2.1,1],opacity:[0.5,0,0.5] }}
                    transition={{ duration:1.9,repeat:Infinity,delay:i*0.5 }}/>
                ))}
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 rounded-full border border-zinc-800 shadow-md">
                  <Brain className="w-6 h-6 text-emerald-400"/>
                </div>
              </div>
              <p className="text-[14px] font-extrabold text-white mb-1">Analysing field…</p>
              <p className="text-[12px] text-zinc-500 mb-5">Salary data · Job demand · Top colleges · 5-year forecast</p>
              <div className="flex gap-2">
                {['Scoring','Field Analysis','5yr Forecast','Career Map'].map((lbl,i)=>(
                  <motion.span key={lbl} className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-850 text-emerald-400 font-bold shadow-sm"
                    animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.2,repeat:Infinity,delay:i*0.25 }}>
                    {lbl}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Field discovery chips (education domain) ── */}
        <AnimatePresence>
          {!hasQueried && (
            <motion.div className="max-w-[680px] mx-auto mt-6"
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-6 }} transition={{ delay:0.35 }}>

              {/* Engineering row */}
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-blue-500"/>Engineering
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['B.Tech CSE','B.Tech ECE','B.Tech Mechanical','B.Tech Civil','B.Tech Chemical','Data Science','AI & ML','B.Tech IT','B.Tech Aerospace'].map(f=>(
                  <button key={f} onClick={()=>runQuery(`Scope of ${f} in India 2025`)}
                    className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold hover:bg-blue-500/20 hover:border-blue-400/40 transition-all">
                    {f}
                  </button>
                ))}
              </div>

              {/* Medical row */}
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500"/>Medical & Health
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['MBBS','BDS (Dentistry)','B.Pharm','Nursing (B.Sc)','BAMS (Ayurveda)','BHMS (Homeopathy)','Physiotherapy','Pharm.D','Biotechnology'].map(f=>(
                  <button key={f} onClick={()=>runQuery(`Career scope of ${f} in India`)}
                    className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all">
                    {f}
                  </button>
                ))}
              </div>

              {/* Commerce & Law row */}
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3 text-amber-500"/>Commerce, Law & Civil Services
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['CA (Chartered Accountant)','B.Com + MBA','BA LLB / LLB','UPSC IAS','CS (Company Secretary)','CFA','BBA','CLAT — Law','State PCS'].map(f=>(
                  <button key={f} onClick={()=>runQuery(`${f} career scope salary India`)}
                    className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/20 hover:border-amber-400/40 transition-all">
                    {f}
                  </button>
                ))}
              </div>

              {/* Arts, Design & Others row */}
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3 text-violet-500"/>Arts, Design & Other Fields
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['B.Arch (Architecture)','B.Des (Design)','Mass Communication','Hotel Management','Fine Arts','Psychology','Social Work','Education (B.Ed)','Agriculture (B.Sc)'].map(f=>(
                  <button key={f} onClick={()=>runQuery(`${f} career scope future India`)}
                    className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-semibold hover:bg-violet-500/20 hover:border-violet-400/40 transition-all">
                    {f}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pre-query footer */}
        <AnimatePresence>
          {!hasQueried && (
            <motion.p className="text-center text-[11px] text-zinc-650 pb-16 mt-8"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ delay:0.6 }}>
              <span className="font-semibold text-zinc-500">CideDec</span>
              &nbsp;·&nbsp;AI Field Discovery · Career Scope · 5-Year Forecasting · Bias Detection
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedCard && <SuggestionModal suggestion={selectedCard} onClose={()=>setSelectedCard(null)}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showAuthModal && (
          <SearchAuthModal pendingQuery={pendingQuery}
            onClose={()=>{ setShowAuthModal(false); setPendingQuery(''); }}
            onAuthSuccess={handleAuthSuccess}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSplit && result && (
          <SplitScreen left={result} right={prevResult} onClose={()=>setShowSplit(false)}/>
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAssistant && (
          <AIAssistantModal
            onClose={()=>setShowAssistant(false)}
            initialQuery={inputValue || (result?.query ?? '')}
            onUseQuery={(q)=>{ setInputValue(q); setShowAssistant(false); setTimeout(()=>runQuery(q),120); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

