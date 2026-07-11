/* ═══════════════════════════════════════════════════════════
   CideDec AI-Powered Career, Job & Startup Location Intelligence System
   Analyzes resume skills, experience, and keywords to offer
   advanced location-specific opportunities and startup metrics.
   ═══════════════════════════════════════════════════════════ */
import type { ParsedResume } from '../ats/analyzer';

export interface LocationRecommendation {
  city: string;
  state: string;
  country: string;
  score: number;             // 0-100 match
  costOfLiving: 'Low' | 'Medium' | 'High';
  demandIndex: number;       // 0-100
  ecosystemScore: number;    // 0-100
  growthOpportunities: string;
  reason: string;
  signal: 'green' | 'orange' | 'red';
}

export interface SuitableJob {
  role: string;
  industry: string;
  probability: number;       // Hiring percentage
  companies: string[];
  workType: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  salaryRange: string;
}

export interface LaunchCity {
  city: string;
  country: string;
  ecosystemStrength: number; // 0-100
  fundingAccess: 'Very High' | 'High' | 'Moderate' | 'Low';
  reason: string;
}

export interface StartupIntelligence {
  potential: 'green' | 'orange' | 'red';
  sectors: string[];
  successProbability: number;
  bestLaunchCities: LaunchCity[];
  capitalRequired: string;
  networkingOps: 'Excellent' | 'Good' | 'Fair';
  competitionLevel: 'Low' | 'Medium' | 'High';
  growthPotential: 'High' | 'Medium' | 'Low';
}

export interface SalaryGrowthTrend {
  year: string;
  standardSalary: number;    // In ₹ LPA
  futureSafeSalary: number;  // In ₹ LPA
}

export interface LocationComparisonItem {
  name: string;              // City / Region
  salaryTrend: number;       // 0-100
  costOfLivingScore: number; // 0-100 (higher = cheaper)
  startupEcosystem: number;  // 0-100
  hiringDemand: number;      // 0-100
}

export interface AIRiskFactor {
  factor: string;
  automationThreat: number;  // 0-100
  futureSafeness: number;    // 0-100
  recommendation: string;
}

export interface CareerLocationIntelligence {
  suitableJobs: SuitableJob[];
  locations: LocationRecommendation[];
  startupIntel: StartupIntelligence;
  salaryGrowthForecast: SalaryGrowthTrend[];
  locationComparison: LocationComparisonItem[];
  aiRiskAnalysis: AIRiskFactor[];
  futureSafeCareers: string[];
}

/* ── Keywords for Entrepreneurship ── */
const STARTUP_KEYWORDS = [
  'founder', 'co-founder', 'ceo', 'cto', 'cpo', 'startup', 'venture', 'business development',
  'growth hacking', 'sales strategy', 'equity', 'funding', 'seed', 'pitch deck', 'investor',
  'incubator', 'accelerator', 'bootstrapped', 'product launch', 'leadership', 'negotiation'
];

