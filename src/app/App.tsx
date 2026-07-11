import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
import { HomePage }           from './components/HomePage';
import { Navigation }         from './components/Navigation';

// Eagerly loaded (critical path - always visible)
const LandingChoice    = lazy(() => import('./pages/LandingChoice').then(m => ({ default: m.LandingChoice })));
const StudentJourneyPage = lazy(() => import('./pages/StudentJourneyPage').then(m => ({ default: m.StudentJourneyPage })));

// Lazy loaded (auth-gated pages - only load after sign in)
const SmartSuggestions   = lazy(() => import('./components/SmartSuggestions').then(m => ({ default: m.SmartSuggestions })));
const Dashboard          = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const MarketAnalysis     = lazy(() => import('./pages/MarketAnalysis').then(m => ({ default: m.MarketAnalysis })));
const FinancialAnalysis  = lazy(() => import('./pages/FinancialAnalysis').then(m => ({ default: m.FinancialAnalysis })));
const Comparison         = lazy(() => import('./pages/Comparison').then(m => ({ default: m.Comparison })));
const AIInsights         = lazy(() => import('./pages/AIInsights').then(m => ({ default: m.AIInsights })));
const MyProfile          = lazy(() => import('./pages/MyProfile').then(m => ({ default: m.MyProfile })));
const PrivacySecurity    = lazy(() => import('./pages/PrivacySecurity').then(m => ({ default: m.PrivacySecurity })));
const SettingsPanel      = lazy(() => import('./pages/SettingsPanel').then(m => ({ default: m.SettingsPanel })));
const ATSIntelligence    = lazy(() => import('./pages/ATSIntelligence').then(m => ({ default: m.ATSIntelligence })));

export type Page =
  | 'home' | 'dashboard' | 'market' | 'financial'
  | 'comparison' | 'insights' | 'profile' | 'privacy' | 'ats'
  | 'choice' | 'journey';

// Minimal full-screen spinner shown during lazy chunk loading
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
    </div>
  );
}

function AppShell() {
  const { isAuthenticated, logout, isSignedOut, cancelSignOut, lastQuery, setPendingQuery } = useApp();
  const [currentPage,   setCurrentPage]   = useState<Page>('choice');
  const [showSettings,  setShowSettings]  = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleConfirmSignOut = () => { cancelSignOut(); logout(); };

  const guardedNavigate = (page: Page) => {
    const publicPages: Page[] = ['home', 'choice', 'journey'];
    if (!publicPages.includes(page) && !isAuthenticated) return;
    setCurrentPage(page);
  };

  const homePageFallback = (
    <HomePage
      onNavigate={guardedNavigate}
      onOpenAuthModal={() => { setPendingQuery(''); setShowAuthModal(true); }}
    />
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'choice':     return <LandingChoice onNavigate={guardedNavigate} />;
      case 'journey':    return <StudentJourneyPage onNavigate={guardedNavigate} />;
      case 'home':       return homePageFallback;
      case 'dashboard':  return isAuthenticated ? <Dashboard onNavigate={guardedNavigate} /> : homePageFallback;
      case 'market':     return isAuthenticated ? <MarketAnalysis onNavigate={guardedNavigate} /> : homePageFallback;
      case 'financial':  return isAuthenticated ? <FinancialAnalysis onNavigate={guardedNavigate} /> : homePageFallback;
      case 'comparison': return isAuthenticated ? <Comparison onNavigate={guardedNavigate} /> : homePageFallback;
      case 'insights':   return isAuthenticated ? <SmartSuggestions onNavigate={guardedNavigate} /> : homePageFallback;
      case 'profile':    return isAuthenticated ? <MyProfile onNavigate={guardedNavigate} /> : homePageFallback;
      case 'privacy':    return isAuthenticated ? <PrivacySecurity onNavigate={guardedNavigate} /> : homePageFallback;
      case 'ats':        return isAuthenticated ? <ATSIntelligence onNavigate={guardedNavigate} /> : homePageFallback;
      default:           return homePageFallback;
    }
  };

  return (
    <div className="size-full flex flex-col bg-[#0a0a0a]">
      <Navigation
        currentPage={currentPage}
        onNavigate={guardedNavigate}
        onOpenSettings={() => guardedNavigate('privacy')}
        onOpenAuthModal={() => { setPendingQuery(''); setShowAuthModal(true); }}
        showAuthModal={showAuthModal}
        onCloseAuthModal={() => setShowAuthModal(false)}
      />
      <div className="flex-1 overflow-auto h-full">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </div>

      {/* Settings panel */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {showSettings && isAuthenticated && (
            <SettingsPanel
              onClose={() => setShowSettings(false)}
              onNavigate={(p) => { setCurrentPage(p); setShowSettings(false); }}
            />
          )}
        </AnimatePresence>
      </Suspense>

      {/* Sign-out confirmation overlay */}
      <AnimatePresence>
        {isSignedOut && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
              initial={{ scale: 0.9, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-4.5 h-4.5 text-zinc-400" />
              </div>
              <h2 className="text-[16px] font-bold text-white mb-2">Sign out of CideDec?</h2>

              {lastQuery && (
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 mb-4">
                  <p className="text-[11px] text-zinc-500 mb-0.5">Your last query was saved:</p>
                  <p className="text-[12px] font-semibold text-zinc-300 truncate">"{lastQuery}"</p>
                </div>
              )}

              <p className="text-[12px] text-zinc-500 mb-6 leading-relaxed">
                Your session will end securely. Analytics history and settings are preserved.
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={cancelSignOut}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-800 text-[13px] font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Stay
                </motion.button>
                <motion.button
                  onClick={handleConfirmSignOut}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-[13px] font-medium transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
