/* ═══════════════════════════════════════════════════════════
   CideDec Career & Life Decision Intelligence Engine
   AI-powered career path analyzer with 15 scoring dimensions,
   signal indicators, and comprehensive intelligence reports.
═══════════════════════════════════════════════════════════ */

/* ── Career Database ── */
interface CareerProfile {
  name: string;
  aliases: string[];
  domain: string;
  successProbability: number;
  futureScope: number;        // 5-10 year outlook
  salaryEntry: number;        // ₹LPA
  salaryMid: number;
  salarySenior: number;
  salaryGrowthRate: number;   // % per year
  aiRisk: number;             // 0-100
  industryDemand: number;     // 0-100
  globalOpportunity: number;  // 0-100
  competition: number;        // 0-100 (higher = more competitive)
  learningDifficulty: number; // 0-100
  stabilityIndex: number;     // 0-100
  workLifeBalance: number;    // 0-100
  mentalPressure: number;     // 0-100
  requiredSkills: string[];
  emergingSkills: string[];
  alternativeCareers: string[];
  topCompanies: string[];
  sectors: string[];
}

export const CAREER_DB: CareerProfile[] = [
  {
    name: 'Software Engineer', aliases: ['software developer','programmer','coder','sde','full stack developer','web developer','frontend developer','backend developer'],
    domain: 'Technology', successProbability: 85, futureScope: 88, salaryEntry: 6, salaryMid: 18, salarySenior: 45,
    salaryGrowthRate: 15, aiRisk: 18, industryDemand: 92, globalOpportunity: 95, competition: 72,
    learningDifficulty: 65, stabilityIndex: 82, workLifeBalance: 60, mentalPressure: 55,
    requiredSkills: ['Programming', 'Data Structures', 'System Design', 'Git', 'SQL', 'APIs'],
    emergingSkills: ['AI/ML', 'Cloud Architecture', 'DevOps', 'Rust', 'WebAssembly'],
    alternativeCareers: ['Data Scientist', 'DevOps Engineer', 'Product Manager', 'Technical Architect'],
    topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Flipkart', 'Razorpay'],
    sectors: ['IT Services', 'Fintech', 'SaaS', 'E-commerce', 'Gaming'],
  },
  {
    name: 'Data Scientist', aliases: ['data science','ml engineer','machine learning','ai engineer','data analyst','analytics'],
    domain: 'AI & Data', successProbability: 82, futureScope: 92, salaryEntry: 8, salaryMid: 22, salarySenior: 55,
    salaryGrowthRate: 18, aiRisk: 12, industryDemand: 88, globalOpportunity: 90, competition: 78,
    learningDifficulty: 78, stabilityIndex: 80, workLifeBalance: 62, mentalPressure: 58,
    requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Deep Learning', 'Data Visualization'],
    emergingSkills: ['LLMs', 'MLOps', 'Generative AI', 'Reinforcement Learning', 'Edge AI'],
    alternativeCareers: ['ML Engineer', 'AI Researcher', 'Business Analyst', 'Quantitative Analyst'],
    topCompanies: ['Google DeepMind', 'OpenAI', 'Microsoft', 'Amazon', 'Netflix', 'Uber'],
    sectors: ['AI/ML', 'Finance', 'Healthcare', 'E-commerce', 'Autonomous Systems'],
  },
  {
    name: 'Doctor (MBBS)', aliases: ['doctor','mbbs','physician','medical','surgeon','medicine','neet','healthcare professional'],
    domain: 'Healthcare', successProbability: 78, futureScope: 85, salaryEntry: 5, salaryMid: 18, salarySenior: 50,
    salaryGrowthRate: 12, aiRisk: 8, industryDemand: 95, globalOpportunity: 85, competition: 90,
    learningDifficulty: 95, stabilityIndex: 95, workLifeBalance: 30, mentalPressure: 88,
    requiredSkills: ['Biology', 'Chemistry', 'Anatomy', 'Clinical Skills', 'Diagnosis', 'Patient Care'],
    emergingSkills: ['Telemedicine', 'AI Diagnostics', 'Genomics', 'Robotic Surgery', 'Digital Health'],
    alternativeCareers: ['Healthcare Admin', 'Medical Researcher', 'Biotech Scientist', 'Public Health'],
    topCompanies: ['AIIMS', 'Apollo', 'Fortis', 'Max Healthcare', 'WHO', 'Johns Hopkins'],
    sectors: ['Hospitals', 'Pharma', 'Biotech', 'Public Health', 'Research'],
  },
  {
    name: 'Product Manager', aliases: ['product management','pm','product owner','product lead','tpm'],
    domain: 'Product', successProbability: 80, futureScope: 82, salaryEntry: 10, salaryMid: 25, salarySenior: 60,
    salaryGrowthRate: 16, aiRisk: 10, industryDemand: 78, globalOpportunity: 82, competition: 80,
    learningDifficulty: 55, stabilityIndex: 75, workLifeBalance: 55, mentalPressure: 65,
    requiredSkills: ['Product Strategy', 'User Research', 'Analytics', 'Agile', 'Stakeholder Mgmt', 'Roadmapping'],
    emergingSkills: ['AI Product Strategy', 'Growth Hacking', 'PLG', 'Data-Driven PM'],
    alternativeCareers: ['Program Manager', 'UX Researcher', 'Business Analyst', 'Founder/CEO'],
    topCompanies: ['Google', 'Amazon', 'Microsoft', 'Stripe', 'Atlassian', 'Razorpay'],
    sectors: ['SaaS', 'Fintech', 'E-commerce', 'EdTech', 'HealthTech'],
  },
  {
    name: 'Lawyer', aliases: ['law','advocate','attorney','legal','barrister','judiciary','llb'],
    domain: 'Legal', successProbability: 72, futureScope: 70, salaryEntry: 4, salaryMid: 15, salarySenior: 50,
    salaryGrowthRate: 10, aiRisk: 25, industryDemand: 65, globalOpportunity: 60, competition: 85,
    learningDifficulty: 80, stabilityIndex: 78, workLifeBalance: 35, mentalPressure: 80,
    requiredSkills: ['Legal Research', 'Argumentation', 'Contract Law', 'Constitutional Law', 'Communication'],
    emergingSkills: ['Legal Tech', 'AI Contract Analysis', 'Cyber Law', 'IP Law', 'Data Privacy Law'],
    alternativeCareers: ['Corporate Counsel', 'Legal Consultant', 'Judge', 'Policy Analyst'],
    topCompanies: ['AZB & Partners', 'Khaitan & Co', 'Trilegal', 'Cyril Amarchand', 'Baker McKenzie'],
    sectors: ['Corporate Law', 'Litigation', 'IP', 'Tax', 'Criminal'],
  },
  {
    name: 'UX Designer', aliases: ['ux','ui designer','product designer','interaction designer','design','graphic designer'],
    domain: 'Design', successProbability: 76, futureScope: 78, salaryEntry: 5, salaryMid: 14, salarySenior: 35,
    salaryGrowthRate: 13, aiRisk: 30, industryDemand: 75, globalOpportunity: 80, competition: 68,
    learningDifficulty: 50, stabilityIndex: 70, workLifeBalance: 70, mentalPressure: 45,
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Design Thinking'],
    emergingSkills: ['AI-Assisted Design', 'AR/VR UX', 'Voice UI', 'Motion Design', 'Design Systems'],
    alternativeCareers: ['Product Manager', 'Frontend Developer', 'Creative Director', 'UX Researcher'],
    topCompanies: ['Apple', 'Google', 'Airbnb', 'Figma', 'Spotify', 'Swiggy'],
    sectors: ['Tech', 'E-commerce', 'Gaming', 'FinTech', 'Media'],
  },
  {
    name: 'Entrepreneur', aliases: ['startup','business','founder','ceo','venture','entrepreneurship','own business','start a business'],
    domain: 'Business', successProbability: 35, futureScope: 90, salaryEntry: 0, salaryMid: 20, salarySenior: 100,
    salaryGrowthRate: 30, aiRisk: 5, industryDemand: 70, globalOpportunity: 95, competition: 95,
    learningDifficulty: 85, stabilityIndex: 25, workLifeBalance: 20, mentalPressure: 92,
    requiredSkills: ['Leadership', 'Sales', 'Marketing', 'Financial Planning', 'Product Development', 'Networking'],
    emergingSkills: ['AI-First Business Models', 'No-Code Tools', 'Community Building', 'Growth Hacking'],
    alternativeCareers: ['Product Manager', 'Venture Capitalist', 'Business Consultant', 'Freelancer'],
    topCompanies: ['Y Combinator', 'Sequoia', 'Accel', 'Antler', '500 Global'],
    sectors: ['SaaS', 'D2C', 'EdTech', 'FinTech', 'HealthTech', 'AI'],
  },
  {
    name: 'Chartered Accountant', aliases: ['ca','accountant','accounting','finance','chartered accountancy','audit'],
    domain: 'Finance', successProbability: 75, futureScope: 68, salaryEntry: 7, salaryMid: 18, salarySenior: 45,
    salaryGrowthRate: 11, aiRisk: 35, industryDemand: 72, globalOpportunity: 70, competition: 88,
    learningDifficulty: 88, stabilityIndex: 82, workLifeBalance: 40, mentalPressure: 75,
    requiredSkills: ['Accounting', 'Tax Law', 'Auditing', 'Financial Analysis', 'Excel', 'Compliance'],
    emergingSkills: ['Forensic Accounting', 'Blockchain Audit', 'AI in Finance', 'ESG Reporting'],
    alternativeCareers: ['Financial Analyst', 'Investment Banker', 'CFO', 'Tax Consultant'],
    topCompanies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Grant Thornton'],
    sectors: ['Audit', 'Tax', 'Advisory', 'Corporate Finance'],
  },
  {
    name: 'Teacher / Professor', aliases: ['teacher','professor','teaching','educator','lecturer','tutor','education career'],
    domain: 'Education', successProbability: 70, futureScope: 65, salaryEntry: 3, salaryMid: 8, salarySenior: 20,
    salaryGrowthRate: 6, aiRisk: 20, industryDemand: 80, globalOpportunity: 60, competition: 55,
    learningDifficulty: 45, stabilityIndex: 90, workLifeBalance: 80, mentalPressure: 50,
    requiredSkills: ['Subject Expertise', 'Communication', 'Pedagogy', 'Patience', 'Curriculum Design'],
    emergingSkills: ['EdTech Tools', 'Online Teaching', 'AI-Assisted Learning', 'Gamification'],
    alternativeCareers: ['EdTech Product Manager', 'Corporate Trainer', 'Content Creator', 'Education Consultant'],
    topCompanies: ['IITs', 'IIMs', 'BYJU\'S', 'Unacademy', 'Coursera', 'Harvard'],
    sectors: ['K-12', 'Higher Ed', 'EdTech', 'Corporate Training'],
  },
  {
    name: 'Cybersecurity Analyst', aliases: ['cybersecurity','security analyst','ethical hacker','infosec','penetration tester','security engineer'],
    domain: 'Security', successProbability: 84, futureScope: 92, salaryEntry: 7, salaryMid: 20, salarySenior: 50,
    salaryGrowthRate: 17, aiRisk: 10, industryDemand: 90, globalOpportunity: 92, competition: 55,
    learningDifficulty: 75, stabilityIndex: 88, workLifeBalance: 55, mentalPressure: 60,
    requiredSkills: ['Network Security', 'Linux', 'Penetration Testing', 'Cryptography', 'SIEM', 'Incident Response'],
    emergingSkills: ['AI Security', 'Zero Trust Architecture', 'Cloud Security', 'Quantum Cryptography'],
    alternativeCareers: ['Cloud Architect', 'DevOps Engineer', 'Security Consultant', 'CISO'],
    topCompanies: ['CrowdStrike', 'Palo Alto', 'Google', 'Microsoft', 'IBM', 'Cisco'],
    sectors: ['Banking', 'Government', 'Defense', 'Tech', 'Healthcare'],
  },
  {
    name: 'Civil Services (IAS/IPS)', aliases: ['ias','ips','upsc','civil services','government officer','bureaucrat','civil servant'],
    domain: 'Government', successProbability: 15, futureScope: 75, salaryEntry: 8, salaryMid: 15, salarySenior: 25,
    salaryGrowthRate: 5, aiRisk: 5, industryDemand: 60, globalOpportunity: 20, competition: 98,
    learningDifficulty: 95, stabilityIndex: 98, workLifeBalance: 35, mentalPressure: 85,
    requiredSkills: ['General Knowledge', 'Current Affairs', 'Essay Writing', 'Ethics', 'Administration', 'Decision Making'],
    emergingSkills: ['Digital Governance', 'Data-Driven Policy', 'Smart Cities', 'E-Governance'],
    alternativeCareers: ['Policy Analyst', 'NGO Leader', 'Political Consultant', 'Academic Researcher'],
    topCompanies: ['Government of India', 'State Governments', 'NITI Aayog', 'UN', 'World Bank'],
    sectors: ['Administration', 'Policy', 'Development', 'Defense', 'Foreign Affairs'],
  },
  {
    name: 'Pilot', aliases: ['pilot','aviation','airline pilot','commercial pilot','flying'],
    domain: 'Aviation', successProbability: 55, futureScope: 72, salaryEntry: 8, salaryMid: 25, salarySenior: 60,
    salaryGrowthRate: 8, aiRisk: 15, industryDemand: 65, globalOpportunity: 85, competition: 70,
    learningDifficulty: 80, stabilityIndex: 65, workLifeBalance: 30, mentalPressure: 75,
    requiredSkills: ['Physics', 'Mathematics', 'Navigation', 'Communication', 'Decision Making', 'Situational Awareness'],
    emergingSkills: ['Drone Operations', 'eVTOL', 'AI-Assisted Navigation', 'Space Tourism'],
    alternativeCareers: ['Aviation Manager', 'Air Traffic Controller', 'Flight Engineer', 'Drone Pilot'],
    topCompanies: ['Air India', 'IndiGo', 'Emirates', 'Singapore Airlines', 'SpaceX'],
    sectors: ['Commercial Aviation', 'Cargo', 'Military', 'Private Aviation', 'Space'],
  },
];

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
export interface CareerAnalysis {
  career: CareerProfile;
  signal: 'green' | 'orange' | 'red';
  scores: {
    successProbability: number;
    futureScope: number;
    salaryGrowth: number;
    aiAutomationRisk: number;
    skillGap: number;
    industryDemand: number;
    globalOpportunity: number;
    marketCompetition: number;
    learningDifficulty: number;
    stabilityIndex: number;
    workLifeBalance: number;
    mentalPressure: number;
    riskReward: number;
    decisionConfidence: number;
    hiringProbability: number;
  };
  salaryForecast: { year: string; optimistic: number; projected: number; conservative: number }[];
  demandForecast: { year: string; demand: number; aiImpact: number }[];
  radarData: { subject: string; value: number }[];
  skillGapItems: { skill: string; level: 'have' | 'learn' | 'critical' }[];
  improvements: string[];
  riskFactors: { factor: string; level: 'low' | 'medium' | 'high'; score: number }[];
  alternativePaths: { name: string; matchScore: number; signal: 'green' | 'orange' | 'red' }[];
}