export function generateLocationIntelligence(parsed: ParsedResume): CareerLocationIntelligence {
  const text = parsed.raw.toLowerCase();
  const techSkills = parsed.detectedSkills.tech.map(s => s.toLowerCase());
  const softSkills = parsed.detectedSkills.soft.map(s => s.toLowerCase());

  // Determine core domain of the resume
  let domain: 'tech' | 'design' | 'finance' | 'general' = 'general';
  
  if (techSkills.some(s => ['python', 'javascript', 'typescript', 'java', 'c++', 'go', 'rust', 'machine learning', 'aws', 'docker'].includes(s))) {
    domain = 'tech';
  } else if (techSkills.some(s => ['figma', 'design', 'ux', 'ui', 'sketch', 'adobe', 'prototyping'].includes(s)) || text.includes('designer') || text.includes('creative')) {
    domain = 'design';
  } else if (text.includes('finance') || text.includes('banking') || text.includes('audit') || text.includes('cfo') || text.includes('accounting') || text.includes('stock')) {
    domain = 'finance';
  }

  // 1. Suitable Jobs based on Resume
  let suitableJobs: SuitableJob[] = [];
  if (domain === 'tech') {
    suitableJobs = [
      { role: 'AI Engineer / ML Specialist', industry: 'Artificial Intelligence & SaaS', probability: 94, companies: ['NVIDIA', 'OpenAI', 'Google DeepMind', 'Stripe'], workType: 'Hybrid', salaryRange: '₹18L – ₹45L' },
      { role: 'Full Stack Engineer', industry: 'SaaS & Web Applications', probability: 89, companies: ['Razorpay', 'Flipkart', 'Atlassian', 'Uber'], workType: 'Remote', salaryRange: '₹12L – ₹30L' },
      { role: 'Cloud Platform Architect', industry: 'Enterprise Infrastructure', probability: 82, companies: ['Amazon Web Services', 'Microsoft Azure', 'CrowdStrike'], workType: 'Flexible', salaryRange: '₹22L – ₹50L' },
    ];
  } else if (domain === 'design') {
    suitableJobs = [
      { role: 'Senior Product Designer', industry: 'FinTech & B2B SaaS', probability: 91, companies: ['Figma', 'Apple', 'Canva', 'Airbnb'], workType: 'Hybrid', salaryRange: '₹14L – ₹32L' },
      { role: 'AR/VR Spatial Designer', industry: 'Gaming & Metaverse', probability: 78, companies: ['Meta', 'Epic Games', 'Apple Design Labs'], workType: 'On-site', salaryRange: '₹16L – ₹35L' },
      { role: 'UX Research & Strategist', industry: 'Consumer Applications', probability: 85, companies: ['Spotify', 'Google UX Research', 'Swiggy'], workType: 'Remote', salaryRange: '₹10L – ₹24L' },
    ];
  } else if (domain === 'finance') {
    suitableJobs = [
      { role: 'Quantitative Risk Analyst', industry: 'Investment Banking', probability: 90, companies: ['Goldman Sachs', 'JPMorgan Chase', 'BlackRock'], workType: 'On-site', salaryRange: '₹20L – ₹48L' },
      { role: 'DeFi Systems Architect', industry: 'Blockchain Finance', probability: 75, companies: ['Coinbase', 'Binance', 'ConsenSys'], workType: 'Remote', salaryRange: '₹18L – ₹40L' },
      { role: 'Corporate Treasury Manager', industry: 'Conglomerates & Logistics', probability: 83, companies: ['Reliance Industries', 'Adani Group', 'Tata Sons'], workType: 'Hybrid', salaryRange: '₹12L – ₹28L' },
    ];
  } else {
    suitableJobs = [
      { role: 'AI Operations Specialist', industry: 'Technology Consulting', probability: 88, companies: ['Accenture', 'Deloitte', 'PwC Consulting'], workType: 'Hybrid', salaryRange: '₹8L – ₹18L' },
      { role: 'Strategic Operations Lead', industry: 'Scaleups & Retail Logistics', probability: 80, companies: ['Zomato', 'Zepto', 'Jio Platforms'], workType: 'On-site', salaryRange: '₹10L – ₹22L' },
      { role: 'Product Operations Coordinator', industry: 'Consumer Tech', probability: 76, companies: ['Unacademy', 'Groww', 'Meesho'], workType: 'Remote', salaryRange: '₹7L – ₹15L' },
    ];
  }

  // 2. Best Locations for Career Growth
  let locations: LocationRecommendation[] = [];
  if (domain === 'tech') {
    locations = [
      { city: 'Bengaluru', state: 'Karnataka', country: 'India', score: 98, costOfLiving: 'Medium', demandIndex: 96, ecosystemScore: 95, growthOpportunities: 'Exponential growth, high density of unicorn startups.', reason: 'Asia\'s leading technology hub, unparalleled networking opportunities.', signal: 'green' },
      { city: 'San Francisco', state: 'California', country: 'USA', score: 95, costOfLiving: 'High', demandIndex: 98, ecosystemScore: 99, growthOpportunities: 'Epicenter of Gen-AI revolution & massive capital.', reason: 'Unmatched venture backing, global standard of compensation.', signal: 'green' },
      { city: 'Berlin', state: 'Berlin', country: 'Germany', score: 87, costOfLiving: 'Medium', demandIndex: 82, ecosystemScore: 84, growthOpportunities: 'European tech gateway with favorable visa/immigration routes.', reason: 'High quality of life, robust software engineering salaries, EU market access.', signal: 'green' },
      { city: 'Hyderabad', state: 'Telangana', country: 'India', score: 86, costOfLiving: 'Low', demandIndex: 85, ecosystemScore: 80, growthOpportunities: 'Massive enterprise setups (Google, MS) with high hiring rates.', reason: 'Extremely affordable living paired with modern, competitive workspaces.', signal: 'green' },
      { city: 'Toronto', state: 'Ontario', country: 'Canada', score: 83, costOfLiving: 'High', demandIndex: 80, ecosystemScore: 82, growthOpportunities: 'Major AI hub powered by Vector Institute & tech immigration policy.', reason: 'Diverse environment, high corporate standard, strong tech ecosystem.', signal: 'orange' }
    ];
  } else if (domain === 'design') {
    locations = [
      { city: 'Amsterdam', state: 'North Holland', country: 'Netherlands', score: 95, costOfLiving: 'High', demandIndex: 92, ecosystemScore: 90, growthOpportunities: 'Design-centric companies (Booking.com, Adyen) and supreme work-life balance.', reason: 'Creative epicenter of Europe with highly competitive global standard salaries.', signal: 'green' },
      { city: 'Mumbai', state: 'Maharashtra', country: 'India', score: 92, costOfLiving: 'High', demandIndex: 90, ecosystemScore: 88, growthOpportunities: 'Massive concentration of top-tier consumer startups and ad-tech agencies.', reason: 'Financial capital with high demand for premium product and visual designers.', signal: 'green' },
      { city: 'Bengaluru', state: 'Karnataka', country: 'India', score: 90, costOfLiving: 'Medium', demandIndex: 88, ecosystemScore: 92, growthOpportunities: 'Continuous UX need for countless tech unicorns and SaaS firms.', reason: 'Direct integration of design inside core tech product loops.', signal: 'green' },
      { city: 'Tokyo', state: 'Tokyo', country: 'Japan', score: 81, costOfLiving: 'High', demandIndex: 75, ecosystemScore: 80, growthOpportunities: 'Pioneering in hardware-software industrial design & interactive media.', reason: 'Unique culture, unmatched craftsmanship, highly advanced interactive design field.', signal: 'orange' }
    ];
  } else {
    // Finance / General
    locations = [
      { city: 'Singapore', state: 'Central Region', country: 'Singapore', score: 96, costOfLiving: 'High', demandIndex: 95, ecosystemScore: 96, growthOpportunities: 'Premier financial gateway of Asia, tax-friendly, high stability.', reason: 'Excellent startup funding policies, global corporate headquarters.', signal: 'green' },
      { city: 'Dubai', state: 'Dubai', country: 'UAE', score: 93, costOfLiving: 'High', demandIndex: 90, ecosystemScore: 92, growthOpportunities: 'Tax-free salary structures, ultra-modern Web3 & AI regulatory framework.', reason: 'Extremely strong capital access, central global geographical advantage.', signal: 'green' },
      { city: 'London', state: 'Greater London', country: 'UK', score: 88, costOfLiving: 'High', demandIndex: 88, ecosystemScore: 94, growthOpportunities: 'World-class startup ecosystem, extensive VC networks and talent pools.', reason: 'Deep history of financial institutions merged with contemporary Fintech platforms.', signal: 'green' },
      { city: 'Pune', state: 'Maharashtra', country: 'India', score: 82, costOfLiving: 'Low', demandIndex: 78, ecosystemScore: 75, growthOpportunities: 'Rapidly emerging Fintech center, strong manufacturing & IT services balance.', reason: 'Exceptional cost-of-living index, close proximity to Mumbai markets.', signal: 'green' },
      { city: 'New York', state: 'New York', country: 'USA', score: 80, costOfLiving: 'High', demandIndex: 92, ecosystemScore: 95, growthOpportunities: 'Unrivaled wealth concentration, massive tech & financial convergence.', reason: 'Intense competition but unmatched compensation ceilings.', signal: 'orange' }
    ];
  }

  // 3. Startup & Business Intelligence
  // Calculate startup potential based on keywords in resume text + soft skills
  let scorePoints = 0;
  for (const keyword of STARTUP_KEYWORDS) {
    if (text.includes(keyword)) scorePoints += 12;
  }
  for (const soft of softSkills) {
    if (['leadership', 'strategic planning', 'negotiation', 'decision making', 'presentation'].includes(soft)) {
      scorePoints += 15;
    }
  }

  const successProbability = Math.min(95, Math.max(32, 30 + scorePoints));
  let potential: 'green' | 'orange' | 'red' = 'red';
  if (successProbability >= 70) potential = 'green';
  else if (successProbability >= 48) potential = 'orange';

  let startupSectors: string[] = [];
  let capitalRequired = '₹10L – ₹25L';
  let bestLaunchCities: LaunchCity[] = [];

  if (domain === 'tech') {
    startupSectors = ['AI-Agents & Orchestration', 'Developer Tools / MLOps', 'Micro-SaaS', 'Web3 Protocols'];
    capitalRequired = '₹5L – ₹15L';
    bestLaunchCities = [
      { city: 'Bengaluru', country: 'India', ecosystemStrength: 95, fundingAccess: 'High', reason: 'Abundant tech talent, active early-stage investor community.' },
      { city: 'San Francisco', country: 'USA', ecosystemStrength: 99, fundingAccess: 'Very High', reason: 'Hub for globally scaling AI models and deep-tech VC firms.' },
      { city: 'Singapore', country: 'Singapore', ecosystemStrength: 90, fundingAccess: 'High', reason: 'Favorable intellectual property laws, pro-business tax codes.' }
    ];
  } else if (domain === 'design') {
    startupSectors = ['Design Systems as a Service', 'Creative Tech & Media AI', 'UX Consulting Agency', 'AR/VR Assets Market'];
    capitalRequired = '₹3L – ₹8L';
    bestLaunchCities = [
      { city: 'Amsterdam', country: 'Netherlands', ecosystemStrength: 88, fundingAccess: 'High', reason: 'Strong focus on design-led innovation, international hub.' },
      { city: 'Mumbai', country: 'India', ecosystemStrength: 85, fundingAccess: 'High', reason: 'Access to advertising capital, media networks, consumer product ecosystems.' },
      { city: 'London', country: 'UK', ecosystemStrength: 92, fundingAccess: 'High', reason: 'Dense creative technology networks, active accelerator systems.' }
    ];
  } else {
    startupSectors = ['Embedded Fintech Solutions', 'D2C Consumer Brands', 'Cross-Border B2B Logistics', 'WealthTech Platforms'];
    capitalRequired = '₹15L – ₹40L';
    bestLaunchCities = [
      { city: 'Dubai', country: 'UAE', ecosystemStrength: 93, fundingAccess: 'Very High', reason: 'Government grants, sandboxes for Fintech, tax-exempt capital incentives.' },
      { city: 'Singapore', country: 'Singapore', ecosystemStrength: 94, fundingAccess: 'Very High', reason: 'Global sandbox environment, high concentration of wealth managers.' },
      { city: 'Bengaluru', country: 'India', ecosystemStrength: 91, fundingAccess: 'High', reason: 'Tremendous consumer scale, large Fintech base.' }
    ];
  }

  const startupIntel: StartupIntelligence = {
    potential,
    sectors: startupSectors,
    successProbability,
    bestLaunchCities,
    capitalRequired,
    networkingOps: successProbability >= 70 ? 'Excellent' : successProbability >= 50 ? 'Good' : 'Fair',
    competitionLevel: successProbability >= 70 ? 'Medium' : 'High',
    growthPotential: successProbability >= 70 ? 'High' : 'Medium'
  };

  // 4. Salary Growth Forecast (Standard vs Future-Safe Career Suggestions)
  const baseSalary = domain === 'tech' ? 12 : domain === 'finance' ? 11 : domain === 'design' ? 9 : 7;
  const salaryGrowthForecast: SalaryGrowthTrend[] = [
    { year: '2026', standardSalary: baseSalary, futureSafeSalary: baseSalary },
    { year: '2027', standardSalary: Math.round(baseSalary * 1.15 * 10) / 10, futureSafeSalary: Math.round(baseSalary * 1.3 * 10) / 10 },
    { year: '2028', standardSalary: Math.round(baseSalary * 1.30 * 10) / 10, futureSafeSalary: Math.round(baseSalary * 1.65 * 10) / 10 },
    { year: '2029', standardSalary: Math.round(baseSalary * 1.45 * 10) / 10, futureSafeSalary: Math.round(baseSalary * 2.1 * 10) / 10 },
    { year: '2030', standardSalary: Math.round(baseSalary * 1.60 * 10) / 10, futureSafeSalary: Math.round(baseSalary * 2.6 * 10) / 10 },
    { year: '2031', standardSalary: Math.round(baseSalary * 1.75 * 10) / 10, futureSafeSalary: Math.round(baseSalary * 3.2 * 10) / 10 }
  ];

  // 5. Country/City Comparison Items
  let locationComparison: LocationComparisonItem[] = [];
  if (domain === 'tech') {
    locationComparison = [
      { name: 'Bengaluru', salaryTrend: 88, costOfLivingScore: 85, startupEcosystem: 95, hiringDemand: 96 },
      { name: 'San Francisco', salaryTrend: 98, costOfLivingScore: 15, startupEcosystem: 99, hiringDemand: 98 },
      { name: 'Berlin', salaryTrend: 76, costOfLivingScore: 60, startupEcosystem: 84, hiringDemand: 80 },
      { name: 'Singapore', salaryTrend: 90, costOfLivingScore: 30, startupEcosystem: 92, hiringDemand: 88 },
      { name: 'Dubai', salaryTrend: 85, costOfLivingScore: 40, startupEcosystem: 90, hiringDemand: 82 }
    ];
  } else {
    locationComparison = [
      { name: 'Singapore', salaryTrend: 92, costOfLivingScore: 25, startupEcosystem: 94, hiringDemand: 91 },
      { name: 'Dubai', salaryTrend: 90, costOfLivingScore: 35, startupEcosystem: 92, hiringDemand: 87 },
      { name: 'London', salaryTrend: 82, costOfLivingScore: 30, startupEcosystem: 91, hiringDemand: 85 },
      { name: 'Mumbai', salaryTrend: 70, costOfLivingScore: 60, startupEcosystem: 83, hiringDemand: 80 },
      { name: 'Pune', salaryTrend: 58, costOfLivingScore: 88, startupEcosystem: 65, hiringDemand: 70 }
    ];
  }

  // 6. AI Risk Analysis
  let aiRiskAnalysis: AIRiskFactor[] = [];
  if (domain === 'tech') {
    aiRiskAnalysis = [
      { factor: 'Boilerplate Coding & Syntax Generation', automationThreat: 85, futureSafeness: 25, recommendation: 'Shift focus to System Architecture, LLM fine-tuning, and robust MLOps orchestration.' },
      { factor: 'Database Management & Optimization', automationThreat: 65, futureSafeness: 45, recommendation: 'Adopt autonomous cloud platforms and master real-time distributed DB patterns.' },
      { factor: 'AI Agent Design & Integration', automationThreat: 15, futureSafeness: 95, recommendation: 'Deepen knowledge in multi-agent networks, tool calling, and human-in-the-loop validation.' }
    ];
  } else if (domain === 'design') {
    aiRiskAnalysis = [
      { factor: 'Static Vector Asset Design', automationThreat: 75, futureSafeness: 30, recommendation: 'Transition to comprehensive product loops, customer journey mappings, and UX validation.' },
      { factor: 'Component System Coding', automationThreat: 80, futureSafeness: 20, recommendation: 'Specialize in complex behavioral tokens, accessibility standards, and design system governance.' },
      { factor: 'Spatial Design (AR/VR/3D UX)', automationThreat: 10, futureSafeness: 95, recommendation: 'Establish competencies in Unity/Unreal Engine and spatial interaction paradigms.' }
    ];
  } else {
    aiRiskAnalysis = [
      { factor: 'Standard Data Auditing & Reconciliation', automationThreat: 90, futureSafeness: 15, recommendation: 'Pivot to high-level strategic growth auditing, AI governance compliance, and forensic analysis.' },
      { factor: 'Quantitative Trading Logic', automationThreat: 70, futureSafeness: 35, recommendation: 'Incorporate real-time sentiment signals, alternative data sources, and behavioral economics.' },
      { factor: 'Cross-Border Capital Structuring', automationThreat: 20, futureSafeness: 92, recommendation: 'Enhance regional regulatory relations, custom sovereign investment policies, and negotiations.' }
    ];
  }

  // Future Safe Careers Suggestions
  const futureSafeCareers = domain === 'tech'
    ? ['GenAI Orchestrator', 'MLOps Infrastructure Specialist', 'Quantum Software Engineer', 'AI Compliance Officer']
    : domain === 'design'
    ? ['Spatial UX Architect', 'AI-Human Interaction Designer', 'Design Systems Architect', 'Brand Narrative Engineer']
    : ['Decentralized Treasury Strategist', 'AI Venture Capital Lead', 'Sovereign Wealth Risk Officer', 'Forensic Accounting Advisor'];

  return {
    suitableJobs,
    locations,
    startupIntel,
    salaryGrowthForecast,
    locationComparison,
    aiRiskAnalysis,
    futureSafeCareers
  };
}
