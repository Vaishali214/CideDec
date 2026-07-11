import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, Sparkles, X, Bot, User, BookOpen, GraduationCap, BarChart3, Lightbulb } from 'lucide-react';
import type { Suggestion } from './SmartSuggestions';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  chips?: string[];
  timestamp: Date;
}

interface AISearchChatProps {
  suggestions: Suggestion[];
}

const quickPrompts = [
  { label: 'Computer Science', icon: BarChart3, query: 'Show insights for Computer Science education field' },
  { label: 'Mathematics', icon: GraduationCap, query: 'Show insights for Mathematics education field' },
  { label: 'Data Science & AI', icon: Lightbulb, query: 'Show insights for Data Science and AI education field' },
  { label: 'Medical & Health', icon: BookOpen, query: 'Show insights for Medical and Health education field' },
  { label: 'Business & MBA', icon: BarChart3, query: 'Show insights for Business and MBA education field' },
  { label: 'Engineering', icon: GraduationCap, query: 'Show insights for Engineering education field' },
];

const analyticsResponses: Record<string, { content: string; chips?: string[] }> = {
  roi: {
    content: "📈 Marketing ROI Analysis: Your edtech platform's 3-year projected ROI is 194% on a ₹800L campaign investment. Year 1 returns ₹320L (40%), Year 2 ₹560L (70%), Year 3 ₹960L (120%). Student acquisition cost (SAC) = ₹1,200 — 18% below industry average. Break-even: 2.2 years. Highest-performing channel: YouTube + SEO (ROI 3.8x).",
    chips: ['Channel Breakdown', 'SAC Trends', 'Campaign Performance'],
  },
  market: {
    content: "🌐 EdTech Market Intelligence: India's EdTech TAM = ₹7,500Cr growing at 28.6% CAGR. AI-powered learning segment growing fastest at 41% YoY. K-12 online tuition leads with 38% share, followed by skill-based upskilling at 27%. Key opportunity: vernacular language content — only 12% of platforms serve non-English learners. Your NPS: 74 vs industry avg 58.",
    chips: ['Segment Analysis', 'Vernacular Opportunity', 'Competitor Map'],
  },
  risk: {
    content: "🛡 Education Platform Risk Score: 34/100 (Low–Moderate). Breakdown: Content Quality Consistency 58 (High — needs QA automation), Regulatory/NEP Compliance 44 (Moderate), Student Retention 39, Teacher Supply Risk 51. Lowest risk: Payment Infrastructure at 16/100. Primary recommendation: implement AI-based content audit pipeline.",
    chips: ['Full Risk Report', 'Compliance Checklist', 'Retention Strategy'],
  },
  strategy: {
    content: "🧠 #1 Strategic Recommendation: Launch AI-Personalized Learning Paths. AI confidence: 91%. Opportunity: 63% of students drop courses due to one-size-fits-all content. Adaptive learning reduces dropout by 47% and improves completion rates to 82%. Projected uplift: +₹52L/month ARR within 12 months. Integrate with existing LMS in 6–8 weeks.",
    chips: ['Implementation Plan', 'Personalization Engine', 'AI Insights'],
  },
  sales: {
    content: "📊 5-Year Sales Forecast (EdTech): Year 1: ₹48Cr | Year 2: ₹81Cr (+69%) | Year 3: ₹128Cr (+58%) | Year 4: ₹189Cr (+48%) | Year 5: ₹264Cr (+40%). Drivers: rising internet penetration in Tier 2/3 cities, NEP 2020 digital push, corporate L&D adoption. Subscription model projected to contribute 72% of revenue by Year 5.",
    chips: ['Revenue Model', 'Growth Drivers', 'Cohort Forecast'],
  },
  bias: {
    content: "⚖️ Bias Detection in Education Data: Key bias types found — Representation Bias (rural students underrepresented at 11% vs 40% of target population), Algorithmic Bias (recommendation engine favors English-medium content 3.2x), Assessment Bias (MCQ format disadvantages visual learners). Recommended fixes: diverse training data, fairness-aware ML models, multi-modal assessments.",
    chips: ['Bias Audit Report', 'Fairness Metrics', 'Dataset Diversity'],
  },
  curriculum: {
    content: "📚 Curriculum Intelligence: Top-performing courses by completion rate — Data Science (84%), Digital Marketing (79%), Python Basics (91%). Weakest: Financial Modelling (38%) — needs video refresh + mentorship. Skill gap analysis shows: Cloud Computing, Prompt Engineering, and UI/UX Design are most searched but least available on your platform.",
    chips: ['Course Analytics', 'Skill Gap Report', 'Content Roadmap'],
  },
  student: {
    content: "🎓 Student Engagement Dashboard: DAU/MAU ratio = 0.38 (healthy). Avg session duration: 24.6 mins (+8% MoM). Drop-off hotspot: Week 3 of long-form courses (42% churn). Top engagement driver: live doubt-solving sessions (94% satisfaction). Cohort analysis shows students who join study groups have 2.7x better completion rates.",
    chips: ['Engagement Heatmap', 'Dropout Analysis', 'Cohort Study'],
  },
  teacher: {
    content: "👩‍🏫 Educator Performance Insights: Top 10% of instructors drive 68% of course completions. Avg instructor rating: 4.3/5. Key differentiator for high-rated teachers: responsiveness to queries (<2hr reply time) + weekly live sessions. Recommendation: introduce 'Mentor Score' badge and tiered revenue sharing to retain top educators.",
    chips: ['Instructor Leaderboard', 'Quality Standards', 'Revenue Share Model'],
  },
};

