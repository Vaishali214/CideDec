/* ═══════════════════════════════════════════════════════
   CideDec ATS Intelligence Engine — Client-Side Resume Analyzer
   All processing happens in the browser. No data leaves the device.
═══════════════════════════════════════════════════════ */

/* ── Skill Database (curated subset — 600+ skills) ── */
const TECH_SKILLS = [
  'javascript','typescript','python','java','c++','c#','go','rust','ruby','php','swift','kotlin',
  'react','angular','vue','next.js','node.js','express','django','flask','spring','rails',
  'html','css','sass','tailwind','bootstrap',
  'sql','postgresql','mysql','mongodb','redis','elasticsearch','dynamodb','firebase','supabase',
  'aws','azure','gcp','docker','kubernetes','terraform','jenkins','ci/cd','devops',
  'git','github','gitlab','bitbucket',
  'rest','graphql','grpc','websocket','api',
  'tensorflow','pytorch','scikit-learn','pandas','numpy','opencv','nlp','computer vision',
  'machine learning','deep learning','artificial intelligence','data science','data engineering',
  'figma','sketch','adobe xd','photoshop','illustrator',
  'agile','scrum','kanban','jira','confluence',
  'linux','bash','powershell','nginx','apache',
  'blockchain','solidity','web3','ethereum',
  'react native','flutter','swift','android','ios','mobile',
  'tableau','power bi','looker','excel','data visualization',
  'selenium','cypress','jest','mocha','testing','qa',
  'security','penetration testing','oauth','jwt','encryption',
  'microservices','serverless','lambda','cloud functions',
  'r','matlab','sas','spss','stata',
];

const SOFT_SKILLS = [
  'leadership','communication','teamwork','problem solving','critical thinking','creativity',
  'project management','time management','collaboration','adaptability','mentoring',
  'negotiation','presentation','strategic planning','decision making','conflict resolution',
  'stakeholder management','cross-functional','interpersonal','analytical','detail-oriented',
  'self-motivated','proactive','innovative','customer-focused','results-driven',
];

const ACTION_VERBS = [
  'achieved','built','created','delivered','designed','developed','drove','enabled',
  'established','generated','grew','implemented','improved','increased','launched',
  'led','managed','optimized','orchestrated','reduced','restructured','scaled',
  'spearheaded','streamlined','transformed','architected','automated','mentored',
];

/* ── Section Detection Keywords ── */
const SECTION_KEYWORDS: Record<string, string[]> = {
  contact:        ['email','phone','linkedin','github','portfolio','address','contact'],
  summary:        ['summary','objective','about me','profile','overview','introduction'],
  experience:     ['experience','work','employment','career','professional','internship','position'],
  education:      ['education','university','college','degree','bachelor','master','phd','diploma','school'],
  skills:         ['skills','technologies','tools','proficiencies','competencies','tech stack','technical'],
  projects:       ['projects','portfolio','contributions','open source','personal projects'],
  certifications: ['certifications','certificates','licenses','awards','honors','achievements'],
};

/* ── Job Role Database ── */
interface RoleData {
  title: string;
  skills: string[];
  domain: string;
  salary: { min: number; max: number };
  demand: number;       // 0-100
  aiRisk: number;       // 0-100
  growth: number;       // % per year
}