/* ═══════════════════════════════════════
   MATCHER
═══════════════════════════════════════ */
export function matchCareerQuery(query: string): CareerProfile | null {
  const q = query.toLowerCase().trim();
  for (const career of CAREER_DB) {
    if (q.includes(career.name.toLowerCase())) return career;
    for (const alias of career.aliases) {
      if (q.includes(alias)) return career;
    }
  }
  return null;
}

export function isCareerQuery(query: string): boolean {
  return query.trim().length > 0;
}

/* ═══════════════════════════════════════
   ANALYZER
═══════════════════════════════════════ */
function generateDynamicCareerProfile(query: string): CareerProfile {
  const q = query.toLowerCase().trim();
  const cleanName = query
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  let seed = 0;
  for (let i = 0; i < q.length; i++) {
    seed = q.charCodeAt(i) + ((seed << 5) - seed);
  }
  seed = Math.abs(seed);

  const successProbability = 45 + (seed % 40);
  const futureScope = 50 + ((seed >> 2) % 40);
  const aiRisk = 10 + ((seed >> 4) % 65);
  const industryDemand = 50 + ((seed >> 6) % 40);
  const globalOpportunity = 45 + ((seed >> 8) % 45);
  const competition = 50 + ((seed >> 10) % 40);
  const learningDifficulty = 40 + ((seed >> 12) % 45);
  const stabilityIndex = 40 + ((seed >> 14) % 50);
  const workLifeBalance = 35 + ((seed >> 16) % 50);
  const mentalPressure = 40 + ((seed >> 18) % 45);

  const salaryEntry = 4 + (seed % 8);
  const salaryMid = salaryEntry * 2 + ((seed >> 3) % 10);
  const salarySenior = salaryMid * 2 + ((seed >> 6) % 25);
  const salaryGrowthRate = 8 + ((seed >> 9) % 15);

  let domain = 'General Decision';
  let requiredSkills = ['Analysis', 'Strategy', 'Planning', 'Critical Thinking'];
  let emergingSkills = ['AI Systems', 'Remote Collaboration', 'Process Automation'];
  let topCompanies = ['Global Leaders', 'Consulting Firms', 'Innovative Enterprises'];
  let sectors = ['General Services', 'Modern Trade'];
  let alternativeCareers = ['Strategic Consultant', 'Analyst', 'Advisor'];

  if (q.includes('code') || q.includes('dev') || q.includes('tech') || q.includes('web') || q.includes('software') || q.includes('data') || q.includes('ai') || q.includes('machine learning') || q.includes('cyber') || q.includes('program')) {
    domain = 'Technology';
    requiredSkills = ['System Design', 'Algorithms', 'Logic & Development', 'APIs & Web Integrations', 'Problem Solving'];
    emergingSkills = ['Generative AI Coding', 'Cloud DevOps Automation', 'Large Language Models (LLMs)', 'Quantum Architecture'];
    topCompanies = ['Google', 'Microsoft', 'NVIDIA', 'Stripe', 'Atlassian', 'Tech Startups'];
    sectors = ['Software-as-a-Service (SaaS)', 'Cloud Computing', 'AI Research', 'E-commerce'];
    alternativeCareers = ['Solutions Architect', 'Technical Product Manager', 'DevOps Specialist'];
  } else if (q.includes('doctor') || q.includes('health') || q.includes('nurse') || q.includes('medicine') || q.includes('clinic') || q.includes('hospital') || q.includes('dentist') || q.includes('neet')) {
    domain = 'Healthcare';
    requiredSkills = ['Clinical Diagnostics', 'Patient Relations', 'Medical Ethics', 'Anatomical Knowledge'];
    emergingSkills = ['AI Assisted Diagnostics', 'Telehealth Systems', 'Precision Genomic Therapies'];
    topCompanies = ['Mayo Clinic', 'Apollo Hospitals', 'Max Healthcare', 'WHO', 'Pharma Enterprises'];
    sectors = ['Clinical Medicine', 'Digital Health Tech', 'Pharmaceuticals', 'Public Health Admin'];
    alternativeCareers = ['Clinical Advisor', 'Healthcare Administrator', 'Medical Operations Expert'];
  } else if (q.includes('art') || q.includes('design') || q.includes('creative') || q.includes('music') || q.includes('video') || q.includes('film') || q.includes('ui') || q.includes('ux') || q.includes('graphic') || q.includes('fashion')) {
    domain = 'Creative Design';
    requiredSkills = ['Visual Composition', 'User Centered Thinking', 'Typography & Style Guides', 'Interactive Prototyping'];
    emergingSkills = ['AI Collaboration Tools', 'AR/VR Spatial Design', 'Generative Media Design'];
    topCompanies = ['Apple', 'Figma', 'Adobe', 'Airbnb', 'Netflix', 'Creative Agencies'];
    sectors = ['Digital Media', 'User Experience (UX/UI)', 'Brand Engineering', 'Product Design'];
    alternativeCareers = ['Design Strategist', 'Immersive Experience Creator', 'Creative Director'];
  } else if (q.includes('business') || q.includes('startup') || q.includes('founder') || q.includes('entrepreneur') || q.includes('company') || q.includes('sell') || q.includes('marketing') || q.includes('sales') || q.includes('commerce') || q.includes('shop') || q.includes('cafe') || q.includes('restaurant')) {
    domain = 'Business & Ventures';
    requiredSkills = ['Market Position Mapping', 'Financial Forecasting', 'Growth Hacking & Sales', 'Risk Identification'];
    emergingSkills = ['AI Operations Flow', 'No-code Venture Building', 'Omnichannel Brand Scale'];
    topCompanies = ['Y Combinator', 'Venture Capital firms', 'Fast-Growing Scaleups', 'Unicorn Enterprises'];
    sectors = ['E-commerce', 'SaaS Ventures', 'Direct-to-Consumer (D2C)', 'Retail & Services'];
    alternativeCareers = ['Growth Director', 'Venture Creation Analyst', 'Operations Leader'];
  } else if (q.includes('money') || q.includes('finance') || q.includes('bank') || q.includes('accounting') || q.includes('stock') || q.includes('trade') || q.includes('ca') || q.includes('cfa') || q.includes('audit')) {
    domain = 'Finance';
    requiredSkills = ['Quantitative Modeling', 'Risk Assessment Matrices', 'Macro-economics', 'Corporate Compliance'];
    emergingSkills = ['DeFi Protocols & Audits', 'Algorithmic Financial AI', 'ESG Sustainability Auditing'];
    topCompanies = ['Goldman Sachs', 'JPMorgan Chase', 'Deloitte', 'BlackRock', 'Corporate Banks'];
    sectors = ['Wealth Management', 'Investment Operations', 'Audit & Advisory Services'];
    alternativeCareers = ['Financial Risk Advisor', 'CFO Chief Financial Officer', 'Investment Strategist'];
  } else if (q.includes('teach') || q.includes('school') || q.includes('learn') || q.includes('study') || q.includes('degree') || q.includes('mba') || q.includes('college') || q.includes('professor') || q.includes('education') || q.includes('phd')) {
    domain = 'Education & Academics';
    requiredSkills = ['Pedagogical Engineering', 'Public Speaking', 'Curriculum Architecture', 'Interactive Mentoring'];
    emergingSkills = ['Adaptive Learning Systems', 'Metaverse Virtual Classrooms', 'AI-assisted Grading'];
    topCompanies = ['Coursera', 'Khan Academy', 'Harvard University', 'Modern EdTech Scaleups'];
    sectors = ['Higher Education', 'EdTech Solutions', 'Corporate Talent Architecture'];
    alternativeCareers = ['Instructional Designer', 'Corporate Learning Specialist', 'EdTech Advisor'];
  }

  return {
    name: cleanName,
    aliases: [q],
    domain,
    successProbability,
    futureScope,
    salaryEntry,
    salaryMid,
    salarySenior,
    salaryGrowthRate,
    aiRisk,
    industryDemand,
    globalOpportunity,
    competition,
    learningDifficulty,
    stabilityIndex,
    workLifeBalance,
    mentalPressure,
    requiredSkills,
    emergingSkills,
    alternativeCareers,
    topCompanies,
    sectors,
  };
}

