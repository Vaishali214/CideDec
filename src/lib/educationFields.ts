/**
 * educationFields.ts
 * Complete Indian education field data — 80+ fields
 * Each entry: summary, modules (valid ModuleKey[]), kpis, charts, notif
 */

const C = {
  blue:'#3b82f6', violet:'#7c3aed', emerald:'#10b981', amber:'#f59e0b',
  rose:'#f43f5e', indigo:'#6366f1', sky:'#0ea5e9', green:'#22c55e',
  red:'#ef4444', gold:'#d97706', teal:'#14b8a6', pink:'#ec4899',
  orange:'#f97316', cyan:'#06b6d4', lime:'#84cc16', purple:'#a855f7',
};

type ModuleKey = 'market'|'financial'|'risk'|'strategy'|'comparison'|'forecast';
type NotifType = 'insight'|'alert'|'update'|'success';

interface KPI { label:string; value:string; change:string; up:boolean }
interface ChartSpec {
  type:'area'|'bar'|'line'|'pie'|'radar';
  title:string;
  data:Record<string,unknown>[];
  dataKeys:{key:string;color:string}[];
  xKey?:string;
}
export interface FieldTemplate {
  summary:string;
  modules:ModuleKey[];
  kpis:KPI[];
  charts:ChartSpec[];
  notif?:{title:string;body:string;type:NotifType};
}