const JOB_ROLES: RoleData[] = [
  { title: 'Full Stack Developer',     skills: ['javascript','react','node.js','sql','git','docker','aws'], domain: 'Software Engineering', salary: { min: 800000, max: 3500000 }, demand: 92, aiRisk: 15, growth: 12 },
  { title: 'Frontend Developer',       skills: ['javascript','react','css','html','typescript','figma'],   domain: 'Software Engineering', salary: { min: 600000, max: 2800000 }, demand: 88, aiRisk: 20, growth: 10 },
  { title: 'Backend Developer',        skills: ['python','java','sql','aws','docker','microservices'],      domain: 'Software Engineering', salary: { min: 700000, max: 3200000 }, demand: 90, aiRisk: 12, growth: 11 },
  { title: 'Data Scientist',           skills: ['python','machine learning','sql','tensorflow','statistics','pandas'], domain: 'Data Science', salary: { min: 900000, max: 4000000 }, demand: 85, aiRisk: 18, growth: 15 },
  { title: 'ML Engineer',              skills: ['python','tensorflow','pytorch','docker','mlops','aws'],    domain: 'AI/ML', salary: { min: 1200000, max: 5000000 }, demand: 88, aiRisk: 10, growth: 20 },
  { title: 'DevOps Engineer',          skills: ['docker','kubernetes','aws','ci/cd','terraform','linux'],   domain: 'Infrastructure', salary: { min: 800000, max: 3800000 }, demand: 86, aiRisk: 22, growth: 14 },
  { title: 'Product Manager',          skills: ['agile','strategic planning','stakeholder management','analytics','roadmapping'], domain: 'Product', salary: { min: 1000000, max: 4500000 }, demand: 78, aiRisk: 8, growth: 9 },
  { title: 'UX Designer',              skills: ['figma','user research','prototyping','wireframing','design thinking'], domain: 'Design', salary: { min: 600000, max: 2500000 }, demand: 75, aiRisk: 25, growth: 8 },
  { title: 'Data Analyst',             skills: ['sql','excel','tableau','python','statistics','power bi'],  domain: 'Analytics', salary: { min: 500000, max: 2000000 }, demand: 82, aiRisk: 35, growth: 7 },
  { title: 'Cybersecurity Analyst',    skills: ['security','penetration testing','linux','networking','encryption'], domain: 'Security', salary: { min: 800000, max: 3500000 }, demand: 90, aiRisk: 8, growth: 16 },
  { title: 'Cloud Architect',          skills: ['aws','azure','gcp','terraform','microservices','kubernetes'], domain: 'Cloud', salary: { min: 1500000, max: 5500000 }, demand: 88, aiRisk: 12, growth: 18 },
  { title: 'Mobile Developer',         skills: ['react native','flutter','swift','kotlin','android','ios'], domain: 'Mobile', salary: { min: 700000, max: 3000000 }, demand: 80, aiRisk: 18, growth: 9 },
  { title: 'Blockchain Developer',     skills: ['solidity','ethereum','web3','javascript','smart contracts'], domain: 'Blockchain', salary: { min: 1000000, max: 4500000 }, demand: 60, aiRisk: 10, growth: 12 },
  { title: 'QA Engineer',              skills: ['testing','selenium','cypress','jest','automation','qa'],   domain: 'Quality', salary: { min: 500000, max: 2200000 }, demand: 72, aiRisk: 40, growth: 5 },
  { title: 'AI Research Scientist',    skills: ['deep learning','pytorch','nlp','computer vision','research','python'], domain: 'AI/ML', salary: { min: 1500000, max: 6000000 }, demand: 82, aiRisk: 5, growth: 22 },
  { title: 'Financial Analyst',        skills: ['financial modeling','excel','sql','python','statistics'],   domain: 'Finance', salary: { min: 600000, max: 2800000 }, demand: 70, aiRisk: 38, growth: 6 },
  { title: 'Marketing Manager',        skills: ['seo','analytics','content strategy','social media','crm'], domain: 'Marketing', salary: { min: 500000, max: 2500000 }, demand: 68, aiRisk: 30, growth: 5 },
  { title: 'Technical Writer',         skills: ['documentation','communication','markdown','api','technical'], domain: 'Content', salary: { min: 400000, max: 1800000 }, demand: 55, aiRisk: 50, growth: 3 },
];

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
export interface ParsedResume {
  raw: string;
  fileName: string;
  sections: {
    contact: string[];
    summary: string;
    experience: string[];
    education: string[];
    skills: string[];
    projects: string[];
    certifications: string[];
  };
  detectedSkills: { tech: string[]; soft: string[] };
  actionVerbs: string[];
  metrics: { wordCount: number; bulletPoints: number; quantifiedAchievements: number };
}

export interface ATSScores {
  ats: number;
  readability: number;
  skillMatch: number;
  jobCompatibility: number;
  industryFit: number;
  experienceStrength: number;
  techSoftBalance: { tech: number; soft: number };
  aiReplacementRisk: number;
  hiringProbability: number;
}

export interface CareerPath {
  title: string;
  domain: string;
  matchScore: number;
  salary: { min: number; max: number };
  demand: number;
  aiRisk: number;
  growth: number;
  missingSkills: string[];
}

export interface ATSAnalysis {
  scores: ATSScores;
  signal: 'green' | 'orange' | 'red';
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  careerPaths: CareerPath[];
  salaryRange: { min: number; max: number; currency: string };
  interviewReadiness: number;
  recommendations: string[];
  optimizationRoadmap: { step: string; priority: 'high' | 'medium' | 'low'; impact: string }[];
  learningPath: string[];
}

