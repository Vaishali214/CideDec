import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, EyeIcon, EyeOffIcon, Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { useApp } from '../AppContext';

interface SearchAuthModalProps {
  pendingQuery: string;
  onClose: () => void;
  onAuthSuccess: (query: string) => void;
}

export function SearchAuthModal({ pendingQuery, onClose, onAuthSuccess }: SearchAuthModalProps) {
  const { login, register } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  /* Sign-in fields */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /* Sign-up — minimal fields */
  const [signupName,     setSignupName]     = useState('');
  const [signupEmail,    setSignupEmail]    = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const switchMode = (m: 'signin' | 'signup') => { setMode(m); setError(''); setShowPw(false); };

  /* ── Sign In ── */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { setError('Enter your email or username'); return; }
    if (!password)        { setError('Enter password'); return; }
    setError(''); setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (!result.ok) { setError(result.error ?? 'Login failed'); return; }
    onAuthSuccess(pendingQuery);
  };

  /* ── Sign Up ── */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim())  { setError('Enter your name'); return; }
    if (!signupEmail.trim()) { setError('Enter your email'); return; }
    if (!signupPassword || signupPassword.length < 4) { setError('Password min 4 chars'); return; }
    setError(''); setLoading(true);
    const uname = signupEmail.split('@')[0] || signupName.toLowerCase().replace(/\s/g, '');
    const result = await register({ username: uname, email: signupEmail.trim(), fullName: signupName.trim(), password: signupPassword });
    setLoading(false);
    if (!result.ok) { setError(result.error ?? 'Registration failed'); return; }
    onAuthSuccess(pendingQuery);
  };

  return (
    <motion.div className="fixed inset-0 z-[980] flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Backdrop */}
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

      {/* Modal */}
      <motion.div className="relative z-10 w-full max-w-[400px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} className="absolute right-3 top-3 z-20 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pt-7 pb-4 px-7 text-center">
          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-3 border border-zinc-700">
            <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
              <path d="M8 20V12C8 10.9 8.9 10 10 10H15.5C17.43 10 19 11.57 19 13.5C19 15.43 17.43 17 15.5 17H10V20" stroke="white" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="20" r="1.2" fill="white"/>
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-white">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-[13px] text-zinc-500 mt-1">
            {mode === 'signin' ? 'Sign in to access AI analytics' : 'Get started in seconds'}
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div className="mx-7 mb-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <p className="text-[12px] text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forms */}
        <div className="px-7 pb-5">
          <AnimatePresence mode="wait">
            {mode === 'signin' ? (
              <motion.form key="signin" onSubmit={handleSignIn} className="space-y-3"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>

                <div>
                  <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5 block">Email or Username</label>
                  <input type="text" value={username} onChange={e => { setUsername(e.target.value); setError(''); }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                    placeholder="you@example.com or username" autoComplete="username" autoFocus />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5 block">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 pr-10 text-[13px] text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                      placeholder="Password" autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      {showPw ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                    </button>
                  </div>
                </div>

                {/* Quick hint */}
                <p className="text-[10px] text-zinc-600 text-center">
                  Sign in with your email or username
                </p>

                <motion.button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                  whileTap={{ scale: 0.98 }}>
                  {loading ? <span className="flex items-center justify-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</span> : 'Sign In'}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form key="signup" onSubmit={handleSignUp} className="space-y-3"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>

                <div>
                  <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input type="text" value={signupName} onChange={e => { setSignupName(e.target.value); setError(''); }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                    placeholder="Your name" />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5 block">Email</label>
                  <input type="email" value={signupEmail} onChange={e => { setSignupEmail(e.target.value); setError(''); }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                    placeholder="you@example.com" />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5 block">Password</label>
                  <input type="password" value={signupPassword} onChange={e => { setSignupPassword(e.target.value); setError(''); }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                    placeholder="Min 4 characters" />
                </div>

                <motion.button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                  whileTap={{ scale: 0.98 }}>
                  {loading ? <span className="flex items-center justify-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : 'Create Account'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer toggle */}
        <div className="border-t border-zinc-800 py-3 text-center">
          <p className="text-[13px] text-zinc-500">
            {mode === 'signin' ? (
              <>New here? <button onClick={() => switchMode('signup')} className="text-white font-medium hover:underline">Sign up</button></>
            ) : (
              <>Have an account? <button onClick={() => switchMode('signin')} className="text-white font-medium hover:underline">Sign in</button></>
            )}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