export const educationFields: Record<string, FieldTemplate> = {

  /* ═══ PCM — ENGINEERING & TECHNOLOGY ═══ */

  btech_cse: {
    summary:'B.Tech CSE — India\'s most-applied engineering stream. Avg salary ₹6–45 LPA. Top recruiters: Google, Microsoft, TCS, Infosys. AI/ML driving +38% demand by 2030.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary (Entry)',value:'₹6–12 LPA',change:'Growing fast',up:true},
      {label:'Job Demand',value:'+38% by 2030',change:'AI/ML boom',up:true},
      {label:'Entrance Exam',value:'JEE Main/Adv',change:'Highly competitive',up:false},
      {label:'Duration',value:'4 Years',change:'B.Tech',up:true},
    ],
    charts:[
      {type:'bar',title:'CSE Salary by Role (₹LPA)',data:[{r:'Fresher',v:7},{r:'SDE-I',v:14},{r:'SDE-II',v:24},{r:'Senior SDE',v:38},{r:'Lead/Manager',v:58}],dataKeys:[{key:'v',color:C.blue}],xKey:'r'},
      {type:'area',title:'CSE Job Openings India (Thousands)',data:[{y:'2021',v:180},{y:'2022',v:220},{y:'2023',v:265},{y:'2024',v:310},{y:'2025',v:365},{y:'2026',v:430}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'},
    ],
    notif:{title:'B.Tech CSE Analysis Ready',body:'High demand · strong salary trajectory · best for tech careers.',type:'insight'},
  },

  btech_ai: {
    summary:'B.Tech AI & Data Science — fastest growing branch. Avg salary ₹8–50 LPA. 97,000+ open roles in 2025. Python, ML, Deep Learning are core skills.',
    modules:['market','forecast','strategy'],
    kpis:[
      {label:'Avg Salary',value:'₹8–25 LPA',change:'Entry–Mid',up:true},
      {label:'Job Openings 2025',value:'97,000+',change:'AI explosion',up:true},
      {label:'AI Demand Growth',value:'+68% by 2028',change:'Exponential',up:true},
      {label:'Duration',value:'4 Years',change:'B.Tech AI/DS',up:true},
    ],
    charts:[
      {type:'area',title:'AI/DS Job Postings India (Thousands)',data:[{y:'2021',v:28},{y:'2022',v:45},{y:'2023',v:68},{y:'2024',v:97},{y:'2025',v:140},{y:'2026',v:195}],dataKeys:[{key:'v',color:C.violet}],xKey:'y'},
      {type:'bar',title:'Avg Salary by AI Role (₹LPA)',data:[{r:'Data Analyst',v:7},{r:'Data Scientist',v:15},{r:'ML Engineer',v:20},{r:'AI Architect',v:32},{r:'Research Sci.',v:42}],dataKeys:[{key:'v',color:C.indigo}],xKey:'r'},
    ],
    notif:{title:'AI & Data Science Field Mapped',body:'India\'s #1 fastest-growing tech field in 2025.',type:'insight'},
  },

  btech_cyber: {
    summary:'B.Tech Cyber Security — India faces 3,000+ cyberattacks daily. Avg salary ₹5–40 LPA. Massive government & corporate demand.',
    modules:['market','risk','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹5–18 LPA',change:'Entry level',up:true},
      {label:'Cyber Attacks/Day',value:'3,000+ India',change:'Growing threat',up:false},
      {label:'Demand Growth',value:'+45% by 2027',change:'Critical sector',up:true},
      {label:'Top Certif.',value:'CEH, CISSP',change:'Industry standard',up:true},
    ],
    charts:[
      {type:'bar',title:'Cyber Security Salary (₹LPA)',data:[{r:'Analyst',v:6},{r:'Pen Tester',v:12},{r:'SOC Engineer',v:10},{r:'Security Arch.',v:22},{r:'CISO',v:45}],dataKeys:[{key:'v',color:C.rose}],xKey:'r'},
      {type:'area',title:'India Cybersecurity Market ($Bn)',data:[{y:'2022',v:3.5},{y:'2023',v:4.7},{y:'2024',v:6.1},{y:'2025',v:7.9},{y:'2026',v:10.2}],dataKeys:[{key:'v',color:C.red}],xKey:'y'},
    ],
    notif:{title:'Cyber Security Analysis Ready',body:'Critical shortage of 3M+ professionals worldwide.',type:'insight'},
  },

  btech_mech: {
    summary:'B.Tech Mechanical — Core sector + manufacturing revival. Avg salary ₹4–20 LPA. PSU roles via GATE. EV & robotics opening new paths.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary (Entry)',value:'₹4–8 LPA',change:'Stable',up:true},
      {label:'PSU via GATE',value:'₹8–14 LPA',change:'Govt sector',up:true},
      {label:'EV/Robotics',value:'+35% new roles',change:'Emerging',up:true},
      {label:'Duration',value:'4 Years',change:'B.Tech Mech',up:true},
    ],
    charts:[
      {type:'bar',title:'Mechanical Salary by Sector (₹LPA)',data:[{s:'Core Mfg',v:6},{s:'PSU/Govt',v:11},{s:'Automobile',v:9},{s:'EV/Robotics',v:14},{s:'Abroad',v:25}],dataKeys:[{key:'v',color:C.amber}],xKey:'s'},
      {type:'line',title:'India Manufacturing Sector Growth (%)',data:[{y:'2021',v:5.4},{y:'2022',v:7.1},{y:'2023',v:8.9},{y:'2024',v:10.2},{y:'2025',v:11.8},{y:'2026',v:13.5}],dataKeys:[{key:'v',color:C.orange}],xKey:'y'},
    ],
    notif:{title:'Mechanical Engineering Mapped',body:'EV revolution opening major new career paths.',type:'insight'},
  },

  btech_civil: {
    summary:'B.Tech Civil — India\'s ₹111 Lakh Cr National Infrastructure Pipeline 2025–30. Avg salary ₹5–20 LPA. PSU through GATE.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹5–12 LPA',change:'Entry level',up:true},
      {label:'PSU via GATE',value:'₹8–15 LPA',change:'Govt sector',up:true},
      {label:'NIP Investment',value:'₹111 Lakh Cr',change:'2025–30',up:true},
      {label:'Duration',value:'4 Years',change:'B.Tech Civil',up:true},
    ],
    charts:[
      {type:'bar',title:'Civil Salary by Sector (₹LPA)',data:[{s:'Govt/PSU',v:10},{s:'Infra Pvt',v:12},{s:'Real Estate',v:9},{s:'Consulting',v:15},{s:'Abroad',v:28}],dataKeys:[{key:'v',color:C.amber}],xKey:'s'},
      {type:'line',title:'India Infra Spend (₹ Lakh Cr)',data:[{y:'2022',v:7.5},{y:'2023',v:10},{y:'2024',v:11.1},{y:'2025',v:13},{y:'2026',v:15.5}],dataKeys:[{key:'v',color:C.teal}],xKey:'y'},
    ],
    notif:{title:'Civil Engineering Analysis Done',body:'NIP infra boom = sustained demand for 10+ years.',type:'insight'},
  },

  btech_electrical: {
    summary:'B.Tech Electrical — Power sector, smart grid, EV charging booming. Avg salary ₹5–22 LPA. Strong PSU options via GATE.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹5–10 LPA',change:'Entry level',up:true},
      {label:'Power Sector Growth',value:'+28% by 2027',change:'Renewable push',up:true},
      {label:'PSU (NTPC/NHPC)',value:'₹8–14 LPA',change:'Govt stability',up:true},
      {label:'Duration',value:'4 Years',change:'B.Tech EE',up:true},
    ],
    charts:[
      {type:'bar',title:'Electrical Salary by Path (₹LPA)',data:[{p:'PSU/Govt',v:10},{p:'Power Sector',v:9},{p:'EV Industry',v:13},{p:'Automation',v:12},{p:'Consulting',v:16}],dataKeys:[{key:'v',color:C.gold}],xKey:'p'},
      {type:'area',title:'India Renewable Energy Capacity (GW)',data:[{y:'2022',v:165},{y:'2023',v:190},{y:'2024',v:218},{y:'2025',v:255},{y:'2026',v:300}],dataKeys:[{key:'v',color:C.lime}],xKey:'y'},
    ],
    notif:{title:'Electrical Engineering Mapped',body:'Green energy transition = high demand for EE graduates.',type:'insight'},
  },

  btech_ece: {
    summary:'B.Tech ECE — VLSI, Embedded Systems & IoT booming. Avg salary ₹5–30 LPA. India semiconductor mission adding 50,000+ jobs.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary (Entry)',value:'₹5–10 LPA',change:'Growing',up:true},
      {label:'VLSI Demand',value:'+52% by 2028',change:'Chip boom',up:true},
      {label:'Semiconductor Jobs',value:'50,000+ new',change:'India mission',up:true},
      {label:'Duration',value:'4 Years',change:'B.Tech ECE',up:true},
    ],
    charts:[
      {type:'bar',title:'ECE Career Salary (₹LPA)',data:[{r:'Core ECE',v:7},{r:'VLSI Design',v:18},{r:'Embedded',v:12},{r:'IT/Software',v:15},{r:'PSU',v:10}],dataKeys:[{key:'v',color:C.violet}],xKey:'r'},
      {type:'line',title:'VLSI/Semiconductor Jobs India (K)',data:[{y:'2022',v:40},{y:'2023',v:58},{y:'2024',v:82},{y:'2025',v:110},{y:'2026',v:148}],dataKeys:[{key:'v',color:C.teal}],xKey:'y'},
    ],
    notif:{title:'ECE Analysis Done',body:'India Semiconductor Mission = massive ECE opportunity.',type:'insight'},
  },

  btech_aerospace: {
    summary:'B.Tech Aerospace — ISRO, HAL, defence, aviation sector growing. Avg salary ₹5–25 LPA. India space economy targeting $44Bn by 2033.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹5–15 LPA',change:'Entry level',up:true},
      {label:'ISRO/HAL/DRDO',value:'₹8–18 LPA',change:'Govt defence',up:true},
      {label:'Aviation Growth',value:'+40% by 2027',change:'India #3 market',up:true},
      {label:'Duration',value:'4 Years',change:'B.Tech Aero',up:true},
    ],
    charts:[
      {type:'bar',title:'Aerospace Salary by Sector (₹LPA)',data:[{s:'ISRO/DRDO',v:12},{s:'HAL/Defence',v:11},{s:'Aviation',v:10},{s:'Private Aero',v:14},{s:'Abroad',v:30}],dataKeys:[{key:'v',color:C.sky}],xKey:'s'},
      {type:'area',title:'India Aviation Passengers (Mn)',data:[{y:'2022',v:187},{y:'2023',v:245},{y:'2024',v:290},{y:'2025',v:340},{y:'2026',v:400}],dataKeys:[{key:'v',color:C.blue}],xKey:'y'},
    ],
    notif:{title:'Aerospace Engineering Mapped',body:'India\'s space economy targeting $44Bn by 2033.',type:'insight'},
  },

  integrated_btech_mtech: {
    summary:'Integrated B.Tech + M.Tech (5-year) — saves 1 year vs separate degrees. IIT avg packages ₹14–80 LPA. Opens research & senior roles faster.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Package (IIT)',value:'₹14–80 LPA',change:'Top institutes',up:true},
      {label:'Time Saving',value:'1 Year saved',change:'vs B+M separate',up:true},
      {label:'Research Roles',value:'Direct PhD entry',change:'Top advantage',up:true},
      {label:'Duration',value:'5 Years',change:'Integrated',up:true},
    ],
    charts:[
      {type:'bar',title:'IIT Integrated MTech Avg Package (₹LPA)',data:[{y:'2021',v:18},{y:'2022',v:24},{y:'2023',v:28},{y:'2024',v:32},{y:'2025',v:38}],dataKeys:[{key:'v',color:C.blue}],xKey:'y'},
      {type:'pie',title:'Career Paths After Integrated MTech',data:[{name:'Core Tech',value:42},{name:'Product/Mgmt',value:22},{name:'Research/PhD',value:18},{name:'Startups',value:12},{name:'PSU/Govt',value:6}],dataKeys:[{key:'value',color:C.violet}],xKey:'name'},
    ],
    notif:{title:'Integrated B.Tech+M.Tech Mapped',body:'Best ROI for research-oriented engineering students.',type:'insight'},
  },

  bca: {
    summary:'BCA (Bachelor of Computer Applications) — 3-year alternative to B.Tech for IT careers. Avg salary ₹4–15 LPA. MCA/MBA adds significant upside.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary (Entry)',value:'₹4–8 LPA',change:'Entry level',up:true},
      {label:'With MCA',value:'₹8–20 LPA',change:'+3 yrs',up:true},
      {label:'Fee vs B.Tech',value:'40% lower',change:'Cost advantage',up:true},
      {label:'Duration',value:'3 Years',change:'BCA',up:true},
    ],
    charts:[
      {type:'bar',title:'BCA vs B.Tech Salary (₹LPA)',data:[{exp:'Fresher',bca:4.5,btech:7},{exp:'2 Years',bca:7,btech:12},{exp:'5 Years',bca:12,btech:20},{exp:'8 Years',bca:18,btech:30}],dataKeys:[{key:'bca',color:C.sky},{key:'btech',color:C.blue}],xKey:'exp'},
      {type:'area',title:'IT Industry Jobs India (Mn)',data:[{y:'2021',v:4.5},{y:'2022',v:5.1},{y:'2023',v:5.8},{y:'2024',v:6.6},{y:'2025',v:7.5},{y:'2026',v:8.5}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'},
    ],
    notif:{title:'BCA Career Analysis Done',body:'Great IT entry without JEE. MCA multiplies salary significantly.',type:'insight'},
  },

  bsc_cs: {
    summary:'B.Sc. Computer Science — Academic IT route. Avg salary ₹3–12 LPA. M.Sc./MCA adds major upside. Good for research + software roles.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'With M.Sc./MCA',value:'₹8–18 LPA',change:'+2 yrs',up:true},
      {label:'Research Option',value:'Strong',change:'PhD pathway',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. CS',up:true},
    ],
    charts:[
      {type:'bar',title:'B.Sc. CS Salary by Role (₹LPA)',data:[{r:'Jr Developer',v:4},{r:'Data Analyst',v:6},{r:'QA Engineer',v:5},{r:'IT Support',v:3.5},{r:'Sys Admin',v:5.5}],dataKeys:[{key:'v',color:C.cyan}],xKey:'r'},
      {type:'line',title:'IT Sector Hiring Growth (%)',data:[{y:'2021',v:8},{y:'2022',v:14},{y:'2023',v:18},{y:'2024',v:22},{y:'2025',v:26}],dataKeys:[{key:'v',color:C.blue}],xKey:'y'},
    ],
    notif:{title:'B.Sc. CS Mapped',body:'Good foundation for IT — pair with MCA for best results.',type:'insight'},
  },

  bsc_it: {
    summary:'B.Sc. Information Technology — Industry-focused IT degree. Avg salary ₹3–10 LPA. Networking, cloud, IT support roles readily available.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'Cloud/Networking',value:'₹8–18 LPA',change:'Certification+',up:true},
      {label:'IT Jobs India',value:'7.5 Mn+',change:'2025 estimate',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. IT',up:true},
    ],
    charts:[
      {type:'bar',title:'B.Sc. IT Salary by Specialisation (₹LPA)',data:[{s:'IT Support',v:3.5},{s:'Network Admin',v:6},{s:'Cloud Engineer',v:12},{s:'DevOps',v:14},{s:'Database Admin',v:8}],dataKeys:[{key:'v',color:C.sky}],xKey:'s'},
      {type:'area',title:'Cloud Computing Jobs India (K)',data:[{y:'2022',v:45},{y:'2023',v:68},{y:'2024',v:98},{y:'2025',v:135},{y:'2026',v:180}],dataKeys:[{key:'v',color:C.blue}],xKey:'y'},
    ],
    notif:{title:'B.Sc. IT Mapped',body:'Cloud + DevOps certifications triple B.Sc. IT salary.',type:'insight'},
  },

  /* ═══ ARCHITECTURE & DESIGN ═══ */

  barch: {
    summary:'B.Arch — 5-year programme via NATA. Smart city mission + real estate boom driving demand. Avg salary ₹4–25 LPA.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Duration',value:'5 Years',change:'B.Arch',up:true},
      {label:'Entrance',value:'NATA / JEE Paper 2',change:'Moderate difficulty',up:true},
      {label:'Avg Salary',value:'₹4–15 LPA',change:'5–8 yrs exp',up:true},
      {label:'Own Studio',value:'₹20–80L/yr',change:'Senior Arch.',up:true},
    ],
    charts:[
      {type:'bar',title:'Architecture Salary by Role (₹LPA)',data:[{r:'Junior',v:4},{r:'Mid-Level',v:9},{r:'Senior',v:16},{r:'Principal',v:25},{r:'Own Studio',v:45}],dataKeys:[{key:'v',color:C.rose}],xKey:'r'},
      {type:'line',title:'Real Estate Projects India (K)',data:[{y:'2021',v:80},{y:'2022',v:98},{y:'2023',v:118},{y:'2024',v:140},{y:'2025',v:165}],dataKeys:[{key:'v',color:C.amber}],xKey:'y'},
    ],
    notif:{title:'B.Arch Analysis Done',body:'Smart city mission driving sustained architectural demand.',type:'insight'},
  },

  bplan: {
    summary:'B.Plan (Urban Planning) — Smart cities, RERA, govt urban development. Avg salary ₹5–18 LPA. JEE Paper 2 entrance.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹5–12 LPA',change:'Entry level',up:true},
      {label:'Smart City Jobs',value:'100+ cities',change:'Govt mission',up:true},
      {label:'RERA Growth',value:'+22% real estate',change:'Regulatory boom',up:true},
      {label:'Duration',value:'4 Years',change:'B.Plan',up:true},
    ],
    charts:[
      {type:'bar',title:'Urban Planning Salary (₹LPA)',data:[{s:'Govt/ULB',v:8},{s:'Smart City',v:11},{s:'Pvt Consultancy',v:13},{s:'Real Estate',v:10},{s:'NGO/Research',v:7}],dataKeys:[{key:'v',color:C.teal}],xKey:'s'},
      {type:'area',title:'India Smart City Investment (₹ Cr)',data:[{y:'2020',v:6400},{y:'2021',v:9800},{y:'2022',v:15000},{y:'2023',v:22000},{y:'2024',v:30000}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'B.Plan Field Analysis Done',body:'Urban planning critical for India\'s 100 Smart Cities mission.',type:'insight'},
  },

  bdes: {
    summary:'B.Des (Bachelor of Design) — UI/UX, product, fashion, graphic. NID/UCEED/NIFT entrance. Avg salary ₹4–25 LPA. Design thinking demand exploding.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'UI/UX Salary',value:'₹6–25 LPA',change:'High demand',up:true},
      {label:'Product Design',value:'₹8–30 LPA',change:'Startup boom',up:true},
      {label:'Entrance',value:'NID/UCEED/NIFT',change:'Competitive',up:false},
      {label:'Duration',value:'4 Years',change:'B.Des',up:true},
    ],
    charts:[
      {type:'bar',title:'Design Career Salary (₹LPA)',data:[{s:'UI/UX Design',v:12},{s:'Product Design',v:14},{s:'Graphic Design',v:7},{s:'Fashion Design',v:8},{s:'Game Design',v:11}],dataKeys:[{key:'v',color:C.pink}],xKey:'s'},
      {type:'area',title:'India Design Industry ($Bn)',data:[{y:'2021',v:5.2},{y:'2022',v:6.8},{y:'2023',v:8.5},{y:'2024',v:10.8},{y:'2025',v:13.5}],dataKeys:[{key:'v',color:C.purple}],xKey:'y'},
    ],
    notif:{title:'B.Des Field Mapped',body:'UI/UX is India\'s highest-paying design specialisation in 2025.',type:'insight'},
  },

  /* ═══ DEFENCE ═══ */

  nda: {
    summary:'NDA (National Defence Academy) — Join Army/Navy/Air Force after Class 12. Salary ₹56K–2.5L+/mo. Pension, perks, prestige. UPSC exam 2×/year.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Starting Salary',value:'₹56,100/mo',change:'Lt. rank',up:true},
      {label:'Selection Rate',value:'~0.06%',change:'Extremely tough',up:false},
      {label:'Pension + Perks',value:'Lifetime',change:'Govt benefits',up:true},
      {label:'Exam',value:'UPSC NDA',change:'Written + SSB',up:true},
    ],
    charts:[
      {type:'bar',title:'Indian Army Officer Salary by Rank (₹K/mo)',data:[{r:'Lieutenant',v:56},{r:'Captain',v:70},{r:'Major',v:90},{r:'Lt. Colonel',v:120},{r:'Colonel',v:150}],dataKeys:[{key:'v',color:C.green}],xKey:'r'},
      {type:'pie',title:'NDA Selections by Service',data:[{name:'Army',value:208},{name:'Navy',value:42},{name:'Air Force',value:120}],dataKeys:[{key:'value',color:C.blue}],xKey:'name'},
    ],
    notif:{title:'NDA Career Path Mapped',body:'One of India\'s most respected and secure careers.',type:'insight'},
  },

  /* ═══ AVIATION ═══ */

  commercial_pilot: {
    summary:'Commercial Pilot — India\'s aviation is world\'s 3rd largest market. Pilot salary ₹1.5–8L/mo. High investment (₹35–75L) but excellent long-term ROI.',
    modules:['market','financial','forecast'],
    kpis:[
      {label:'Pilot Salary',value:'₹1.5–8L/mo',change:'After 2–3 yrs',up:true},
      {label:'Training Cost',value:'₹35–75 Lakh',change:'High investment',up:false},
      {label:'India Pilot Deficit',value:'8,000+ by 2030',change:'Strong demand',up:true},
      {label:'Licence',value:'CPL (DGCA)',change:'India standard',up:true},
    ],
    charts:[
      {type:'bar',title:'Pilot Salary by Experience (₹L/mo)',data:[{e:'First Officer',v:1.8},{e:'3 Yrs FO',v:2.5},{e:'Domestic Capt.',v:4.5},{e:'Intl Capt.',v:7.5}],dataKeys:[{key:'v',color:C.sky}],xKey:'e'},
      {type:'area',title:'India Aviation Passengers (Mn)',data:[{y:'2022',v:187},{y:'2023',v:245},{y:'2024',v:290},{y:'2025',v:340},{y:'2026',v:400}],dataKeys:[{key:'v',color:C.blue}],xKey:'y'},
    ],
    notif:{title:'Commercial Pilot Analysis Done',body:'India needs 8,000+ pilots by 2030 — major opportunity.',type:'insight'},
  },

  ame: {
    summary:'Aircraft Maintenance Engineering (AME) — DGCA licence. Avg salary ₹5–18 LPA. Growing with India\'s aviation fleet doubling by 2030.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹5–12 LPA',change:'Entry level',up:true},
      {label:'Senior AME',value:'₹15–25 LPA',change:'10+ yrs exp',up:true},
      {label:'Regulator',value:'DGCA India',change:'Licenced profession',up:true},
      {label:'Duration',value:'3 Years + Licence',change:'AME programme',up:true},
    ],
    charts:[
      {type:'bar',title:'AME Salary by Role (₹LPA)',data:[{r:'Jr AME',v:5},{r:'AME',v:10},{r:'Sr AME',v:17},{r:'QC Inspector',v:14},{r:'MRO Manager',v:22}],dataKeys:[{key:'v',color:C.cyan}],xKey:'r'},
      {type:'line',title:'India Aircraft Fleet Size',data:[{y:'2022',v:680},{y:'2023',v:760},{y:'2024',v:820},{y:'2025',v:920},{y:'2026',v:1060}],dataKeys:[{key:'v',color:C.sky}],xKey:'y'},
    ],
    notif:{title:'AME Career Mapped',body:'India\'s fleet doubling by 2030 = strong AME demand.',type:'insight'},
  },

  bsc_aviation: {
    summary:'B.Sc. Aviation — Ground crew, aviation management, air traffic. Avg salary ₹4–15 LPA. Pathway to pilot or aviation management.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'Air Traffic Control',value:'₹8–18 LPA',change:'AAI recruitment',up:true},
      {label:'Aviation Growth',value:'+40% by 2027',change:'Fleet expansion',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. Aviation',up:true},
    ],
    charts:[
      {type:'bar',title:'Aviation Career Salary (₹LPA)',data:[{r:'Ground Staff',v:4},{r:'Air Traffic Ctrl',v:12},{r:'Airport Ops',v:8},{r:'Airline Mgmt',v:14},{r:'Aviation Safety',v:11}],dataKeys:[{key:'v',color:C.blue}],xKey:'r'},
      {type:'area',title:'India Airport Passenger Traffic (Mn)',data:[{y:'2022',v:188},{y:'2023',v:248},{y:'2024',v:295},{y:'2025',v:350},{y:'2026',v:410}],dataKeys:[{key:'v',color:C.sky}],xKey:'y'},
    ],
    notif:{title:'B.Sc. Aviation Mapped',body:'India adding 100+ new airports by 2030 — strong demand.',type:'insight'},
  },

  /* ═══ PURE SCIENCES ═══ */

  bsc_physics: {
    summary:'B.Sc. Physics — Research, ISRO, defence, academia. Avg salary ₹3–12 LPA (UG). M.Sc.+PhD unlocks ₹15–50 LPA research roles.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Avg Salary (UG)',value:'₹3–6 LPA',change:'Entry level',up:true},
      {label:'With M.Sc./PhD',value:'₹12–35 LPA',change:'Research track',up:true},
      {label:'ISRO/DRDO',value:'₹8–20 LPA',change:'Govt research',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. Physics',up:true},
    ],
    charts:[
      {type:'bar',title:'Physics Career Salary (₹LPA)',data:[{c:'Teaching',v:4},{c:'Research Asst.',v:6},{c:'ISRO/DRDO',v:12},{c:'Data Science',v:14},{c:'PhD+PostDoc',v:20}],dataKeys:[{key:'v',color:C.indigo}],xKey:'c'},
      {type:'pie',title:'Physics Graduates Career Paths',data:[{name:'Higher Studies',value:45},{name:'Teaching',value:25},{name:'Research/Govt',value:18},{name:'Tech Industry',value:12}],dataKeys:[{key:'value',color:C.violet}],xKey:'name'},
    ],
    notif:{title:'B.Sc. Physics Mapped',body:'M.Sc.+PhD opens ISRO and global research paths.',type:'insight'},
  },

  bsc_maths: {
    summary:'B.Sc. Mathematics — Actuary, data science, finance, teaching. Avg salary ₹4–20 LPA. Actuarial Fellow earns ₹25–80 LPA.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'Actuary (Fellow)',value:'₹25–80 LPA',change:'10+ yrs',up:true},
      {label:'Data Science Pivot',value:'₹12–30 LPA',change:'With ML skills',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. Maths',up:true},
    ],
    charts:[
      {type:'bar',title:'Maths Career Salary by Path (₹LPA)',data:[{p:'Teaching',v:4},{p:'Actuary',v:18},{p:'Data Scientist',v:15},{p:'Finance Analyst',v:12},{p:'Statistician',v:10}],dataKeys:[{key:'v',color:C.emerald}],xKey:'p'},
      {type:'area',title:'Actuarial Science Jobs in India',data:[{y:'2020',v:1200},{y:'2021',v:1500},{y:'2022',v:1900},{y:'2023',v:2400},{y:'2024',v:3000}],dataKeys:[{key:'v',color:C.teal}],xKey:'y'},
    ],
    notif:{title:'B.Sc. Maths Mapped',body:'Actuarial science = India\'s highest-paying pure science path.',type:'insight'},
  },

  bsc_chemistry: {
    summary:'B.Sc. Chemistry — Pharma, chemical industry, research, forensics. Avg salary ₹3–10 LPA (UG). M.Sc.+PhD opens global roles ₹15–40 LPA.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary (UG)',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'With M.Sc.',value:'₹8–20 LPA',change:'Pharma R&D',up:true},
      {label:'Pharma Market',value:'$65Bn India',change:'World #3',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. Chemistry',up:true},
    ],
    charts:[
      {type:'bar',title:'Chemistry Career Salary (₹LPA)',data:[{r:'QC Chemist',v:5},{r:'R&D Chemist',v:8},{r:'Pharma R&D',v:11},{r:'Forensic',v:7},{r:'Teaching',v:4}],dataKeys:[{key:'v',color:C.violet}],xKey:'r'},
      {type:'pie',title:'Chemistry Graduates Employment',data:[{name:'Pharma/Chemical',value:45},{name:'Research',value:22},{name:'Teaching',value:18},{name:'Forensics/Govt',value:15}],dataKeys:[{key:'value',color:C.indigo}],xKey:'name'},
    ],
    notif:{title:'B.Sc. Chemistry Mapped',body:'Pharma R&D is the highest-growth path for chemistry grads.',type:'insight'},
  },

  bsc_statistics: {
    summary:'B.Sc. Statistics — Data analytics, actuarial, banking, research. Avg salary ₹4–18 LPA. Highly versatile with great corporate demand.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'Data Analytics',value:'₹10–28 LPA',change:'With R/Python',up:true},
      {label:'Actuary Path',value:'₹25–60 LPA',change:'Fellowship',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. Stats',up:true},
    ],
    charts:[
      {type:'bar',title:'Statistics Career Salary (₹LPA)',data:[{r:'Statistician',v:8},{r:'Data Analyst',v:10},{r:'Actuary',v:20},{r:'Quant Analyst',v:18},{r:'Research',v:9}],dataKeys:[{key:'v',color:C.teal}],xKey:'r'},
      {type:'area',title:'Analytics Jobs India (K)',data:[{y:'2022',v:38},{y:'2023',v:58},{y:'2024',v:82},{y:'2025',v:115},{y:'2026',v:155}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'B.Sc. Statistics Mapped',body:'Analytics + actuarial science = top-paying statistics paths.',type:'insight'},
  },

  bsc_data_science: {
    summary:'B.Sc. Data Science — Direct route to analytics & AI. Avg salary ₹5–18 LPA. India\'s fastest-growing undergraduate programme.',
    modules:['market','forecast','strategy'],
    kpis:[
      {label:'Avg Salary',value:'₹5–12 LPA',change:'Entry level',up:true},
      {label:'With Experience',value:'₹18–40 LPA',change:'3–5 yrs',up:true},
      {label:'Job Growth',value:'+45% by 2027',change:'Analytics boom',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. DS',up:true},
    ],
    charts:[
      {type:'bar',title:'Data Science Roles Salary (₹LPA)',data:[{r:'Analyst',v:6},{r:'Scientist',v:14},{r:'ML Engineer',v:18},{r:'BI Developer',v:10},{r:'AI Researcher',v:28}],dataKeys:[{key:'v',color:C.violet}],xKey:'r'},
      {type:'area',title:'Analytics Job Market India (K)',data:[{y:'2022',v:45},{y:'2023',v:68},{y:'2024',v:97},{y:'2025',v:138},{y:'2026',v:190}],dataKeys:[{key:'v',color:C.indigo}],xKey:'y'},
    ],
    notif:{title:'B.Sc. Data Science Mapped',body:'Direct path to India\'s highest-growth job sector.',type:'insight'},
  },

  /* ═══ MEDICAL & HEALTHCARE ═══ */

  mbbs: {
    summary:'MBBS — 5.5 year programme via NEET-UG. Govt doctor ₹60K–1.5L/mo. Specialisation opens ₹2–20L/mo. India needs 600K+ more doctors by 2030.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Duration',value:'5.5 Years',change:'+Internship',up:true},
      {label:'Entrance',value:'NEET-UG',change:'Highly competitive',up:false},
      {label:'Govt Salary',value:'₹60K–1.5L/mo',change:'Stable & secure',up:true},
      {label:'Specialist Salary',value:'₹2–20L/mo',change:'Post MD/MS',up:true},
    ],
    charts:[
      {type:'bar',title:'Doctor Salary by Specialisation (₹L/yr)',data:[{s:'General',v:8},{s:'Pediatrician',v:14},{s:'Surgeon',v:20},{s:'Cardiologist',v:35},{s:'Neuro',v:50}],dataKeys:[{key:'v',color:C.emerald}],xKey:'s'},
      {type:'area',title:'India Doctor Deficit (Thousands)',data:[{y:'2023',v:600},{y:'2025',v:720},{y:'2027',v:860},{y:'2029',v:1020},{y:'2031',v:1200}],dataKeys:[{key:'v',color:C.rose}],xKey:'y'},
    ],
    notif:{title:'MBBS Analysis Ready',body:'India needs 600K+ more doctors — massive long-term demand.',type:'insight'},
  },

  bds: {
    summary:'BDS (Bachelor of Dental Surgery) — 5 yr via NEET. Dentist salary ₹4–25 LPA. Own clinic ₹30–80L/yr. Dental tourism booming.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Duration',value:'5 Years',change:'+Internship',up:true},
      {label:'Entrance',value:'NEET-UG',change:'Moderate competition',up:true},
      {label:'Avg Salary',value:'₹4–12 LPA',change:'Employed',up:true},
      {label:'Own Clinic',value:'₹30–80L/yr',change:'10+ yrs',up:true},
    ],
    charts:[
      {type:'bar',title:'Dentist Salary by Path (₹LPA)',data:[{p:'Govt Hospital',v:7},{p:'Private Clinic',v:10},{p:'Own Clinic',v:25},{p:'MDS Specialist',v:18},{p:'Dental Tourism',v:22}],dataKeys:[{key:'v',color:C.blue}],xKey:'p'},
      {type:'area',title:'India Dental Market Size ($Bn)',data:[{y:'2021',v:5.2},{y:'2022',v:6.1},{y:'2023',v:7.3},{y:'2024',v:8.8},{y:'2025',v:10.5}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'BDS Career Mapped',body:'Dental tourism & cosmetic dentistry = high-growth niche.',type:'insight'},
  },

  bams: {
    summary:'BAMS (Ayurveda) — 5.5 yr via NEET. Post-COVID Ayurveda boom. AYUSH Govt jobs. Avg salary ₹3–12 LPA. Wellness industry growing 20%/yr.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Duration',value:'5.5 Years',change:'BAMS',up:true},
      {label:'Entrance',value:'NEET-UG',change:'Lower cutoff than MBBS',up:true},
      {label:'AYUSH Salary',value:'₹3–8 LPA',change:'Govt sector',up:true},
      {label:'Wellness Market',value:'$18Bn India',change:'Growing 20%/yr',up:true},
    ],
    charts:[
      {type:'bar',title:'BAMS Career Salary (₹LPA)',data:[{p:'AYUSH Govt',v:5},{p:'Private Hospital',v:7},{p:'Own Clinic',v:14},{p:'Wellness/Spa',v:8},{p:'Pharma',v:9}],dataKeys:[{key:'v',color:C.green}],xKey:'p'},
      {type:'area',title:'India Ayurveda Market ($Bn)',data:[{y:'2020',v:4.5},{y:'2021',v:6.2},{y:'2022',v:8.1},{y:'2023',v:10.8},{y:'2025',v:16}],dataKeys:[{key:'v',color:C.lime}],xKey:'y'},
    ],
    notif:{title:'BAMS Field Mapped',body:'Ayurveda market grew 40% post-COVID — strong tailwind.',type:'insight'},
  },

  bhms: {
    summary:'BHMS (Homeopathy) — 5.5 yr via NEET. Avg salary ₹3–10 LPA India. Europe/US growing demand for homeopathy practitioners.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Duration',value:'5.5 Years',change:'BHMS',up:true},
      {label:'Entrance',value:'NEET-UG',change:'Lower cutoff',up:true},
      {label:'Govt Salary',value:'₹3–6 LPA',change:'AYUSH',up:true},
      {label:'Global Practice',value:'High demand',change:'Europe/US',up:true},
    ],
    charts:[
      {type:'bar',title:'BHMS Salary by Path (₹LPA)',data:[{p:'Govt Dispenser',v:4},{p:'Private Clinic',v:7},{p:'Own Practice',v:12},{p:'Pharma Rep',v:6},{p:'Abroad',v:20}],dataKeys:[{key:'v',color:C.green}],xKey:'p'},
      {type:'pie',title:'Homeopathy Revenue by Region',data:[{name:'India',value:55},{name:'Europe',value:22},{name:'Americas',value:15},{name:'Others',value:8}],dataKeys:[{key:'value',color:C.teal}],xKey:'name'},
    ],
    notif:{title:'BHMS Career Mapped',body:'Europe & US growing demand for homeopathy practitioners.',type:'insight'},
  },

  bums: {
    summary:'BUMS (Unani Medicine) — 5.5 yr via NEET. AYUSH Govt sector employer. Avg salary ₹3–8 LPA. Growing wellness & herbal medicine trend.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Duration',value:'5.5 Years',change:'BUMS',up:true},
      {label:'Entrance',value:'NEET-UG',change:'AYUSH stream',up:true},
      {label:'Avg Salary',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'AYUSH Jobs',value:'30,000+/yr',change:'Govt hiring',up:true},
    ],
    charts:[
      {type:'bar',title:'BUMS Career Salary (₹LPA)',data:[{p:'AYUSH Govt',v:5},{p:'Private Clinic',v:6},{p:'Own Practice',v:11},{p:'Research',v:7},{p:'Pharma',v:8}],dataKeys:[{key:'v',color:C.lime}],xKey:'p'},
      {type:'area',title:'AYUSH Market Size India ($Bn)',data:[{y:'2020',v:18},{y:'2021',v:22},{y:'2022',v:26},{y:'2023',v:32},{y:'2025',v:42}],dataKeys:[{key:'v',color:C.green}],xKey:'y'},
    ],
    notif:{title:'BUMS Mapped',body:'AYUSH expansion means growing govt job opportunities.',type:'insight'},
  },

  bpt: {
    summary:'BPT (Physiotherapy) — 4.5 yr. Sports rehab, geriatrics, neuro-rehab booming. Avg salary ₹3–15 LPA. Own clinic potential.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Duration',value:'4.5 Years',change:'BPT',up:true},
      {label:'Avg Salary',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'Sports Rehab',value:'₹10–20 LPA',change:'Top path',up:true},
      {label:'Sports Industry',value:'+35% by 2027',change:'India growth',up:true},
    ],
    charts:[
      {type:'bar',title:'BPT Salary by Specialisation (₹LPA)',data:[{s:'General',v:4},{s:'Sports Rehab',v:14},{s:'Neuro-Rehab',v:10},{s:'Paediatric',v:8},{s:'Own Clinic',v:18}],dataKeys:[{key:'v',color:C.emerald}],xKey:'s'},
      {type:'line',title:'India Sports Medicine Market ($Mn)',data:[{y:'2021',v:420},{y:'2022',v:520},{y:'2023',v:650},{y:'2024',v:810},{y:'2025',v:1010}],dataKeys:[{key:'v',color:C.teal}],xKey:'y'},
    ],
    notif:{title:'BPT Field Mapped',body:'Sports rehabilitation = fastest growing physiotherapy niche.',type:'insight'},
  },

  bsc_nursing: {
    summary:'B.Sc. Nursing — 4 yr. India has 2.4 million nurse deficit. Avg India salary ₹3–8 LPA; UK/Canada/Gulf pay ₹20–50 LPA.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'India Salary',value:'₹3–8 LPA',change:'Domestic',up:true},
      {label:'Abroad Salary',value:'₹20–50 LPA',change:'UK/Canada/Gulf',up:true},
      {label:'Nurse Deficit',value:'2.4 Mn India',change:'Critical shortage',up:false},
      {label:'Duration',value:'4 Years',change:'B.Sc. Nursing',up:true},
    ],
    charts:[
      {type:'bar',title:'Nurse Salary India vs Abroad (₹LPA)',data:[{c:'India (Pvt)',v:5},{c:'India (Govt)',v:7},{c:'Gulf',v:18},{c:'UK',v:38},{c:'Canada/Aus',v:45}],dataKeys:[{key:'v',color:C.rose}],xKey:'c'},
      {type:'area',title:'Global Nurse Demand (Millions)',data:[{y:'2022',v:28},{y:'2023',v:31},{y:'2024',v:35},{y:'2025',v:39},{y:'2026',v:44}],dataKeys:[{key:'v',color:C.pink}],xKey:'y'},
    ],
    notif:{title:'Nursing Career Mapped',body:'UK, Canada, Australia actively recruiting Indian nurses.',type:'insight'},
  },

  bpharm: {
    summary:'B.Pharm / Pharm.D — India is world\'s 3rd largest pharma market ($65Bn). Avg salary ₹4–18 LPA. R&D and regulatory are top paths.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'Pharma Market',value:'$65Bn by 2025',change:'India rank #3',up:true},
      {label:'Export Value',value:'$25Bn+',change:'Generic king',up:true},
      {label:'Duration',value:'4 Yrs (B.Pharm)',change:'6 Yrs (Pharm.D)',up:true},
    ],
    charts:[
      {type:'bar',title:'Pharmacy Career Salary (₹LPA)',data:[{r:'QC/QA',v:5},{r:'Medical Rep',v:6},{r:'R&D',v:9},{r:'Regulatory',v:11},{r:'Clinical Trials',v:14}],dataKeys:[{key:'v',color:C.green}],xKey:'r'},
      {type:'area',title:'India Pharma Market ($Bn)',data:[{y:'2020',v:41},{y:'2022',v:50},{y:'2023',v:57},{y:'2025',v:65},{y:'2027',v:80}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'},
    ],
    notif:{title:'Pharmacy Mapped',body:'India pharma exports world-leading — high R&D demand.',type:'insight'},
  },

  bot: {
    summary:'BOT (Occupational Therapy) — 4.5 yr. Elderly care, mental health rehab booming. Avg India ₹3–10 LPA; abroad ₹15–35 LPA.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary India',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'Abroad Salary',value:'₹15–35 LPA',change:'US/UK/Canada',up:true},
      {label:'Elderly Care',value:'+40% by 2030',change:'Ageing population',up:true},
      {label:'Duration',value:'4.5 Years',change:'BOT',up:true},
    ],
    charts:[
      {type:'bar',title:'OT Salary by Setting (₹LPA)',data:[{s:'Govt Hospital',v:5},{s:'Private',v:7},{s:'Rehab Centre',v:8},{s:'School OT',v:6},{s:'Abroad',v:25}],dataKeys:[{key:'v',color:C.sky}],xKey:'s'},
      {type:'line',title:'India Geriatric Care Market ($Bn)',data:[{y:'2022',v:3.2},{y:'2023',v:4.1},{y:'2024',v:5.2},{y:'2025',v:6.5},{y:'2026',v:8.1}],dataKeys:[{key:'v',color:C.blue}],xKey:'y'},
    ],
    notif:{title:'BOT Career Mapped',body:'India\'s ageing population driving OT demand strongly.',type:'insight'},
  },

  bmlt: {
    summary:'BMLT (Medical Lab Technology) — 3 yr. Diagnostics chains, hospitals, R&D. Avg salary ₹3–10 LPA. Stable demand from growing diagnostics market.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'Diagnostics Market',value:'$10Bn India',change:'Growing 15%/yr',up:true},
      {label:'Top Employers',value:'Apollo/Lal Path',change:'Thyrocare etc.',up:true},
      {label:'Duration',value:'3 Years',change:'BMLT',up:true},
    ],
    charts:[
      {type:'bar',title:'Lab Tech Salary by Role (₹LPA)',data:[{r:'Jr Lab Tech',v:3.5},{r:'Lab Technician',v:5},{r:'Sr Technician',v:7},{r:'Lab Manager',v:10},{r:'QA/QC',v:8}],dataKeys:[{key:'v',color:C.teal}],xKey:'r'},
      {type:'area',title:'India Diagnostics Market ($Bn)',data:[{y:'2021',v:6},{y:'2022',v:7.2},{y:'2023',v:8.5},{y:'2024',v:10},{y:'2025',v:11.8}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'},
    ],
    notif:{title:'BMLT Career Mapped',body:'Diagnostics industry growing 15%/yr — steady employment.',type:'insight'},
  },

  bsc_radiology: {
    summary:'B.Sc. Radiology & Imaging — 3 yr. CT/MRI/X-ray demand rising with hospital expansion. Avg salary ₹3–12 LPA. Abroad options strong.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'Advanced Imaging',value:'₹10–18 LPA',change:'CT/MRI expert',up:true},
      {label:'Market Growth',value:'+18% by 2027',change:'Tech upgrade',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. Radiology',up:true},
    ],
    charts:[
      {type:'bar',title:'Radiology Salary by Modality (₹LPA)',data:[{m:'X-Ray Tech',v:4},{m:'Ultrasound',v:6},{m:'CT Tech',v:9},{m:'MRI Tech',v:11},{m:'Cath Lab',v:13}],dataKeys:[{key:'v',color:C.blue}],xKey:'m'},
      {type:'line',title:'India Medical Imaging Market ($Mn)',data:[{y:'2021',v:1800},{y:'2022',v:2200},{y:'2023',v:2700},{y:'2024',v:3300},{y:'2025',v:4000}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'Radiology Career Mapped',body:'AI-assisted imaging increasing trained radiographer demand.',type:'insight'},
  },

  bsc_biotech: {
    summary:'B.Sc. Biotechnology — R&D, pharma, agri-biotech, bioinformatics. Avg ₹3–15 LPA. India targeting top 5 global biotech hubs by 2030.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary (UG)',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'With M.Sc./PhD',value:'₹12–35 LPA',change:'Research track',up:true},
      {label:'Biotech Market',value:'$137Bn India 2030',change:'Govt push',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. Biotech',up:true},
    ],
    charts:[
      {type:'bar',title:'Biotech Career Salary (₹LPA)',data:[{r:'Research Asst.',v:4},{r:'Bioinformatics',v:9},{r:'Pharma R&D',v:11},{r:'QA/QC',v:7},{r:'PhD+PostDoc',v:18}],dataKeys:[{key:'v',color:C.green}],xKey:'r'},
      {type:'area',title:'India Biotech Market ($Bn)',data:[{y:'2022',v:65},{y:'2023',v:76},{y:'2024',v:88},{y:'2025',v:102},{y:'2026',v:120}],dataKeys:[{key:'v',color:C.lime}],xKey:'y'},
    ],
    notif:{title:'Biotechnology Field Mapped',body:'India targeting top 5 global biotech hubs by 2030.',type:'insight'},
  },

  bsc_microbiology: {
    summary:'B.Sc. Microbiology — Pharma, food safety, diagnostics, research. Avg salary ₹3–10 LPA. Strong path with M.Sc.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'With M.Sc.',value:'₹8–18 LPA',change:'+2 yrs',up:true},
      {label:'Food Safety Jobs',value:'+25% by 2026',change:'FSSAI demand',up:true},
      {label:'Duration',value:'3 Years',change:'B.Sc. Micro',up:true},
    ],
    charts:[
      {type:'bar',title:'Microbiology Career Salary (₹LPA)',data:[{c:'Lab Tech',v:4},{c:'QC Micro',v:6},{c:'Research',v:7},{c:'Food Safety',v:8},{c:'Clinical Micro',v:9}],dataKeys:[{key:'v',color:C.emerald}],xKey:'c'},
      {type:'pie',title:'Microbiology Industry Employment',data:[{name:'Pharma',value:35},{name:'Food & Beverage',value:25},{name:'Diagnostics',value:20},{name:'Research',value:20}],dataKeys:[{key:'value',color:C.teal}],xKey:'name'},
    ],
    notif:{title:'B.Sc. Microbiology Mapped',body:'Pharma and food safety are highest-paying sectors.',type:'insight'},
  },

  /* ═══ VETERINARY & AGRICULTURE ═══ */

  bvsc: {
    summary:'BVSc & AH (Veterinary) — 5.5 yr via NEET. Govt vet ₹6–15 LPA. Livestock economy ₹10 Lakh Cr. Pet care growing 20%/yr.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Duration',value:'5.5 Years',change:'BVSc',up:true},
      {label:'Govt Vet Salary',value:'₹6–15 LPA',change:'State Govt',up:true},
      {label:'Livestock Economy',value:'₹10 Lakh Cr',change:'India value',up:true},
      {label:'Pet Care Market',value:'₹5,000 Cr+',change:'Growing 20%/yr',up:true},
    ],
    charts:[
      {type:'bar',title:'Vet Salary by Path (₹LPA)',data:[{p:'Govt Vet Officer',v:10},{p:'Private Clinic',v:8},{p:'Research/ICAR',v:12},{p:'Pet Clinic',v:15},{p:'Pharma',v:10}],dataKeys:[{key:'v',color:C.amber}],xKey:'p'},
      {type:'area',title:'India Pet Care Market (₹ Cr)',data:[{y:'2021',v:2500},{y:'2022',v:3200},{y:'2023',v:4000},{y:'2024',v:5000},{y:'2025',v:6200}],dataKeys:[{key:'v',color:C.orange}],xKey:'y'},
    ],
    notif:{title:'BVSc Career Mapped',body:'Pet care industry growing 20%/yr — urban vet demand rising.',type:'insight'},
  },

  bsc_agriculture: {
    summary:'B.Sc. Agriculture — 4 yr. ICAR, ARS, state agri depts, agri-tech startups. Avg salary ₹4–15 LPA. 1,300+ agri-tech startups in India.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–9 LPA',change:'Entry level',up:true},
      {label:'ICAR/ARS',value:'₹8–18 LPA',change:'Research track',up:true},
      {label:'Agri-Tech Startups',value:'1,300+ India',change:'Booming sector',up:true},
      {label:'Duration',value:'4 Years',change:'B.Sc. Agri',up:true},
    ],
    charts:[
      {type:'bar',title:'Agriculture Career Salary (₹LPA)',data:[{r:'Agri Officer',v:7},{r:'ICAR Scientist',v:12},{r:'Agri-Tech',v:10},{r:'Bank (NABARD)',v:9},{r:'Extension Officer',v:7}],dataKeys:[{key:'v',color:C.lime}],xKey:'r'},
      {type:'area',title:'India Agri-Tech Investment ($Mn)',data:[{y:'2021',v:480},{y:'2022',v:680},{y:'2023',v:900},{y:'2024',v:1200},{y:'2025',v:1580}],dataKeys:[{key:'v',color:C.green}],xKey:'y'},
    ],
    notif:{title:'B.Sc. Agriculture Mapped',body:'Agri-tech + ICAR = two best high-growth paths.',type:'insight'},
  },

  bsc_forestry: {
    summary:'B.Sc. Forestry — 4 yr. Forest Dept, ICFRE, eco-tourism, conservation. Avg salary ₹5–12 LPA govt. Carbon credits = new-age opportunity.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹5–10 LPA',change:'Govt sector',up:true},
      {label:'Forest Dept Jobs',value:'State + Central',change:'Regular intake',up:true},
      {label:'Carbon Credit Mkt',value:'Emerging fast',change:'New opportunity',up:true},
      {label:'Duration',value:'4 Years',change:'B.Sc. Forestry',up:true},
    ],
    charts:[
      {type:'bar',title:'Forestry Career Salary (₹LPA)',data:[{p:'Forest Guard',v:4},{p:'Range Officer',v:7},{p:'DFO',v:14},{p:'ICFRE Research',v:10},{p:'NGO/Intl',v:16}],dataKeys:[{key:'v',color:C.green}],xKey:'p'},
      {type:'pie',title:'Forestry Graduates Employment',data:[{name:'Govt Forest Dept',value:45},{name:'NGO/Conservation',value:25},{name:'Research',value:18},{name:'Private/Eco-tourism',value:12}],dataKeys:[{key:'value',color:C.lime}],xKey:'name'},
    ],
    notif:{title:'B.Sc. Forestry Mapped',body:'Carbon credit markets creating new-age forestry careers.',type:'insight'},
  },

  bsc_horticulture: {
    summary:'B.Sc. Horticulture — 4 yr. Floriculture, food processing, export agri. Avg salary ₹4–12 LPA. India 2nd largest fruit & veg producer globally.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–9 LPA',change:'Entry level',up:true},
      {label:'Export Market',value:'₹40,000 Cr+',change:'Horticulture exports',up:true},
      {label:'Food Processing',value:'+22% by 2027',change:'PMKSY scheme',up:true},
      {label:'Duration',value:'4 Years',change:'B.Sc. Horticulture',up:true},
    ],
    charts:[
      {type:'bar',title:'Horticulture Career Salary (₹LPA)',data:[{p:'Horticulture Officer',v:6},{p:'Food Processing',v:8},{p:'Export Agri',v:10},{p:'ICAR Research',v:11},{p:'Nursery Mgmt',v:7}],dataKeys:[{key:'v',color:C.lime}],xKey:'p'},
      {type:'area',title:'India Horticulture Output (Mn Tonnes)',data:[{y:'2021',v:334},{y:'2022',v:342},{y:'2023',v:352},{y:'2024',v:363},{y:'2025',v:375}],dataKeys:[{key:'v',color:C.green}],xKey:'y'},
    ],
    notif:{title:'B.Sc. Horticulture Mapped',body:'India is world\'s 2nd largest fruit & vegetable producer.',type:'insight'},
  },

  fisheries: {
    summary:'Fisheries Science (B.F.Sc.) — 4 yr. India 3rd largest fish producer globally. Govt jobs, aquaculture, export. Avg salary ₹4–12 LPA.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–9 LPA',change:'Entry level',up:true},
      {label:'Fish Exports',value:'$8.1Bn (2024)',change:'Growing strongly',up:true},
      {label:'PM Matsya Yojana',value:'₹20,050 Cr',change:'Govt scheme',up:true},
      {label:'Duration',value:'4 Years',change:'B.F.Sc.',up:true},
    ],
    charts:[
      {type:'bar',title:'Fisheries Career Salary (₹LPA)',data:[{p:'Fisheries Officer',v:6},{p:'Aquaculture',v:8},{p:'Fish Export',v:10},{p:'Research/ICAR',v:11},{p:'Marine Dept',v:7}],dataKeys:[{key:'v',color:C.blue}],xKey:'p'},
      {type:'area',title:'India Fish Export Value ($Bn)',data:[{y:'2021',v:5.5},{y:'2022',v:6.7},{y:'2023',v:7.4},{y:'2024',v:8.1},{y:'2025',v:9.2}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'Fisheries Science Mapped',body:'India\'s fish exports hitting record highs — growing field.',type:'insight'},
  },

  /* ═══ COMMERCE ═══ */

  bcom: {
    summary:'B.Com — Most popular commerce degree. 3 yr. Gateway to CA, MBA, banking. Avg salary ₹3–8 LPA; with CA/MBA reaches ₹12–40 LPA.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary (UG)',value:'₹3–6 LPA',change:'Entry level',up:true},
      {label:'With CA',value:'₹12–40 LPA',change:'Best combo',up:true},
      {label:'With MBA Finance',value:'₹10–25 LPA',change:'B-school route',up:true},
      {label:'Duration',value:'3 Years',change:'B.Com',up:true},
    ],
    charts:[
      {type:'bar',title:'B.Com + Qualification Salary (₹LPA)',data:[{q:'B.Com only',v:4.5},{q:'+CA',v:18},{q:'+MBA',v:14},{q:'+CFA',v:16},{q:'+CS',v:10}],dataKeys:[{key:'v',color:C.blue}],xKey:'q'},
      {type:'area',title:'Commerce Graduates Placed (%)',data:[{y:'2020',v:62},{y:'2021',v:67},{y:'2022',v:72},{y:'2023',v:76},{y:'2024',v:80}],dataKeys:[{key:'v',color:C.emerald}],xKey:'y'},
    ],
    notif:{title:'B.Com Mapped',body:'CA is the highest ROI add-on for B.Com graduates.',type:'insight'},
  },

  ca: {
    summary:'CA (Chartered Accountancy) — India\'s most respected finance credential. Big4 pays ₹12–25 LPA. Only ~10% pass all 3 levels. Own practice earns ₹30–2Cr+.',
    modules:['financial','comparison','forecast'],
    kpis:[
      {label:'Big4 Fresh Salary',value:'₹12–25 LPA',change:'After ICAI pass',up:true},
      {label:'Own Practice',value:'₹30–2Cr+',change:'Senior CA',up:true},
      {label:'Pass Rate',value:'~10–15%',change:'All 3 levels',up:false},
      {label:'Duration',value:'4–5 Years',change:'Foundation→Final',up:true},
    ],
    charts:[
      {type:'bar',title:'CA Salary by Stage (₹LPA)',data:[{s:'Articleship',v:1.5},{s:'Fresh CA',v:10},{s:'3–5 Yrs',v:20},{s:'Senior CA',v:38},{s:'Partner',v:85}],dataKeys:[{key:'v',color:C.emerald}],xKey:'s'},
      {type:'pie',title:'CA Employment Sectors',data:[{name:'Big4/MNC',value:38},{name:'Own Practice',value:28},{name:'PSU/Govt',value:16},{name:'SME Finance',value:18}],dataKeys:[{key:'value',color:C.blue}],xKey:'name'},
    ],
    notif:{title:'CA Career Mapped',body:'Big4 firms pay ₹12–25 LPA to fresh CAs.',type:'insight'},
  },

  cs_commerce: {
    summary:'CS (Company Secretary) — ICSI 3-level programme. Avg salary ₹5–25 LPA. SEBI/MCA compliance regulations driving demand +30% by 2026.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Entry Salary',value:'₹5–8 LPA',change:'Fresh CS',up:true},
      {label:'Senior CS',value:'₹15–40 LPA',change:'10+ yrs',up:true},
      {label:'SEBI/MCA Demand',value:'+30% by 2026',change:'Compliance boom',up:true},
      {label:'Duration',value:'3 Years',change:'Foundation→Final',up:true},
    ],
    charts:[
      {type:'bar',title:'CS Salary by Experience (₹LPA)',data:[{e:'Trainee',v:3},{e:'Fresh CS',v:7},{e:'3 Yrs',v:12},{e:'7 Yrs',v:22},{e:'Company Sec.',v:38}],dataKeys:[{key:'v',color:C.gold}],xKey:'e'},
      {type:'area',title:'Corporate Compliance Jobs India',data:[{y:'2021',v:4500},{y:'2022',v:5800},{y:'2023',v:7200},{y:'2024',v:9000},{y:'2025',v:11000}],dataKeys:[{key:'v',color:C.amber}],xKey:'y'},
    ],
    notif:{title:'CS Career Mapped',body:'SEBI & MCA regulations = growing compliance demand.',type:'insight'},
  },

  cma: {
    summary:'CMA (Cost & Management Accountant) — ICMAI credential. Avg salary ₹6–30 LPA. Cost audit, management accounting, manufacturing sector roles.',
    modules:['financial','comparison','forecast'],
    kpis:[
      {label:'Entry Salary',value:'₹6–10 LPA',change:'Fresh CMA',up:true},
      {label:'Senior CMA',value:'₹18–40 LPA',change:'10+ yrs',up:true},
      {label:'Manufacturing',value:'+25% by 2027',change:'Make in India',up:true},
      {label:'Duration',value:'3 Years',change:'Foundation→Final',up:true},
    ],
    charts:[
      {type:'bar',title:'CMA Salary by Sector (₹LPA)',data:[{s:'Manufacturing',v:10},{s:'Finance',v:12},{s:'Consulting',v:14},{s:'PSU/Govt',v:9},{s:'Practice',v:20}],dataKeys:[{key:'v',color:C.orange}],xKey:'s'},
      {type:'pie',title:'CMA Employment Distribution',data:[{name:'Manufacturing',value:40},{name:'BFSI',value:25},{name:'Govt/PSU',value:20},{name:'Services',value:15}],dataKeys:[{key:'value',color:C.amber}],xKey:'name'},
    ],
    notif:{title:'CMA Career Mapped',body:'Make in India driving manufacturing sector CMA demand.',type:'insight'},
  },

  bba: {
    summary:'BBA (Bachelor of Business Administration) — 3 yr. Gateway to MBA. Avg salary ₹4–10 LPA. IIM IPM integrated programme top choice.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary (UG)',value:'₹4–8 LPA',change:'Entry level',up:true},
      {label:'After MBA (IIM)',value:'₹20–50 LPA',change:'Top B-school',up:true},
      {label:'IPM (IIM)',value:'₹18–35 LPA',change:'5-yr integrated',up:true},
      {label:'Duration',value:'3 Years',change:'BBA',up:true},
    ],
    charts:[
      {type:'bar',title:'BBA + MBA Salary (₹LPA)',data:[{q:'BBA only',v:6},{q:'+MBA Tier-3',v:9},{q:'+MBA Tier-2',v:14},{q:'+MBA IIM CAT',v:32}],dataKeys:[{key:'v',color:C.blue}],xKey:'q'},
      {type:'area',title:'MBA Graduates India (Thousands)',data:[{y:'2021',v:240},{y:'2022',v:275},{y:'2023',v:310},{y:'2024',v:345},{y:'2025',v:385}],dataKeys:[{key:'v',color:C.indigo}],xKey:'y'},
    ],
    notif:{title:'BBA Career Mapped',body:'BBA + IIM MBA = India\'s top management career pathway.',type:'insight'},
  },

  bms: {
    summary:'BMS (Bachelor of Management Studies) — Mumbai University flagship. 3 yr. Strong for finance, marketing, operations. Avg salary ₹4–12 LPA.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–9 LPA',change:'Entry level',up:true},
      {label:'After MBA',value:'₹12–30 LPA',change:'Top B-school',up:true},
      {label:'Mumbai Advantage',value:'Financial hub',change:'Best placement',up:true},
      {label:'Duration',value:'3 Years',change:'BMS',up:true},
    ],
    charts:[
      {type:'bar',title:'BMS Salary by Function (₹LPA)',data:[{f:'Finance',v:8},{f:'Marketing',v:7},{f:'Operations',v:7},{f:'HR',v:6},{f:'Consulting',v:10}],dataKeys:[{key:'v',color:C.indigo}],xKey:'f'},
      {type:'area',title:'Business Graduates Employment Rate (%)',data:[{y:'2021',v:72},{y:'2022',v:76},{y:'2023',v:80},{y:'2024',v:83},{y:'2025',v:86}],dataKeys:[{key:'v',color:C.blue}],xKey:'y'},
    ],
    notif:{title:'BMS Career Mapped',body:'Mumbai-based BMS offers strong banking & finance placements.',type:'insight'},
  },

  investment_banking: {
    summary:'Investment Banking (BBA Finance / MBA Finance) — IB analyst salary ₹15–30 LPA fresh MBA. VP/Director ₹80–1.5Cr+. CFA + MBA top combination.',
    modules:['financial','market','forecast'],
    kpis:[
      {label:'IB Analyst Salary',value:'₹15–30 LPA',change:'Fresh MBA',up:true},
      {label:'Associate (3 yrs)',value:'₹30–80 LPA',change:'+bonuses',up:true},
      {label:'VP/Director',value:'₹80–1.5Cr+',change:'5–8 yrs',up:true},
      {label:'Key Skill',value:'CFA + Excel',change:'Must have',up:true},
    ],
    charts:[
      {type:'bar',title:'IB Salary by Level (₹LPA)',data:[{l:'Analyst',v:22},{l:'Associate',v:45},{l:'VP',v:85},{l:'Director',v:130},{l:'MD',v:200}],dataKeys:[{key:'v',color:C.emerald}],xKey:'l'},
      {type:'area',title:'India IB Deal Activity ($Bn)',data:[{y:'2021',v:42},{y:'2022',v:58},{y:'2023',v:72},{y:'2024',v:88},{y:'2025',v:108}],dataKeys:[{key:'v',color:C.gold}],xKey:'y'},
    ],
    notif:{title:'Investment Banking Mapped',body:'India\'s IB deal flow growing — top salaries in finance.',type:'insight'},
  },

  ba_economics: {
    summary:'B.A./B.Sc. Economics — RBI, SEBI, UPSC, consulting, research. Avg salary ₹4–25 LPA depending on path. RBI Grade B = most prestigious exam.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'RBI/SEBI',value:'₹12–25 LPA',change:'Govt economist',up:true},
      {label:'With MBA/MA Eco',value:'₹15–40 LPA',change:'PG track',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. Economics',up:true},
    ],
    charts:[
      {type:'bar',title:'Economics Career Salary (₹LPA)',data:[{p:'Teaching/Academia',v:6},{p:'Govt Economist',v:14},{p:'RBI/SEBI',v:18},{p:'Consulting',v:16},{p:'Research',v:10}],dataKeys:[{key:'v',color:C.indigo}],xKey:'p'},
      {type:'pie',title:'Economics Graduates Employment',data:[{name:'UPSC/Govt',value:30},{name:'Finance/Banking',value:28},{name:'Research/Academia',value:22},{name:'Consulting',value:20}],dataKeys:[{key:'value',color:C.blue}],xKey:'name'},
    ],
    notif:{title:'Economics Career Mapped',body:'RBI Grade B = most prestigious economics exam in India.',type:'insight'},
  },

  /* ═══ ARTS & HUMANITIES ═══ */

  ba_psychology: {
    summary:'B.A. Psychology — Counselling, HR, UX research, clinical psychology. Avg salary ₹3–15 LPA. M.Sc.+RCI licence for clinical practice.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'Clinical (RCI)',value:'₹8–20 LPA',change:'Licensed',up:true},
      {label:'UX Research',value:'₹10–25 LPA',change:'Tech sector',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. Psychology',up:true},
    ],
    charts:[
      {type:'bar',title:'Psychology Career Salary (₹LPA)',data:[{r:'HR Specialist',v:6},{r:'Counsellor',v:7},{r:'Clinical Psych.',v:14},{r:'UX Researcher',v:18},{r:'Organisational',v:12}],dataKeys:[{key:'v',color:C.violet}],xKey:'r'},
      {type:'area',title:'India Mental Health Market ($Bn)',data:[{y:'2021',v:0.8},{y:'2022',v:1.2},{y:'2023',v:1.7},{y:'2024',v:2.4},{y:'2025',v:3.2}],dataKeys:[{key:'v',color:C.purple}],xKey:'y'},
    ],
    notif:{title:'Psychology Career Mapped',body:'Mental health awareness boom driving counselling demand.',type:'insight'},
  },

  ba_sociology: {
    summary:'B.A. Sociology — UPSC, NGO, social research, corporate CSR. Avg salary ₹3–12 LPA. UN/World Bank roles ₹8–20 LPA.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'NGO/Intl Orgs',value:'₹8–20 LPA',change:'UN/World Bank',up:true},
      {label:'Corporate CSR',value:'₹8–15 LPA',change:'Growing mandate',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. Sociology',up:true},
    ],
    charts:[
      {type:'bar',title:'Sociology Career Salary (₹LPA)',data:[{c:'Social Worker',v:4},{c:'NGO Manager',v:9},{c:'CSR Officer',v:10},{c:'Policy Research',v:8},{c:'UPSC/IAS',v:12}],dataKeys:[{key:'v',color:C.teal}],xKey:'c'},
      {type:'pie',title:'Sociology Graduate Employment',data:[{name:'NGO/Dev Sector',value:35},{name:'Govt/UPSC',value:30},{name:'Academia',value:18},{name:'Corporate CSR',value:17}],dataKeys:[{key:'value',color:C.sky}],xKey:'name'},
    ],
    notif:{title:'Sociology Career Mapped',body:'Corporate CSR mandate growing = new private sector roles.',type:'insight'},
  },

  ba_polsci: {
    summary:'B.A. Political Science — UPSC, journalism, law, diplomacy. Avg salary varies. IFS/IAS + LLB combination strongest career path.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'IFS/IAS',value:'₹56K–2.5L/mo',change:'Diplomatic service',up:true},
      {label:'Journalism',value:'₹5–20 LPA',change:'Media houses',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. Pol. Sci.',up:true},
    ],
    charts:[
      {type:'bar',title:'Pol.Sci. Career Salary (₹LPA)',data:[{c:'Journalism',v:8},{c:'UPSC/IAS',v:14},{c:'Policy Think Tank',v:10},{c:'Law (LLB+)',v:12},{c:'Academic',v:6}],dataKeys:[{key:'v',color:C.rose}],xKey:'c'},
      {type:'pie',title:'Pol.Sci. Graduate Career Paths',data:[{name:'UPSC/Civil Services',value:38},{name:'Journalism/Media',value:25},{name:'Law',value:20},{name:'Academia/NGO',value:17}],dataKeys:[{key:'value',color:C.indigo}],xKey:'name'},
    ],
    notif:{title:'Political Science Mapped',body:'UPSC + LLB combo = strongest career multiplier.',type:'insight'},
  },

  ba_history: {
    summary:'B.A. History — UPSC, archaeology, teaching, heritage management. Avg salary ₹3–10 LPA. ASI, state history depts, tourism.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'UPSC/IAS',value:'₹56K–2.5L/mo',change:'Civil services',up:true},
      {label:'Heritage Tourism',value:'+25% by 2027',change:'ASI/Tourism',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. History',up:true},
    ],
    charts:[
      {type:'bar',title:'History Graduate Career Salary (₹LPA)',data:[{c:'Teaching',v:4.5},{c:'UPSC/IAS',v:14},{c:'Archaeology/ASI',v:8},{c:'Tourism/Heritage',v:7},{c:'Research',v:6}],dataKeys:[{key:'v',color:C.amber}],xKey:'c'},
      {type:'pie',title:'History Graduate Paths',data:[{name:'UPSC/Civil Services',value:40},{name:'Teaching/Academia',value:30},{name:'Heritage/Tourism',value:18},{name:'Research',value:12}],dataKeys:[{key:'value',color:C.gold}],xKey:'name'},
    ],
    notif:{title:'B.A. History Mapped',body:'UPSC is the #1 career path for history graduates.',type:'insight'},
  },

  ba_geography: {
    summary:'B.A. Geography — GIS, remote sensing, urban planning, UPSC, teaching. Avg salary ₹3–15 LPA. GIS professionals highly in demand.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'GIS Specialist',value:'₹8–20 LPA',change:'Tech skills added',up:true},
      {label:'GIS Market India',value:'$1.8Bn by 2026',change:'Fast growing',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. Geography',up:true},
    ],
    charts:[
      {type:'bar',title:'Geography Career Salary (₹LPA)',data:[{c:'Teaching',v:4.5},{c:'UPSC/IAS',v:14},{c:'GIS Analyst',v:12},{c:'Urban Planner',v:11},{c:'Remote Sensing',v:10}],dataKeys:[{key:'v',color:C.teal}],xKey:'c'},
      {type:'area',title:'India GIS Market ($Mn)',data:[{y:'2021',v:820},{y:'2022',v:1050},{y:'2023',v:1300},{y:'2024',v:1580},{y:'2025',v:1900}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'B.A. Geography Mapped',body:'GIS skills transform geography into a high-paying tech career.',type:'insight'},
  },

  /* ═══ LAW ═══ */

  law: {
    summary:'BA LLB / LLB — Corporate law & litigation booming. CLAT entrance. NLU campus packages ₹20–35 LPA. Top lawyers earn ₹50L–5Cr+.',
    modules:['market','comparison','financial'],
    kpis:[
      {label:'Entrance',value:'CLAT / AILET',change:'5 yr integrated',up:true},
      {label:'Avg Starting',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'Corporate Law',value:'₹20–80 LPA',change:'5–8 yrs exp',up:true},
      {label:'NLU Packages',value:'₹20–35 LPA',change:'Campus placement',up:true},
    ],
    charts:[
      {type:'bar',title:'Law Career Salary by Path (₹LPA)',data:[{p:'Litigation',v:5},{p:'Corporate',v:22},{p:'Judiciary',v:9},{p:'Legal Consulting',v:18},{p:'Academic',v:6}],dataKeys:[{key:'v',color:C.amber}],xKey:'p'},
      {type:'line',title:'Law Firm Hiring Growth India (%)',data:[{y:'2020',v:4},{y:'2021',v:8},{y:'2022',v:14},{y:'2023',v:18},{y:'2024',v:22}],dataKeys:[{key:'v',color:C.gold}],xKey:'y'},
    ],
    notif:{title:'Law Career Mapped',body:'Corporate law + NLU = highest salary entry in legal profession.',type:'insight'},
  },

  bba_llb: {
    summary:'BBA LLB — 5 yr integrated. Best for corporate law, M&A, legal consulting. Top NLU packages ₹15–30 LPA. CLAT entrance.',
    modules:['market','comparison','financial'],
    kpis:[
      {label:'Entrance',value:'CLAT / AILET',change:'5 yr',up:true},
      {label:'Entry Package',value:'₹8–20 LPA',change:'NLU placement',up:true},
      {label:'Corporate Law',value:'₹20–60 LPA',change:'5–8 yrs',up:true},
      {label:'Duration',value:'5 Years',change:'BBA LLB',up:true},
    ],
    charts:[
      {type:'bar',title:'BBA LLB Salary by Specialisation (₹LPA)',data:[{s:'M&A',v:22},{s:'IPR',v:16},{s:'Competition',v:18},{s:'Real Estate',v:14},{s:'Govt Law',v:9}],dataKeys:[{key:'v',color:C.amber}],xKey:'s'},
      {type:'area',title:'Corporate Legal Market India ($Bn)',data:[{y:'2021',v:2.8},{y:'2022',v:3.6},{y:'2023',v:4.5},{y:'2024',v:5.6},{y:'2025',v:7}],dataKeys:[{key:'v',color:C.gold}],xKey:'y'},
    ],
    notif:{title:'BBA LLB Mapped',body:'Corporate law + business background = top law career combo.',type:'insight'},
  },

  /* ═══ MEDIA & COMMUNICATION ═══ */

  mass_comm: {
    summary:'Mass Communication / Journalism — Digital media boom. OTT, digital news, PR exploding. Avg salary ₹3–20 LPA.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–10 LPA',change:'Entry level',up:true},
      {label:'Digital Media',value:'₹8–25 LPA',change:'OTT/Digital news',up:true},
      {label:'OTT Market India',value:'$3.5Bn by 2026',change:'Fast growing',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. Mass Comm',up:true},
    ],
    charts:[
      {type:'bar',title:'Media Career Salary (₹LPA)',data:[{r:'Reporter/Writer',v:5},{r:'Digital Marketing',v:9},{r:'PR Manager',v:11},{r:'Content Strategist',v:12},{r:'Broadcast',v:8}],dataKeys:[{key:'v',color:C.orange}],xKey:'r'},
      {type:'area',title:'India Digital Ad Spend ($Bn)',data:[{y:'2021',v:4.2},{y:'2022',v:5.8},{y:'2023',v:7.4},{y:'2024',v:9.1},{y:'2025',v:11.2}],dataKeys:[{key:'v',color:C.amber}],xKey:'y'},
    ],
    notif:{title:'Mass Communication Mapped',body:'Digital media + OTT boom = strong opportunities in 2025.',type:'insight'},
  },

  /* ═══ DESIGN & CREATIVE ═══ */

  fashion_design: {
    summary:'Fashion Design — NIFT/NID entrance. India fashion market ₹6.5 Lakh Cr. Avg salary ₹4–20 LPA. Sustainable fashion growing strongly.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'Senior Designer',value:'₹15–40 LPA',change:'8+ yrs',up:true},
      {label:'India Fashion Mkt',value:'₹6.5 Lakh Cr',change:'5th globally',up:true},
      {label:'Entrance',value:'NIFT/NID',change:'Competitive',up:false},
    ],
    charts:[
      {type:'bar',title:'Fashion Career Salary (₹LPA)',data:[{r:'Jr Designer',v:5},{r:'Designer',v:9},{r:'Sr Designer',v:16},{r:'Creative Dir.',v:28},{r:'Own Label',v:40}],dataKeys:[{key:'v',color:C.pink}],xKey:'r'},
      {type:'area',title:'India Fashion Industry (₹ Lakh Cr)',data:[{y:'2022',v:5.2},{y:'2023',v:5.8},{y:'2024',v:6.4},{y:'2025',v:7.2},{y:'2026',v:8.1}],dataKeys:[{key:'v',color:C.rose}],xKey:'y'},
    ],
    notif:{title:'Fashion Design Mapped',body:'India fashion is world\'s 5th largest industry by volume.',type:'insight'},
  },

  interior_design: {
    summary:'Interior Design — Booming with real estate growth. Own studio ₹30–80L/yr. CEED/NID entrance. Avg salary ₹4–18 LPA.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'Senior Designer',value:'₹12–25 LPA',change:'8+ yrs',up:true},
      {label:'Own Studio',value:'₹30–80L/yr',change:'Established',up:true},
      {label:'Real Estate Growth',value:'+28% by 2026',change:'Direct link',up:true},
    ],
    charts:[
      {type:'bar',title:'Interior Design Salary (₹LPA)',data:[{r:'Jr Designer',v:4},{r:'Designer',v:8},{r:'Sr Designer',v:15},{r:'Project Manager',v:20},{r:'Own Studio',v:45}],dataKeys:[{key:'v',color:C.teal}],xKey:'r'},
      {type:'area',title:'India Interior Design Market ($Bn)',data:[{y:'2021',v:3.2},{y:'2022',v:4.1},{y:'2023',v:5.3},{y:'2024',v:6.8},{y:'2025',v:8.7}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'Interior Design Mapped',body:'Real estate boom directly drives interior design demand.',type:'insight'},
  },

  graphic_design: {
    summary:'Graphic Design — UI/UX, brand, advertising. Avg salary ₹4–20 LPA. Freelance potential ₹5–40 LPA with global clients.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'UI/UX Designer',value:'₹10–25 LPA',change:'Tech sector',up:true},
      {label:'Freelance',value:'₹5–40 LPA',change:'Global clients',up:true},
      {label:'Duration',value:'3–4 Years',change:'B.Des/Diploma',up:true},
    ],
    charts:[
      {type:'bar',title:'Design Salary by Specialisation (₹LPA)',data:[{s:'Graphic Design',v:7},{s:'UI/UX',v:15},{s:'Motion Design',v:10},{s:'Brand Design',v:12},{s:'3D/VFX',v:11}],dataKeys:[{key:'v',color:C.violet}],xKey:'s'},
      {type:'area',title:'India Digital Design Market ($Bn)',data:[{y:'2021',v:2.8},{y:'2022',v:3.9},{y:'2023',v:5.2},{y:'2024',v:7},{y:'2025',v:9.2}],dataKeys:[{key:'v',color:C.purple}],xKey:'y'},
    ],
    notif:{title:'Graphic Design Mapped',body:'UI/UX is the highest-paying design specialisation in India.',type:'insight'},
  },

  animation_vfx: {
    summary:'Animation & VFX — Bollywood, OTT, gaming driving demand. India VFX industry growing 20%/yr. Avg salary ₹4–25 LPA.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹4–12 LPA',change:'Entry level',up:true},
      {label:'Senior VFX',value:'₹15–35 LPA',change:'5+ yrs',up:true},
      {label:'India VFX Growth',value:'+20%/yr',change:'OTT boom',up:true},
      {label:'Duration',value:'3–4 Years',change:'B.Des/Diploma',up:true},
    ],
    charts:[
      {type:'bar',title:'Animation/VFX Salary (₹LPA)',data:[{r:'Animator',v:5},{r:'VFX Artist',v:9},{r:'Sr VFX',v:16},{r:'VFX Supervisor',v:25},{r:'Art Director',v:30}],dataKeys:[{key:'v',color:C.orange}],xKey:'r'},
      {type:'area',title:'India Animation & VFX Market ($Bn)',data:[{y:'2022',v:1.1},{y:'2023',v:1.4},{y:'2024',v:1.8},{y:'2025',v:2.3},{y:'2026',v:2.9}],dataKeys:[{key:'v',color:C.amber}],xKey:'y'},
    ],
    notif:{title:'Animation & VFX Mapped',body:'OTT + gaming = explosive VFX demand in India.',type:'insight'},
  },

  game_design: {
    summary:'Game Design/Development — India gaming market ₹23,100 Cr growing 28%/yr. Mobile gaming + esports driving fresh opportunities. Avg salary ₹4–25 LPA.',
    modules:['market','forecast','strategy'],
    kpis:[
      {label:'Avg Salary',value:'₹4–14 LPA',change:'Entry level',up:true},
      {label:'Senior Dev',value:'₹15–30 LPA',change:'5+ yrs',up:true},
      {label:'India Gaming Mkt',value:'₹23,100 Cr',change:'Growing 28%/yr',up:true},
      {label:'Duration',value:'3–4 Years',change:'B.Des/BCA',up:true},
    ],
    charts:[
      {type:'bar',title:'Game Dev Salary (₹LPA)',data:[{r:'Jr Developer',v:4.5},{r:'Game Designer',v:8},{r:'Unity/Unreal Dev',v:12},{r:'Lead Developer',v:20},{r:'Game Director',v:28}],dataKeys:[{key:'v',color:C.green}],xKey:'r'},
      {type:'area',title:'India Gaming Revenue (₹ Cr)',data:[{y:'2022',v:14500},{y:'2023',v:17800},{y:'2024',v:21200},{y:'2025',v:25000},{y:'2026',v:29500}],dataKeys:[{key:'v',color:C.lime}],xKey:'y'},
    ],
    notif:{title:'Game Design Mapped',body:'India mobile gaming market growing 28%/yr.',type:'insight'},
  },

  /* ═══ HOSPITALITY & TOURISM ═══ */

  hotel_management: {
    summary:'Hotel Management — India hospitality targeting $250Bn by 2030. Avg India salary ₹3–8 LPA. Global 5-star chains pay ₹15–40 LPA.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary India',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'Abroad (5-star)',value:'₹15–40 LPA',change:'Global chains',up:true},
      {label:'Hospitality Market',value:'$250Bn by 2030',change:'India target',up:true},
      {label:'Duration',value:'3–4 Years',change:'B.Sc. HM',up:true},
    ],
    charts:[
      {type:'bar',title:'Hotel Management Salary (₹LPA)',data:[{r:'Front Office',v:3.5},{r:'Food & Bev.',v:4},{r:'Chef/Kitchen',v:6},{r:'GM Trainee',v:8},{r:'GM (5-star)',v:25}],dataKeys:[{key:'v',color:C.amber}],xKey:'r'},
      {type:'area',title:'India Tourism Revenue ($Bn)',data:[{y:'2022',v:77},{y:'2023',v:103},{y:'2024',v:132},{y:'2025',v:165},{y:'2026',v:200}],dataKeys:[{key:'v',color:C.orange}],xKey:'y'},
    ],
    notif:{title:'Hotel Management Mapped',body:'India hospitality targeting $250Bn — growing fast.',type:'insight'},
  },

  travel_tourism: {
    summary:'Travel & Tourism — India domestic tourism at record highs. Avg salary ₹3–12 LPA. Travel tech (MakeMyTrip/OYO) paying ₹8–20 LPA.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'Travel Tech',value:'₹8–20 LPA',change:'MakeMyTrip etc.',up:true},
      {label:'Intl Tourists India',value:'20M by 2025',change:'Govt target',up:true},
      {label:'Duration',value:'3 Years',change:'B.A./B.Sc.',up:true},
    ],
    charts:[
      {type:'bar',title:'Tourism Career Salary (₹LPA)',data:[{r:'Tour Guide',v:3},{r:'Travel Agent',v:5},{r:'Event Manager',v:8},{r:'Travel Tech',v:14},{r:'Tourism Manager',v:12}],dataKeys:[{key:'v',color:C.teal}],xKey:'r'},
      {type:'area',title:'India Domestic Tourist Trips (Bn)',data:[{y:'2022',v:1.5},{y:'2023',v:1.9},{y:'2024',v:2.3},{y:'2025',v:2.8},{y:'2026',v:3.3}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'Travel & Tourism Mapped',body:'India domestic tourism broke all-time records in 2024.',type:'insight'},
  },

  /* ═══ SPORTS & FITNESS ═══ */

  sports_bped: {
    summary:'B.P.Ed. / Sports Management — India sports market ₹35,000 Cr. Sports tech analytics, coaching, management roles. Avg salary ₹3–15 LPA.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–8 LPA',change:'Entry level',up:true},
      {label:'Sports Tech',value:'₹10–22 LPA',change:'Analytics roles',up:true},
      {label:'India Sports Mkt',value:'₹35,000 Cr',change:'Growing 25%/yr',up:true},
      {label:'Duration',value:'3–4 Years',change:'B.P.Ed.',up:true},
    ],
    charts:[
      {type:'bar',title:'Sports Career Salary (₹LPA)',data:[{r:'Coach/Trainer',v:4},{r:'Physiotherapist',v:10},{r:'Sports Manager',v:11},{r:'Sports Analyst',v:14},{r:'Athlete (Pro)',v:20}],dataKeys:[{key:'v',color:C.green}],xKey:'r'},
      {type:'area',title:'India Sports Industry Revenue (₹ Cr)',data:[{y:'2022',v:22000},{y:'2023',v:26000},{y:'2024',v:30000},{y:'2025',v:35000},{y:'2026',v:42000}],dataKeys:[{key:'v',color:C.lime}],xKey:'y'},
    ],
    notif:{title:'Sports & Fitness Mapped',body:'India targeting Olympic excellence — sports growing 25%/yr.',type:'insight'},
  },

  /* ═══ EDUCATION / B.Ed. ═══ */

  bed_education: {
    summary:'Integrated B.Ed. — Teaching, EdTech, school management. EdTech sector paying ₹8–20 LPA for trained educators. Market $30Bn by 2030.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–7 LPA',change:'School teaching',up:true},
      {label:'EdTech Roles',value:'₹8–20 LPA',change:'Byju\'s/Unacademy',up:true},
      {label:'EdTech Market',value:'$30Bn India 2030',change:'Fast growing',up:true},
      {label:'Duration',value:'4 Years',change:'Integrated B.Ed.',up:true},
    ],
    charts:[
      {type:'bar',title:'Education Career Salary (₹LPA)',data:[{r:'Govt Teacher',v:4.5},{r:'Private School',v:5},{r:'EdTech Educator',v:12},{r:'Content Creator',v:10},{r:'School Principal',v:15}],dataKeys:[{key:'v',color:C.blue}],xKey:'r'},
      {type:'area',title:'India EdTech Market ($Bn)',data:[{y:'2022',v:11},{y:'2023',v:14},{y:'2024',v:18},{y:'2025',v:24},{y:'2026',v:30}],dataKeys:[{key:'v',color:C.indigo}],xKey:'y'},
    ],
    notif:{title:'B.Ed. Career Mapped',body:'EdTech revolution doubling teacher salaries in tech roles.',type:'insight'},
  },

  /* ═══ CIVIL SERVICES ═══ */

  upsc_ias: {
    summary:'UPSC IAS/IPS/IFS — India\'s most prestigious exam. Salary ₹56K–2.5L/mo + pension. 0.1–0.2% selection rate from 1.3M+ applicants.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Selection Rate',value:'0.1–0.2%',change:'~180 IAS/year',up:false},
      {label:'IAS Salary',value:'₹56K–2.5L/mo',change:'+ DA + perks',up:true},
      {label:'Prep Time',value:'1–4 Years',change:'Average',up:true},
      {label:'Age Limit',value:'21–32 yrs',change:'Gen category',up:true},
    ],
    charts:[
      {type:'bar',title:'UPSC Aspirants (Mn) vs Selected',data:[{y:'2021',app:1020},{y:'2022',app:1100},{y:'2023',app:1300},{y:'2024',app:1400}],dataKeys:[{key:'app',color:C.blue}],xKey:'y'},
      {type:'pie',title:'IAS Qualifier Background',data:[{name:'Engineering',value:48},{name:'Humanities',value:28},{name:'Science',value:14},{name:'Commerce',value:10}],dataKeys:[{key:'value',color:C.violet}],xKey:'name'},
    ],
    notif:{title:'UPSC/IAS Mapped',body:'Engineering grads dominate IAS selections every year.',type:'insight'},
  },

  ssc: {
    summary:'SSC CGL/CHSL/MTS — Central Govt jobs. CGL salary ₹35K–1.2L/mo. Job security + pension + perks. 10M+ applicants per year.',
    modules:['market','comparison','strategy'],
    kpis:[
      {label:'SSC CGL Salary',value:'₹35K–1.2L/mo',change:'Group B posts',up:true},
      {label:'Vacancies/yr',value:'10,000–50,000+',change:'Varies by exam',up:true},
      {label:'Selection Rate',value:'~0.5–2%',change:'Competitive',up:false},
      {label:'Exams',value:'CGL/CHSL/MTS',change:'Multiple annually',up:true},
    ],
    charts:[
      {type:'bar',title:'SSC Post Salary Range (₹K/mo)',data:[{p:'MTS',v:18},{p:'CHSL',v:28},{p:'CGL Gr.C',v:45},{p:'CGL Gr.B',v:70},{p:'CGL Gr.B Gaz.',v:110}],dataKeys:[{key:'v',color:C.emerald}],xKey:'p'},
      {type:'area',title:'SSC Applicants (Millions)',data:[{y:'2021',v:28},{y:'2022',v:33},{y:'2023',v:38},{y:'2024',v:44}],dataKeys:[{key:'v',color:C.green}],xKey:'y'},
    ],
    notif:{title:'SSC Career Mapped',body:'SSC CGL = most applied central govt exam after UPSC.',type:'insight'},
  },

  /* ═══ Backwards-compat alias ═══ */
  commerce_ca: {
    summary:'B.Com + CA — India\'s most respected finance credential. Big4 pays ₹12–25 LPA freshers. Own practice earns ₹30–2Cr+.',
    modules:['financial','comparison','forecast'],
    kpis:[
      {label:'Big4 Fresh Salary',value:'₹12–25 LPA',change:'After ICAI pass',up:true},
      {label:'Own Practice',value:'₹30–2Cr+',change:'Senior CA',up:true},
      {label:'Pass Rate',value:'~10–15%',change:'All 3 levels',up:false},
      {label:'Duration',value:'4–5 Years',change:'Foundation→Final',up:true},
    ],
    charts:[
      {type:'bar',title:'CA Salary by Stage (₹LPA)',data:[{s:'Articleship',v:1.5},{s:'Fresh CA',v:10},{s:'3–5 Yrs',v:20},{s:'Senior CA',v:38},{s:'Partner',v:85}],dataKeys:[{key:'v',color:C.emerald}],xKey:'s'},
      {type:'pie',title:'CA Employment Sectors',data:[{name:'Big4/MNC',value:38},{name:'Own Practice',value:28},{name:'PSU/Govt',value:16},{name:'SME Finance',value:18}],dataKeys:[{key:'value',color:C.blue}],xKey:'name'},
    ],
    notif:{title:'CA Career Analysis Done',body:'Big4 firms pay ₹12–25 LPA to fresh CAs.',type:'insight'},
  },


  /* ═══ DEFENCE — TECHNICAL ENTRY SCHEMES ═══ */

  technical_entry_defence: {
    summary:'Technical Entry Schemes (TES/JCO Tech) — Join Army/Navy/Air Force as Technical Officer after PCM Class 12. Salary ₹56K–1.5L/mo. No written exam — direct SSB interview.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Entry Salary',value:'₹56,100/mo',change:'Lieutenant rank',up:true},
      {label:'Selection',value:'SSB Interview only',change:'No written exam',up:true},
      {label:'Pension + Perks',value:'Lifetime',change:'Govt benefits',up:true},
      {label:'Duration',value:'1 Yr TGC training',change:'After PCM 12th',up:true},
    ],
    charts:[
      {type:'bar',title:'Defence Technical Officer Salary (₹K/mo)',data:[{r:'Lieutenant',v:56},{r:'Captain',v:70},{r:'Major',v:90},{r:'Lt. Colonel',v:120},{r:'Colonel',v:150}],dataKeys:[{key:'v',color:C.green}],xKey:'r'},
      {type:'pie',title:'Technical Entry Scheme — Service Split',data:[{name:'Army TES',value:55},{name:'Navy SSC Tech',value:25},{name:'IAF AFCAT Tech',value:20}],dataKeys:[{key:'value',color:C.blue}],xKey:'name'},
    ],
    notif:{title:'Technical Entry Defence Mapped',body:'Only SSB needed — best defence route for PCM students.',type:'insight'},
  },

  /* ═══ COMMERCE — MISSING FIELDS ═══ */

  bcom_hons: {
    summary:'B.Com (Hons.) — Specialised honours degree with deeper finance & accounting modules. Delhi University flagship. Avg salary ₹4–10 LPA; CA/MBA multiplies to ₹15–40 LPA.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary (UG)',value:'₹4–8 LPA',change:'Entry level',up:true},
      {label:'With CA',value:'₹15–40 LPA',change:'Best combo',up:true},
      {label:'DU Advantage',value:'Top recruiters',change:'SRCC/HRC',up:true},
      {label:'Duration',value:'3 Years',change:'B.Com Hons.',up:true},
    ],
    charts:[
      {type:'bar',title:'B.Com Hons. vs B.Com Salary (₹LPA)',data:[{q:'B.Com',v:4},{q:'B.Com Hons.',v:5.5},{q:'Hons.+CA',v:20},{q:'Hons.+MBA',v:15},{q:'Hons.+CFA',v:18}],dataKeys:[{key:'v',color:C.blue}],xKey:'q'},
      {type:'area',title:'DU Commerce Placements (%)',data:[{y:'2020',v:68},{y:'2021',v:74},{y:'2022',v:78},{y:'2023',v:82},{y:'2024',v:86}],dataKeys:[{key:'v',color:C.indigo}],xKey:'y'},
    ],
    notif:{title:'B.Com Hons. Mapped',body:'SRCC B.Com Hons. is India's most prestigious commerce UG degree.',type:'insight'},
  },

  baf: {
    summary:'Bachelor of Accounting & Finance (BAF) — Mumbai University's industry-focused commerce degree. Avg salary ₹4–12 LPA. Strong in accounting, taxation, auditing.',
    modules:['market','comparison','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–9 LPA',change:'Entry level',up:true},
      {label:'With CA/CPA',value:'₹12–35 LPA',change:'Professional add-on',up:true},
      {label:'Taxation Roles',value:'+30% demand',change:'GST era',up:true},
      {label:'Duration',value:'3 Years',change:'BAF',up:true},
    ],
    charts:[
      {type:'bar',title:'BAF Career Salary by Role (₹LPA)',data:[{r:'Accountant',v:4.5},{r:'Auditor',v:6},{r:'Tax Consultant',v:8},{r:'Finance Analyst',v:9},{r:'BAF+CA',v:20}],dataKeys:[{key:'v',color:C.amber}],xKey:'r'},
      {type:'area',title:'GST & Taxation Jobs India (K)',data:[{y:'2021',v:22},{y:'2022',v:30},{y:'2023',v:40},{y:'2024',v:52},{y:'2025',v:66}],dataKeys:[{key:'v',color:C.gold}],xKey:'y'},
    ],
    notif:{title:'BAF Career Mapped',body:'GST era driving major demand for accounting & finance professionals.',type:'insight'},
  },

  banking_insurance: {
    summary:'BBA Banking & Insurance — IBPS, SBI PO, LIC AAO, private banking careers. Avg salary ₹4–14 LPA. India's banking sector adding 1 Lakh+ jobs/yr.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'SBI/IBPS PO',value:'₹8–12 LPA',change:'Govt bank',up:true},
      {label:'Insurance Growth',value:'+20% by 2027',change:'₹5Lakh Cr premium',up:true},
      {label:'Duration',value:'3 Years',change:'BBA Banking',up:true},
    ],
    charts:[
      {type:'bar',title:'Banking Career Salary (₹LPA)',data:[{r:'Bank Clerk',v:3.5},{r:'Bank PO',v:8},{r:'Branch Manager',v:15},{r:'Insurance AAO',v:9},{r:'Private Bank',v:12}],dataKeys:[{key:'v',color:C.blue}],xKey:'r'},
      {type:'area',title:'India Insurance Premium (₹ Lakh Cr)',data:[{y:'2022',v:2.2},{y:'2023',v:2.8},{y:'2024',v:3.5},{y:'2025',v:4.3},{y:'2026',v:5.2}],dataKeys:[{key:'v',color:C.sky}],xKey:'y'},
    ],
    notif:{title:'Banking & Insurance Mapped',body:'India's banking sector is one of the world's fastest growing.',type:'insight'},
  },

  bcom_llb: {
    summary:'B.Com LLB — 5 yr integrated. Best for taxation law, corporate finance law, GST litigation. Avg salary ₹6–25 LPA. CLAT entrance.',
    modules:['market','comparison','financial'],
    kpis:[
      {label:'Entrance',value:'CLAT / AILET',change:'5 yr integrated',up:true},
      {label:'Entry Salary',value:'₹6–15 LPA',change:'Commerce-law combo',up:true},
      {label:'Tax Law',value:'₹15–50 LPA',change:'Senior expert',up:true},
      {label:'Duration',value:'5 Years',change:'B.Com LLB',up:true},
    ],
    charts:[
      {type:'bar',title:'B.Com LLB Salary by Specialisation (₹LPA)',data:[{s:'Tax Law',v:18},{s:'GST Litigation',v:14},{s:'Banking Law',v:12},{s:'Corporate',v:16},{s:'Govt/Judiciary',v:9}],dataKeys:[{key:'v',color:C.amber}],xKey:'s'},
      {type:'area',title:'India Tax Litigation Market (₹ Cr)',data:[{y:'2021',v:6500},{y:'2022',v:8200},{y:'2023',v:10500},{y:'2024',v:13000},{y:'2025',v:16000}],dataKeys:[{key:'v',color:C.gold}],xKey:'y'},
    ],
    notif:{title:'B.Com LLB Mapped',body:'GST era = explosive demand for commerce-law professionals.',type:'insight'},
  },

  /* ═══ ARTS — GENERAL & MISSING ═══ */

  ba_general: {
    summary:'B.A. (General) — Most flexible undergraduate degree. UPSC, teaching, journalism, NGO, MBA. Avg salary ₹3–12 LPA depending on post-grad path.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹3–6 LPA',change:'Entry level',up:true},
      {label:'With UPSC/MBA',value:'₹12–40 LPA',change:'PG track',up:true},
      {label:'Flexibility',value:'Maximum',change:'100+ career paths',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. General',up:true},
    ],
    charts:[
      {type:'bar',title:'B.A. Graduate Career Salary (₹LPA)',data:[{p:'Teaching',v:4.5},{p:'UPSC/IAS',v:14},{p:'Journalism',v:7},{p:'MBA',v:14},{p:'NGO/Social',v:6}],dataKeys:[{key:'v',color:C.teal}],xKey:'p'},
      {type:'pie',title:'B.A. Graduates Career Paths',data:[{name:'UPSC/Govt',value:35},{name:'Teaching/Academia',value:28},{name:'Media/Journalism',value:17},{name:'MBA/PG',value:12},{name:'NGO/Social Work',value:8}],dataKeys:[{key:'value',color:C.cyan}],xKey:'name'},
    ],
    notif:{title:'B.A. General Mapped',body:'Most flexible degree — pairs well with UPSC or MBA for best ROI.',type:'insight'},
  },

  /* ═══ MEDIA — STANDALONE FIELDS ═══ */

  journalism: {
    summary:'Journalism — Digital media transformation. OTT, digital news, investigative journalism. Avg salary ₹3–20 LPA. Top journalists earn ₹30–80 LPA.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–10 LPA',change:'Entry level',up:true},
      {label:'Senior Journalist',value:'₹15–40 LPA',change:'Top media houses',up:true},
      {label:'Digital News',value:'+45% by 2026',change:'Print to digital',up:true},
      {label:'Duration',value:'3 Years',change:'B.A./B.J.M.C.',up:true},
    ],
    charts:[
      {type:'bar',title:'Journalism Salary by Medium (₹LPA)',data:[{m:'Print',v:5},{m:'Digital News',v:9},{m:'TV Journalism',v:10},{m:'Investigative',v:14},{m:'Podcast/YT',v:18}],dataKeys:[{key:'v',color:C.orange}],xKey:'m'},
      {type:'area',title:'India Digital News Market ($Mn)',data:[{y:'2021',v:380},{y:'2022',v:530},{y:'2023',v:720},{y:'2024',v:960},{y:'2025',v:1250}],dataKeys:[{key:'v',color:C.amber}],xKey:'y'},
    ],
    notif:{title:'Journalism Career Mapped',body:'Digital news consumption up 200% — strong journalist demand.',type:'insight'},
  },

  public_relations: {
    summary:'Public Relations (PR) — Corporate comm, brand PR, crisis management. Avg salary ₹3–18 LPA. FMCG, tech, politics driving demand.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹3–9 LPA',change:'Entry level',up:true},
      {label:'PR Manager',value:'₹10–22 LPA',change:'5+ yrs',up:true},
      {label:'PR Market India',value:'₹12,000 Cr+',change:'Growing 15%/yr',up:true},
      {label:'Duration',value:'3 Years',change:'BMS/BA Mass Comm',up:true},
    ],
    charts:[
      {type:'bar',title:'PR Career Salary by Role (₹LPA)',data:[{r:'PR Executive',v:4},{r:'PR Manager',v:12},{r:'Corporate Comm.',v:14},{r:'Crisis Specialist',v:18},{r:'PR Director',v:25}],dataKeys:[{key:'v',color:C.rose}],xKey:'r'},
      {type:'area',title:'India PR Industry Revenue (₹ Cr)',data:[{y:'2021',v:7500},{y:'2022',v:9000},{y:'2023',v:10800},{y:'2024',v:12500},{y:'2025',v:14800}],dataKeys:[{key:'v',color:C.pink}],xKey:'y'},
    ],
    notif:{title:'Public Relations Mapped',body:'Tech companies & political campaigns driving PR boom.',type:'insight'},
  },

  advertising: {
    summary:'Advertising — Creative strategy, digital ads, brand campaigns. India digital ad market $11Bn+. Avg salary ₹4–25 LPA. Copywriting + data skills = high value.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–10 LPA',change:'Entry level',up:true},
      {label:'Creative Director',value:'₹20–50 LPA',change:'8+ yrs',up:true},
      {label:'Digital Ad Spend',value:'$11Bn India',change:'2025 estimate',up:true},
      {label:'Duration',value:'3 Years',change:'BMM/Mass Comm',up:true},
    ],
    charts:[
      {type:'bar',title:'Advertising Career Salary (₹LPA)',data:[{r:'Copywriter',v:5},{r:'Art Director',v:8},{r:'Brand Manager',v:14},{r:'Creative Dir.',v:25},{r:'Digital Ads Mgr',v:18}],dataKeys:[{key:'v',color:C.orange}],xKey:'r'},
      {type:'area',title:'India Digital Ad Spend ($Bn)',data:[{y:'2021',v:4.2},{y:'2022',v:5.8},{y:'2023',v:7.4},{y:'2024',v:9.1},{y:'2025',v:11.2}],dataKeys:[{key:'v',color:C.amber}],xKey:'y'},
    ],
    notif:{title:'Advertising Career Mapped',body:'India digital ad spend doubling every 3 years.',type:'insight'},
  },

  /* ═══ LANGUAGES ═══ */

  english_literature: {
    summary:'English Literature — Teaching, content writing, publishing, civil services. Avg salary ₹3–15 LPA. Content economy booming with digital media.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'Content Writing',value:'₹6–18 LPA',change:'Digital economy',up:true},
      {label:'Academia/Teaching',value:'₹5–15 LPA',change:'UGC NET',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. English',up:true},
    ],
    charts:[
      {type:'bar',title:'English Lit. Career Salary (₹LPA)',data:[{c:'Content Writer',v:7},{c:'Copywriter',v:9},{c:'Editor',v:8},{c:'UGC/Teaching',v:6},{c:'UPSC/IAS',v:14}],dataKeys:[{key:'v',color:C.teal}],xKey:'c'},
      {type:'area',title:'India Content Writing Market ($Mn)',data:[{y:'2021',v:380},{y:'2022',v:560},{y:'2023',v:790},{y:'2024',v:1080},{y:'2025',v:1430}],dataKeys:[{key:'v',color:C.cyan}],xKey:'y'},
    ],
    notif:{title:'English Literature Mapped',body:'Content economy boom making English grads highly employable.',type:'insight'},
  },

  hindi_literature: {
    summary:'Hindi Literature — Teaching, Doordarshan/news, content, UPSC, film industry. Avg salary ₹3–12 LPA. UGC NET opens academic track.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹3–7 LPA',change:'Entry level',up:true},
      {label:'Govt/Teaching',value:'₹5–14 LPA',change:'UGC NET',up:true},
      {label:'Hindi Content',value:'800Mn+ readers',change:'Massive market',up:true},
      {label:'Duration',value:'3 Years',change:'B.A. Hindi',up:true},
    ],
    charts:[
      {type:'bar',title:'Hindi Career Salary (₹LPA)',data:[{c:'Hindi Teacher',v:5},{c:'Journalist',v:7},{c:'Govt Translation',v:8},{c:'Film Writer',v:12},{c:'Content Creator',v:10}],dataKeys:[{key:'v',color:C.amber}],xKey:'c'},
      {type:'pie',title:'Hindi Graduate Career Paths',data:[{name:'Teaching/Academia',value:40},{name:'Journalism/Media',value:25},{name:'Govt/Translation',value:20},{name:'Film/OTT',value:15}],dataKeys:[{key:'value',color:C.orange}],xKey:'name'},
    ],
    notif:{title:'Hindi Literature Mapped',body:'800Mn Hindi speakers = massive content demand across platforms.',type:'insight'},
  },

  foreign_languages: {
    summary:'Foreign Languages (French/German/Japanese/Chinese/Spanish) — Interpreter, MNC, diplomat, tourism. Avg salary ₹4–25 LPA. Japanese & German highest paying.',
    modules:['market','strategy','forecast'],
    kpis:[
      {label:'Avg Salary',value:'₹4–12 LPA',change:'Entry level',up:true},
      {label:'MNC Translator',value:'₹10–25 LPA',change:'Japanese/German',up:true},
      {label:'Diplomatic Track',value:'IFS exam',change:'Prestigious',up:true},
      {label:'Duration',value:'3–4 Years',change:'B.A. Languages',up:true},
    ],
    charts:[
      {type:'bar',title:'Foreign Language Salary by Language (₹LPA)',data:[{l:'French',v:9},{l:'German',v:12},{l:'Japanese',v:15},{l:'Mandarin',v:14},{l:'Spanish',v:8}],dataKeys:[{key:'v',color:C.purple}],xKey:'l'},
      {type:'area',title:'Language Services Market India ($Mn)',data:[{y:'2021',v:640},{y:'2022',v:820},{y:'2023',v:1050},{y:'2024',v:1310},{y:'2025',v:1620}],dataKeys:[{key:'v',color:C.violet}],xKey:'y'},
    ],
    notif:{title:'Foreign Languages Mapped',body:'Japanese & German highest paying — MNC demand strong.',type:'insight'},
  },

  /* ═══ COMPUTER & IT — STANDALONE ═══ */

  web_development: {
    summary:'Web Development (Full Stack / Frontend / Backend) — Highest freelance potential. Avg salary ₹4–30 LPA. 1.7 Bn websites globally. India top 3 in global IT services.',
    modules:['market','forecast','comparison'],
    kpis:[
      {label:'Avg Salary',value:'₹4–15 LPA',change:'Entry level',up:true},
      {label:'Senior Full Stack',value:'₹20–45 LPA',change:'5+ yrs',up:true},
      {label:'Freelance',value:'$30–150/hr',change:'Global clients',up:true},
      {label:'Duration',value:'6 Mo–2 Yrs',change:'Bootcamp/Degree',up:true},
    ],
    charts:[
      {type:'bar',title:'Web Dev Salary by Stack (₹LPA)',data:[{s:'Frontend',v:8},{s:'Backend',v:10},{s:'Full Stack',v:14},{s:'React/Next.js',v:16},{s:'DevOps',v:18}],dataKeys:[{key:'v',color:C.blue}],xKey:'s'},
      {type:'area',title:'Web Dev Jobs India (K)',data:[{y:'2022',v:120},{y:'2023',v:155},{y:'2024',v:195},{y:'2025',v:240},{y:'2026',v:295}],dataKeys:[{key:'v',color:C.sky}],xKey:'y'},
    ],
    notif:{title:'Web Development Mapped',body:'React/Next.js + DevOps = highest paying web dev stack.',type:'insight'},
  },

  cyber_security_courses: {
    summary:'Cyber Security Courses (CEH/OSCP/CompTIA) — India faces 3,000+ attacks/day. Certified professionals earn ₹8–40 LPA. Skill-based courses fastest ROI.',
    modules:['market','risk','forecast'],
    kpis:[
      {label:'Entry Salary',value:'₹8–15 LPA',change:'With certification',up:true},
      {label:'Senior Analyst',value:'₹20–45 LPA',change:'CISSP/OSCP',up:true},
      {label:'Key Certifications',value:'CEH/OSCP/CISSP',change:'Industry standard',up:true},
      {label:'Duration',value:'3–12 Months',change:'Certification',up:true},
    ],
    charts:[
      {type:'bar',title:'Cyber Security Cert Salary (₹LPA)',data:[{c:'CEH',v:10},{c:'CompTIA Sec+',v:9},{c:'OSCP',v:18},{c:'CISSP',v:25},{c:'AWS Security',v:20}],dataKeys:[{key:'v',color:C.rose}],xKey:'c'},
      {type:'area',title:'India Cybersecurity Market ($Bn)',data:[{y:'2022',v:3.5},{y:'2023',v:4.7},{y:'2024',v:6.1},{y:'2025',v:7.9},{y:'2026',v:10.2}],dataKeys:[{key:'v',color:C.red}],xKey:'y'},
    ],
    notif:{title:'Cyber Security Courses Mapped',body:'Certified security pros = fastest salary growth in tech India.',type:'insight'},
  },

  data_analytics: {
    summary:'Data Analytics (standalone courses/degree) — SQL, Power BI, Tableau, Python. Entry ₹5–12 LPA. India's fastest-hired skill set in 2024–25.',
    modules:['market','forecast','strategy'],
    kpis:[
      {label:'Entry Salary',value:'₹5–10 LPA',change:'With portfolio',up:true},
      {label:'Senior Analyst',value:'₹15–28 LPA',change:'3–5 yrs',up:true},
      {label:'Demand Growth',value:'+55% by 2027',change:'Data boom',up:true},
      {label:'Duration',value:'3–12 Months',change:'Course/BCA/BSc',up:true},
    ],
    charts:[
      {type:'bar',title:'Data Analytics Salary by Tool Stack (₹LPA)',data:[{s:'Excel/SQL',v:6},{s:'Power BI',v:9},{s:'Tableau',v:10},{s:'Python+SQL',v:14},{s:'ML+Analytics',v:22}],dataKeys:[{key:'v',color:C.cyan}],xKey:'s'},
      {type:'area',title:'Data Analytics Jobs India (K)',data:[{y:'2022',v:48},{y:'2023',v:72},{y:'2024',v:108},{y:'2025',v:155},{y:'2026',v:215}],dataKeys:[{key:'v',color:C.teal}],xKey:'y'},
    ],
    notif:{title:'Data Analytics Mapped',body:'Most in-demand skill across banking, retail, and tech sectors.',type:'insight'},
  },

  /* ═══ GOVERNMENT & DEFENCE — CIVIL SERVICES PREP ═══ */

  civil_services_prep: {
    summary:'Civil Services Preparation (IAS/IPS/IFS) — India's most prestigious career track. 1.3M+ applicants for ~900 posts. Salary ₹56K–2.5L/mo + pension + perks for life.',
    modules:['market','strategy','comparison'],
    kpis:[
      {label:'Total Vacancies',value:'~900/year',change:'All India Services',up:true},
      {label:'Applicants',value:'1.3 Mn+',change:'Per cycle',up:false},
      {label:'IAS Salary',value:'₹56K–2.5L/mo',change:'Grade pay + DA',up:true},
      {label:'Avg Prep Time',value:'1–4 Years',change:'Coaching optional',up:true},
    ],
    charts:[
      {type:'bar',title:'Civil Services Salary by Post (₹K/mo)',data:[{p:'IAS (SDM)',v:56},{p:'IAS (DM)',v:90},{p:'IAS (Secy)',v:150},{p:'IPS (SP)',v:65},{p:'IFS (Amb.)',v:180}],dataKeys:[{key:'v',color:C.violet}],xKey:'p'},
      {type:'pie',title:'UPSC Qualifiers — Educational Background',data:[{name:'Engineering',value:48},{name:'Humanities',value:28},{name:'Science',value:14},{name:'Commerce',value:10}],dataKeys:[{key:'value',color:C.indigo}],xKey:'name'},
    ],
    notif:{title:'Civil Services Prep Mapped',body:'Engineering grads dominate IAS every year — all streams eligible.',type:'insight'},
  },



};