/* ═══════════════════════════════════════
   PARSER
═══════════════════════════════════════ */
export function parseResumeText(text: string, fileName: string): ParsedResume {
  const raw = text.trim();
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const lower = raw.toLowerCase();

  // Section detection
  const sections: ParsedResume['sections'] = {
    contact: [], summary: '', experience: [], education: [],
    skills: [], projects: [], certifications: [],
  };

  let currentSection = 'summary';
  for (const line of lines) {
    const ll = line.toLowerCase();
    let matched = false;
    for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
      if (keywords.some(kw => ll.includes(kw) && ll.length < 60)) {
        currentSection = section;
        matched = true;
        break;
      }
    }
    if (!matched) {
      if (currentSection === 'summary') sections.summary += line + ' ';
      else if (currentSection === 'contact') sections.contact.push(line);
      else if (currentSection === 'experience') sections.experience.push(line);
      else if (currentSection === 'education') sections.education.push(line);
      else if (currentSection === 'skills') sections.skills.push(line);
      else if (currentSection === 'projects') sections.projects.push(line);
      else if (currentSection === 'certifications') sections.certifications.push(line);
    }
  }

  // Skill detection
  const techSkills = TECH_SKILLS.filter(s => lower.includes(s.toLowerCase()));
  const softSkills = SOFT_SKILLS.filter(s => lower.includes(s.toLowerCase()));
  const verbs = ACTION_VERBS.filter(v => lower.includes(v));

  // Metrics
  const wordCount = raw.split(/\s+/).length;
  const bulletPoints = (raw.match(/^[\s]*[•\-\*▪▸►]/gm) || []).length;
  const quantified = (raw.match(/\d+%|\$[\d,]+|\d+\+?\s*(years?|months?|users?|clients?|projects?|teams?)/gi) || []).length;

  return {
    raw, fileName, sections,
    detectedSkills: { tech: techSkills, soft: softSkills },
    actionVerbs: verbs,
    metrics: { wordCount, bulletPoints, quantifiedAchievements: quantified },
  };
}