function generateAIResponse(query: string): { content: string; chips?: string[] } {
  const q = query.toLowerCase();
  if (q.includes('roi') || q.includes('return') || q.includes('marketing') || q.includes('campaign')) return analyticsResponses.roi;
  if (q.includes('market') || q.includes('trend') || q.includes('tam') || q.includes('edtech')) return analyticsResponses.market;
  if (q.includes('risk') || q.includes('score') || q.includes('bias detection') || q.includes('compliance')) return analyticsResponses.risk;
  if (q.includes('strategy') || q.includes('recommend') || q.includes('personali') || q.includes('top')) return analyticsResponses.strategy;
  if (q.includes('sales') || q.includes('predict') || q.includes('forecast') || q.includes('5 year') || q.includes('revenue')) return analyticsResponses.sales;
  if (q.includes('bias') || q.includes('fair') || q.includes('diversity') || q.includes('represent')) return analyticsResponses.bias;
  if (q.includes('curriculum') || q.includes('course') || q.includes('content') || q.includes('skill gap')) return analyticsResponses.curriculum;
  if (q.includes('student') || q.includes('engagement') || q.includes('dropout') || q.includes('completion')) return analyticsResponses.student;
  if (q.includes('teacher') || q.includes('instructor') || q.includes('educator') || q.includes('mentor')) return analyticsResponses.teacher;
  return {
    content: "🎓 EduAI here! I can provide instant insights on: marketing ROI, edtech market trends, sales forecasts, bias detection, curriculum gaps, student engagement, and instructor performance. What would you like to explore? Try asking about market trends in AI, how to detect bias in data, or predicting sales for the next 5 years.",
    chips: ['Analyze marketing ROI', 'Market trends in AI', 'Predict sales next 5 years', 'Detect bias in data'],
  };
}

export function AISearchChat({ suggestions: _suggestions }: AISearchChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) inputRef.current.focus();
  }, [isExpanded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msgText = text || query;
    if (!msgText.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, type: 'user', content: msgText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);
    setIsExpanded(true);
    setTimeout(() => {
      const resp = generateAIResponse(msgText);
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, type: 'ai', content: resp.content, chips: resp.chips, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Search Bar */}
      <motion.div className="relative" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-white/85 backdrop-blur-lg border border-white/50 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <Search className="w-5 h-5 text-blue-500 shrink-0" />
            <input ref={inputRef} type="text" value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              onFocus={() => setIsExpanded(true)}
              placeholder="Ask anything — marketing ROI, market trends, risk score..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm" />
            <AnimatePresence>
              {query && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  onClick={() => handleSend()}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all">
                  <Send className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
          </div>
        </div>
      </motion.div>

      {/* Quick Prompt Pills */}
      <motion.div className="mt-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <span className="text-xs text-gray-400 font-medium">Try:</span>
        {quickPrompts.map((p) => {
          const PIcon = p.icon;
          return (
            <motion.button key={p.label} onClick={() => handleSend(p.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 border border-gray-200/70 rounded-full text-xs font-medium text-gray-600 hover:bg-white hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <PIcon className="w-3 h-3" />{p.label}
            </motion.button>
          );
        })}
        </div>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isExpanded && messages.length > 0 && (
          <motion.div className="absolute top-full left-0 right-0 mt-3 z-50"
            initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/92 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">EduAI Assistant</p>
                      <p className="text-xs text-gray-400">Education intelligence platform</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
                    <button onClick={() => { setIsExpanded(false); setMessages([]); }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="px-5 py-4 max-h-80 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', damping: 20 }}
                      className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-2 rounded-xl shrink-0 ${msg.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-100'}`}>
                        {msg.type === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <div className={`flex flex-col flex-1 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[88%] ${msg.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-50 text-gray-800 border border-gray-100'}`}>
                          {msg.content}
                        </div>
                        {msg.type === 'ai' && msg.chips && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {msg.chips.map((chip) => (
                              <span key={chip} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="text-xs text-gray-400 mt-1 px-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </motion.div>
                  ))}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div className="flex gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="p-2 rounded-xl bg-gray-100"><Bot className="w-3.5 h-3.5 text-blue-600" /></div>
                        <div className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex gap-1">
                            {[0, 0.2, 0.4].map((d, i) => (
                              <motion.div key={i} className="w-2 h-2 rounded-full bg-gray-400"
                                animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>

                {/* Bottom input strip */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex gap-2">
                    <input value={query} onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                      placeholder="Ask a follow-up about education..."
                      className="flex-1 text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 text-gray-700 placeholder:text-gray-400" />
                    <motion.button onClick={() => handleSend()}
                      className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