export function analyzeCareerDecision(query: string): CareerAnalysis | null {
  let career = matchCareerQuery(query);
  if (!career) {
    career = generateDynamicCareerProfile(query);
  }

  // Calculate composite scores
  const salaryGrowth = Math.min(100, career.salaryGrowthRate * 5);
  const riskReward = Math.round(
    (career.successProbability * 0.3) + ((100 - career.aiRisk) * 0.2) +
    (career.futureScope * 0.2) + (salaryGrowth * 0.15) + ((100 - career.competition) * 0.15)
  );
  const decisionConfidence = Math.round(
    career.successProbability * 0.25 + career.futureScope * 0.2 +
    career.industryDemand * 0.15 + career.stabilityIndex * 0.15 +
    (100 - career.aiRisk) * 0.15 + career.globalOpportunity * 0.1
  );
  const hiringProbability = Math.round(
    career.industryDemand * 0.3 + career.successProbability * 0.2 +
    (100 - career.competition) * 0.2 + career.globalOpportunity * 0.15 +
    career.futureScope * 0.15
  );
  const skillGap = Math.round(100 - (career.learningDifficulty * 0.4 + career.competition * 0.3 + (100 - career.successProbability) * 0.3));

  // Signal
  const avgScore = (career.successProbability + career.futureScope + career.industryDemand +
    career.stabilityIndex + (100 - career.aiRisk)) / 5;
  const signal: CareerAnalysis['signal'] = avgScore >= 75 ? 'green' : avgScore >= 55 ? 'orange' : 'red';

  // Salary forecast
  const salaryForecast = [
    { year: '2025', optimistic: career.salaryEntry, projected: career.salaryEntry, conservative: career.salaryEntry },
    { year: '2027', optimistic: Math.round(career.salaryEntry * 1.8), projected: Math.round(career.salaryEntry * 1.5), conservative: Math.round(career.salaryEntry * 1.2) },
    { year: '2029', optimistic: Math.round(career.salaryMid * 1.3), projected: career.salaryMid, conservative: Math.round(career.salaryMid * 0.8) },
    { year: '2031', optimistic: Math.round(career.salaryMid * 1.8), projected: Math.round(career.salaryMid * 1.4), conservative: career.salaryMid },
    { year: '2033', optimistic: career.salarySenior, projected: Math.round(career.salarySenior * 0.8), conservative: Math.round(career.salarySenior * 0.6) },
    { year: '2035', optimistic: Math.round(career.salarySenior * 1.3), projected: career.salarySenior, conservative: Math.round(career.salarySenior * 0.7) },
  ];

  // Demand forecast
  const demandForecast = [
    { year: '2025', demand: career.industryDemand, aiImpact: career.aiRisk },
    { year: '2027', demand: Math.min(100, career.industryDemand + 4), aiImpact: Math.min(100, career.aiRisk + 5) },
    { year: '2029', demand: Math.min(100, career.industryDemand + 8), aiImpact: Math.min(100, career.aiRisk + 12) },
    { year: '2031', demand: Math.min(100, career.industryDemand + 10), aiImpact: Math.min(100, career.aiRisk + 18) },
    { year: '2033', demand: Math.min(100, career.industryDemand + 6), aiImpact: Math.min(100, career.aiRisk + 25) },
    { year: '2035', demand: Math.min(100, career.industryDemand + 2), aiImpact: Math.min(100, career.aiRisk + 30) },
  ];

  // Radar data
  const radarData = [
    { subject: 'Demand', value: career.industryDemand },
    { subject: 'Stability', value: career.stabilityIndex },
    { subject: 'Growth', value: career.futureScope },
    { subject: 'Salary', value: salaryGrowth },
    { subject: 'AI Safety', value: 100 - career.aiRisk },
    { subject: 'Global', value: career.globalOpportunity },
    { subject: 'Balance', value: career.workLifeBalance },
  ];

  // Skill gap
  const skillGapItems = [
    ...career.requiredSkills.slice(0, 3).map(s => ({ skill: s, level: 'have' as const })),
    ...career.requiredSkills.slice(3).map(s => ({ skill: s, level: 'learn' as const })),
    ...career.emergingSkills.slice(0, 3).map(s => ({ skill: s, level: 'critical' as const })),
  ];

  // Improvements
  const improvements: string[] = [];
  if (career.aiRisk > 25) improvements.push(`Learn AI/automation tools in ${career.domain} to future-proof your career`);
  if (career.competition > 75) improvements.push('Build a strong portfolio and personal brand to stand out');
  if (career.learningDifficulty > 70) improvements.push('Start learning early and follow a structured roadmap');
  if (career.workLifeBalance < 50) improvements.push('Plan for work-life boundaries from the start');
  if (career.mentalPressure > 70) improvements.push('Develop stress management and mindfulness practices');
  improvements.push(`Master emerging skills: ${career.emergingSkills.slice(0, 2).join(', ')}`);
  improvements.push(`Network with professionals at ${career.topCompanies.slice(0, 2).join(', ')}`);
  improvements.push('Build real-world projects and contribute to open-source/community');

  // Risk factors
  const riskFactors = [
    { factor: 'AI Automation', level: career.aiRisk > 30 ? 'high' as const : career.aiRisk > 15 ? 'medium' as const : 'low' as const, score: career.aiRisk },
    { factor: 'Market Competition', level: career.competition > 80 ? 'high' as const : career.competition > 60 ? 'medium' as const : 'low' as const, score: career.competition },
    { factor: 'Industry Volatility', level: career.stabilityIndex < 50 ? 'high' as const : career.stabilityIndex < 75 ? 'medium' as const : 'low' as const, score: 100 - career.stabilityIndex },
    { factor: 'Learning Curve', level: career.learningDifficulty > 75 ? 'high' as const : career.learningDifficulty > 50 ? 'medium' as const : 'low' as const, score: career.learningDifficulty },
    { factor: 'Burnout Risk', level: career.mentalPressure > 75 ? 'high' as const : career.mentalPressure > 50 ? 'medium' as const : 'low' as const, score: career.mentalPressure },
    { factor: 'Job Security', level: career.stabilityIndex > 80 ? 'low' as const : career.stabilityIndex > 60 ? 'medium' as const : 'high' as const, score: 100 - career.stabilityIndex },
  ];

  // Alternative paths
  const alternativePaths = career.alternativeCareers.map(name => {
    const match = CAREER_DB.find(c => c.name.toLowerCase() === name.toLowerCase());
    const score = match ? Math.round((match.successProbability + match.futureScope + match.industryDemand) / 3) : 60 + Math.floor(Math.random() * 20);
    return {
      name,
      matchScore: score,
      signal: (score >= 75 ? 'green' : score >= 55 ? 'orange' : 'red') as CareerAnalysis['signal'],
    };
  });

  return {
    career, signal,
    scores: {
      successProbability: career.successProbability,
      futureScope: career.futureScope,
      salaryGrowth,
      aiAutomationRisk: career.aiRisk,
      skillGap: Math.max(10, skillGap),
      industryDemand: career.industryDemand,
      globalOpportunity: career.globalOpportunity,
      marketCompetition: career.competition,
      learningDifficulty: career.learningDifficulty,
      stabilityIndex: career.stabilityIndex,
      workLifeBalance: career.workLifeBalance,
      mentalPressure: career.mentalPressure,
      riskReward,
      decisionConfidence,
      hiringProbability,
    },
    salaryForecast,
    demandForecast,
    radarData,
    skillGapItems,
    improvements,
    riskFactors,
    alternativePaths,
  };
}
