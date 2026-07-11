import { motion } from 'motion/react';
import { Brain, Search, Sparkles, ArrowRight, GraduationCap, Compass } from 'lucide-react';
import type { Page } from '../App';

interface LandingChoiceProps {
  onNavigate: (page: Page) => void;
}

export function LandingChoice({ onNavigate }: LandingChoiceProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden px-6">

      {/* Ambient background glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating particles */}
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/10"
          style={{
            left: `${8 + (i * 5.2) % 86}%`,
            top: `${10 + (i * 7.3) % 80}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">

        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-700/60 rounded-full px-4 py-2 mb-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[12px] text-zinc-400 font-medium tracking-wide">AI-Powered Career & Education Intelligence</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-[3.8rem] lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight mb-6 text-white"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }}>
          Your Future Starts<br />
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            With One Choice
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-[17px] text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          Whether you want to discover your ideal career path from your personal journey,
          or explore and compare education fields — CideDec has your answer.
        </motion.p>

        {/* Two Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.6 }}>

          {/* Card 1 — Analyse Yourself */}
          <motion.button
            onClick={() => onNavigate('journey')}
            className="group relative text-left bg-zinc-900/60 border border-zinc-700/50 rounded-3xl p-8 overflow-hidden backdrop-blur-sm hover:border-violet-500/50 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}>

            {/* Card glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-violet-600/0 group-hover:from-violet-600/10 group-hover:to-blue-600/5 transition-all duration-500 rounded-3xl" />

            {/* Top accent line */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:bg-violet-500/25 group-hover:border-violet-500/40 transition-all duration-300">
                <Brain className="w-7 h-7 text-violet-400" />
              </div>

              {/* Label */}
              <div className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-4">
                <Compass className="w-3 h-3 text-violet-400" />
                <span className="text-[11px] text-violet-400 font-semibold uppercase tracking-wider">Self Discovery</span>
              </div>

              <h2 className="text-[22px] font-bold text-white mb-3 leading-tight">
                Analyse<br />Yourself
              </h2>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-6">
                Tell us your journey till Class 12 — your interests, habits, strengths, and personality.
                Our AI will map your ideal career path, compatible courses, and future potential.
              </p>

              {/* Features list */}
              <ul className="space-y-2 mb-7">
                {['Personality & thinking style analysis', 'Career compatibility prediction', 'Personalized roadmap + courses', 'Future self simulation'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[12px] text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-[13px] font-semibold text-violet-400 group-hover:gap-3 transition-all duration-200">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>

          {/* Card 2 — Explore Education Fields */}
          <motion.button
            onClick={() => onNavigate('home')}
            className="group relative text-left bg-zinc-900/60 border border-zinc-700/50 rounded-3xl p-8 overflow-hidden backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}>

            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-emerald-600/0 group-hover:from-emerald-600/8 group-hover:to-blue-600/5 transition-all duration-500 rounded-3xl" />
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:bg-emerald-500/25 group-hover:border-emerald-500/40 transition-all duration-300">
                <Search className="w-7 h-7 text-emerald-400" />
              </div>

              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-4">
                <GraduationCap className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Field Explorer</span>
              </div>

              <h2 className="text-[22px] font-bold text-white mb-3 leading-tight">
                Search Education<br />Fields
              </h2>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-6">
                Explore, compare, and analyze any education field. Get market trends, ROI, career scope,
                bias insights, and 5-year forecasts for any discipline.
              </p>

              <ul className="space-y-2 mb-7">
                {['Compare education fields side by side', 'Market trends & career scope', '5-year forecast & ROI analysis', 'AI-powered bias detection'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[12px] text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-400 group-hover:gap-3 transition-all duration-200">
                Explore Fields <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="text-[12px] text-zinc-600 mt-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          Powered by CideDec AI · Emotion-Aware · Bias-Detected · 5-Year Forecasting
        </motion.p>
      </div>
    </div>
  );
}