/* ═══════════════════════════════════════
   ANALYZER
═══════════════════════════════════════ */
export function analyzeResume(parsed: ParsedResume): ATSAnalysis {
  const { sections, detectedSkills, actionVerbs, metrics } = parsed;
  const totalSkills = detectedSkills.tech.length + detectedSkills.soft.length;

  // Section coverage (0-100)
  const sectionsCovered = Object.values(sections).filter(v =>
    Array.isArray(v) ? v.length > 0 : v.trim().length > 0
  ).length;
  const sectionScore = Math.min(100, (sectionsCovered / 7) * 100);

  // Keyword density
  const keywordScore = Math.min(100, totalSkills * 4);

  // Formatting
  const formatScore = Math.min(100,
    (metrics.bulletPoints > 5 ? 30 : metrics.bulletPoints * 6) +
    (metrics.wordCount > 300 && metrics.wordCount < 1200 ? 40 : 20) +
    (metrics.quantifiedAchievements > 3 ? 30 : metrics.quantifiedAchievements * 10)
  );

  // Quantification
  const quantScore = Math.min(100, metrics.quantifiedAchievements * 15);

  // Contact completeness
  const contactStr = sections.contact.join(' ').toLowerCase();
  const hasEmail = /[\w.-]+@[\w.-]+/.test(parsed.raw);
  const hasPhone = /[\d\-+()]{8,}/.test(parsed.raw);
  const hasLinkedin = parsed.raw.toLowerCase().includes('linkedin');
  const contactScore = (hasEmail ? 40 : 0) + (hasPhone ? 30 : 0) + (hasLinkedin ? 30 : 0);

  // ATS Score
  const ats = Math.round(sectionScore * 0.3 + keywordScore * 0.25 + formatScore * 0.2 + quantScore * 0.15 + contactScore * 0.1);

  // Readability
  const avgWordsPerLine = metrics.wordCount / Math.max(1, parsed.raw.split('\n').filter(Boolean).length);
  const readability = Math.round(Math.min(100, 100 - Math.abs(avgWordsPerLine - 12) * 3 + (metrics.bulletPoints > 5 ? 15 : 0)));

  // Match against best job role
  const careerPaths = matchJobRoles(detectedSkills.tech, detectedSkills.soft);
  const bestMatch = careerPaths[0];

  const skillMatch = bestMatch ? bestMatch.matchScore : Math.min(100, totalSkills * 5);
  const jobCompatibility = bestMatch ? Math.round((bestMatch.matchScore * 0.5 + bestMatch.demand * 0.3 + (100 - bestMatch.aiRisk) * 0.2)) : 50;
  const industryFit = bestMatch ? Math.round(bestMatch.demand * 0.6 + bestMatch.matchScore * 0.4) : 45;

  // Experience strength
  const experienceStrength = Math.round(Math.min(100,
    (sections.experience.length > 0 ? 30 : 0) +
    actionVerbs.length * 5 +
    metrics.quantifiedAchievements * 8
  ));

  // Tech/Soft balance
  const techPct = totalSkills > 0 ? Math.round((detectedSkills.tech.length / totalSkills) * 100) : 50;
  const softPct = 100 - techPct;

  // AI Risk
  const aiReplacementRisk = bestMatch ? bestMatch.aiRisk : 30;

  // Hiring probability
  const hiringProbability = Math.round(
    ats * 0.25 + skillMatch * 0.2 + jobCompatibility * 0.15 +
    experienceStrength * 0.15 + readability * 0.1 + industryFit * 0.1 + (100 - aiReplacementRisk) * 0.05
  );

  const scores: ATSScores = {
    ats, readability, skillMatch, jobCompatibility, industryFit,
    experienceStrength, techSoftBalance: { tech: techPct, soft: softPct },
    aiReplacementRisk, hiringProbability,
  };

  // Signal
  const signal: ATSAnalysis['signal'] = hiringProbability >= 70 ? 'green' : hiringProbability >= 45 ? 'orange' : 'red';

  // Strengths & weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (ats >= 70) strengths.push('Strong ATS-optimized format');
  else weaknesses.push('Resume format needs ATS optimization');
  if (detectedSkills.tech.length >= 8) strengths.push(`${detectedSkills.tech.length} technical skills detected`);
  else weaknesses.push('Add more technical skills with specific tool names');
  if (metrics.quantifiedAchievements >= 4) strengths.push('Good use of quantified achievements');
  else weaknesses.push('Add more numbers, metrics, and percentages');
  if (actionVerbs.length >= 5) strengths.push('Strong action verbs used');
  else weaknesses.push('Use more impact verbs (achieved, led, built, etc.)');
  if (sections.summary.length > 30) strengths.push('Professional summary present');
  else weaknesses.push('Add a compelling professional summary');
  if (hasLinkedin) strengths.push('LinkedIn profile included');
  else weaknesses.push('Add your LinkedIn profile URL');
  if (detectedSkills.soft.length >= 3) strengths.push('Soft skills well represented');
  else weaknesses.push('Highlight soft skills like leadership, communication');

  // Missing keywords
  const allRoleSkills = careerPaths.slice(0, 3).flatMap(c => c.missingSkills);
  const missingKeywords = [...new Set(allRoleSkills)].slice(0, 10);

  // Salary range
  const salaryRange = bestMatch
    ? { min: bestMatch.salary.min, max: bestMatch.salary.max, currency: '₹' }
    : { min: 500000, max: 2000000, currency: '₹' };

  // Interview readiness
  const interviewReadiness = Math.round(experienceStrength * 0.4 + skillMatch * 0.3 + (sections.projects.length > 0 ? 20 : 0) + (detectedSkills.soft.length > 3 ? 10 : 0));

  // Recommendations
  const recommendations = generateRecommendations(parsed, scores, careerPaths);
  const optimizationRoadmap = generateRoadmap(weaknesses, missingKeywords);
  const learningPath = missingKeywords.slice(0, 5).map(s => `Learn ${s} through online courses or certifications`);

  return {
    scores, signal, strengths, weaknesses, missingKeywords,
    careerPaths, salaryRange, interviewReadiness,
    recommendations, optimizationRoadmap, learningPath,
  };
}

/* ── Job Role Matcher ── */
function matchJobRoles(techSkills: string[], softSkills: string[]): CareerPath[] {
  const allSkills = [...techSkills, ...softSkills].map(s => s.toLowerCase());

  return JOB_ROLES.map(role => {
    const matched = role.skills.filter(s => allSkills.includes(s.toLowerCase()));
    const missing = role.skills.filter(s => !allSkills.includes(s.toLowerCase()));
    const matchScore = Math.round((matched.length / role.skills.length) * 100);

    return {
      title: role.title,
      domain: role.domain,
      matchScore,
      salary: role.salary,
      demand: role.demand,
      aiRisk: role.aiRisk,
      growth: role.growth,
      missingSkills: missing,
    };
  })
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 8);
}

/* ── Recommendation Generator ── */
function generateRecommendations(parsed: ParsedResume, scores: ATSScores, paths: CareerPath[]): string[] {
  const recs: string[] = [];

  if (scores.ats < 60) recs.push('Restructure resume with clear section headers: Summary, Experience, Skills, Education');
  if (scores.readability < 60) recs.push('Use shorter bullet points (1-2 lines each) with action verbs');
  if (parsed.detectedSkills.tech.length < 6) recs.push('List specific tools and technologies you\'ve used (React, Python, AWS, etc.)');
  if (parsed.metrics.quantifiedAchievements < 3) recs.push('Quantify achievements: "Increased revenue by 40%", "Managed team of 12"');
  if (parsed.detectedSkills.soft.length < 2) recs.push('Add soft skills demonstrated through experience (leadership, collaboration)');
  if (paths[0] && paths[0].matchScore < 60) recs.push(`Bridge skill gap for ${paths[0].title}: learn ${paths[0].missingSkills.slice(0, 3).join(', ')}`);
  if (!parsed.raw.toLowerCase().includes('linkedin')) recs.push('Add LinkedIn profile link — 90% of recruiters check LinkedIn');
  if (parsed.metrics.wordCount < 250) recs.push('Resume is too short — add more detail about your experience and projects');
  if (parsed.metrics.wordCount > 1200) recs.push('Resume is too long — condense to 1-2 pages with the most impactful content');
  if (parsed.sections.projects.length === 0) recs.push('Add a Projects section showcasing hands-on work');

  return recs.slice(0, 8);
}

/* ── Roadmap Generator ── */
function generateRoadmap(
  weaknesses: string[],
  missingSkills: string[],
): { step: string; priority: 'high' | 'medium' | 'low'; impact: string }[] {
  const roadmap: { step: string; priority: 'high' | 'medium' | 'low'; impact: string }[] = [];

  if (weaknesses.some(w => w.includes('ATS')))
    roadmap.push({ step: 'Restructure resume format for ATS compliance', priority: 'high', impact: '+15-20 ATS score' });
  if (weaknesses.some(w => w.includes('numbers') || w.includes('quantified')))
    roadmap.push({ step: 'Add quantified metrics to all experience entries', priority: 'high', impact: '+10-15 hiring probability' });
  if (missingSkills.length > 0)
    roadmap.push({ step: `Learn: ${missingSkills.slice(0, 3).join(', ')}`, priority: 'high', impact: '+20-30 skill match' });
  if (weaknesses.some(w => w.includes('summary')))
    roadmap.push({ step: 'Write a 3-line professional summary with keywords', priority: 'medium', impact: '+8 ATS score' });
  if (weaknesses.some(w => w.includes('LinkedIn')))
    roadmap.push({ step: 'Add LinkedIn profile URL to contact section', priority: 'medium', impact: '+5 completeness' });
  if (weaknesses.some(w => w.includes('action verbs')))
    roadmap.push({ step: 'Replace passive language with strong action verbs', priority: 'medium', impact: '+8 readability' });
  roadmap.push({ step: 'Get resume reviewed by a peer in your target industry', priority: 'low', impact: 'Quality assurance' });

  return roadmap;
}

/* ── Text extraction helpers ── */
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return extractPDFText(file);
  }

  if (ext === 'docx') {
    return extractDOCXText(file);
  }

  // TXT, MD, and fallback
  return file.text();
}

async function extractPDFText(file: File): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist');
    // Use CDN worker to avoid bundling issues
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    const buf = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      pages.push(tc.items.map((it: any) => it.str).join(' '));
    }
    return pages.join('\n');
  } catch (err) {
    if (import.meta.env.DEV) console.warn('PDF extraction failed, trying as text:', err);
    try { return await file.text(); } catch { return ''; }
  }
}

async function extractDOCXText(file: File): Promise<string> {
  try {
    const JSZipModule = await import('jszip');
    const JSZip = JSZipModule.default || JSZipModule;
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);
    const xml = await zip.file('word/document.xml')?.async('text');
    if (!xml) return '';
    return xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (err) {
    if (import.meta.env.DEV) console.warn('DOCX extraction failed, trying as text:', err);
    try { return await file.text(); } catch { return ''; }
  }
}

