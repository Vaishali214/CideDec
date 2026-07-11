import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, LogOut, Bell, ChevronDown, Lock,
  Shield, Settings, Zap, CheckCheck, Info, AlertCircle, Lightbulb, Compass, Brain,
} from 'lucide-react';
import { useApp } from '../AppContext';
import { SearchAuthModal } from './SearchAuthModal';
import type { Page } from '../App';

interface NavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenSettings: () => void;
  onOpenAuthModal?: () => void;
  showAuthModal?: boolean;
  onCloseAuthModal?: () => void;
}

const notifIconMap = { insight: Zap, alert: AlertCircle, update: Info, success: CheckCheck } as const;
const notifColorMap = {
  insight: 'text-zinc-300 bg-zinc-800',
  alert:   'text-zinc-300 bg-zinc-800',
  update:  'text-zinc-300 bg-zinc-800',
  success: 'text-zinc-300 bg-zinc-800',
} as const;

const NAV_LINKS: { label: string; page: Page; icon?: typeof Compass }[] = [
  { label: 'Self Discovery', page: 'journey', icon: Brain },
  { label: 'Field Explorer', page: 'insights', icon: Compass },
  { label: 'ATS Intelligence', page: 'ats', icon: Lightbulb },
];

export function Navigation({
  currentPage, onNavigate, onOpenSettings,
  onOpenAuthModal, showAuthModal = false, onCloseAuthModal,
}: NavProps) {
  const { notifications, unreadCount, markAllRead, signOut, currentUser, isAuthenticated, setPendingQuery } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen,    setBellOpen]    = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const bellRef    = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (bellRef.current    && !bellRef.current.contains(e.target as Node))    setBellOpen(false);
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) setResourcesOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initials = currentUser?.fullName
    ? currentUser.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="w-full px-8 lg:px-16">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <motion.button
              className="flex items-center gap-3 select-none group"
              onClick={() => onNavigate('choice' as Page)}
              whileTap={{ scale: 0.97 }}>
              <div className="w-8 h-8 shrink-0">
                <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                  <rect width="32" height="32" rx="8" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
                  <path d="M9 23V14C9 12.9 9.9 12 11 12H17C19.21 12 21 13.79 21 16C21 18.21 19.21 20 17 20H11V23"
                    stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="23" r="1.3" fill="white"/>
                </svg>
              </div>
              <span className="font-semibold text-[18px] tracking-[-0.03em] text-white group-hover:text-zinc-300 transition-colors">
                CideDec
              </span>
            </motion.button>

            {/* Center Nav Links — only visible when signed in on data pages */}
            <div className={`hidden ${isAuthenticated && !['home','profile','privacy'].includes(currentPage) ? 'md:flex' : ''} items-center gap-1`}>
              {NAV_LINKS.map(link => {
                const isActive = currentPage === link.page;
                const isProtected = link.page !== 'home';
                return (
                  <motion.button key={link.page}
                    onClick={() => {
                      if (isProtected && !isAuthenticated) {
                        setPendingQuery('');
                        onOpenAuthModal?.();
                        return;
                      }
                      onNavigate(link.page);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                    whileTap={{ scale: 0.97 }}>
                    {link.icon && <link.icon className="w-3.5 h-3.5" />}
                    {link.label}
                  </motion.button>
                );
              })}


            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">

              {/* Bell */}
              {isAuthenticated && (
                <div className="relative" ref={bellRef}>
                  <motion.button
                    onClick={() => { setBellOpen(v => !v); setProfileOpen(false); }}
                    className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                      bellOpen ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/60'
                    }`}
                    whileTap={{ scale: 0.94 }}>
                    <Bell className="w-[16px] h-[16px]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-[8px] right-[8px] w-[6px] h-[6px] bg-white rounded-full ring-[1.5px] ring-[#0a0a0a]" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {bellOpen && (
                      <motion.div
                        className="absolute right-0 top-[calc(100%+8px)] w-[340px] bg-zinc-900 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-zinc-800 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}>

                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold text-white">Notifications</p>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.5 bg-white text-black text-[9px] font-bold rounded-full tabular-nums">{unreadCount}</span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-[11px] text-zinc-500 font-medium hover:text-white transition-colors">
                              Mark read
                            </button>
                          )}
                        </div>

                        <div className="max-h-[260px] overflow-y-auto">
                          {notifications.map((n, idx) => {
                            const NIcon = notifIconMap[n.type];
                            return (
                              <motion.div key={n.id}
                                className={`flex gap-3 px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-800/40 cursor-pointer transition-colors ${!n.read ? 'bg-zinc-800/20' : ''}`}
                                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.04 }}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${notifColorMap[n.type]}`}>
                                  <NIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-1">
                                    <p className={`text-[12px] font-semibold leading-snug ${!n.read ? 'text-white' : 'text-zinc-500'}`}>{n.title}</p>
                                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1" />}
                                  </div>
                                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{n.body}</p>
                                  <p className="text-[10px] text-zinc-600 mt-0.5">{n.time}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        <div className="px-4 py-2.5 bg-zinc-900/50 border-t border-zinc-800">
                          <p className="text-[10px] text-zinc-600 text-center tracking-wide">
                            Alerts for new insights are active
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Sign In / Sign Up buttons for unauthenticated */}
              {!isAuthenticated && (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => { setPendingQuery(''); onOpenAuthModal?.(); }}
                    className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-[12.5px] font-semibold hover:border-zinc-500 hover:text-white transition-all"
                    whileTap={{ scale: 0.97 }}>
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => { setPendingQuery(''); onOpenAuthModal?.(); }}
                    className="px-4 py-2 rounded-xl bg-white text-black text-[12.5px] font-semibold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
                    whileTap={{ scale: 0.97 }}>
                    Sign Up
                  </motion.button>
                </div>
              )}

              {/* Profile */}
              {isAuthenticated && (
                <div className="relative" ref={profileRef}>
                  <motion.button
                    onClick={() => { setProfileOpen(v => !v); setBellOpen(false); }}
                    className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl transition-colors ${profileOpen ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'}`}
                    whileTap={{ scale: 0.97 }}>
                    <div className="w-[30px] h-[30px] rounded-lg bg-white flex items-center justify-center text-black text-[10px] font-bold tracking-wide">
                      {initials}
                    </div>
                    <span className="text-[12.5px] font-medium text-zinc-300 hidden sm:block">{currentUser?.fullName?.split(' ')[0]}</span>
                    <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                      <ChevronDown className="w-3 h-3 text-zinc-500" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        className="absolute right-0 top-[calc(100%+8px)] w-64 bg-zinc-900 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-zinc-800 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
                        <div className="px-5 py-4 bg-zinc-800/40 border-b border-zinc-800">
                          <p className="text-[15px] font-semibold text-white truncate">{currentUser?.fullName}</p>
                          <p className="text-[12px] text-zinc-500 truncate mt-0.5">{currentUser?.email}</p>
                        </div>
                        <div className="py-1.5">
                          {[
                            { icon: User,     label: 'Profile',  action: () => { onNavigate('profile'); setProfileOpen(false); } },
                            { icon: Settings, label: 'Settings', action: () => { setProfileOpen(false); onOpenSettings(); } },
                            { icon: LogOut,   label: 'Sign out', danger: true, action: () => { setProfileOpen(false); signOut(); } },
                          ].map((item, i) => {
                            const IIcon = item.icon;
                            return (
                              <div key={i}>
                                {i === 3 && <div className="my-1 mx-3 border-t border-zinc-800" />}
                                <motion.button onClick={item.action}
                                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${item.danger ? 'hover:bg-red-500/10' : 'hover:bg-zinc-800'}`}
                                  whileHover={{ x: 1.5 }}>
                                  <IIcon className={`w-4 h-4 ${item.danger ? 'text-red-400' : 'text-zinc-500'}`} />
                                  <span className={`text-[14px] font-medium ${item.danger ? 'text-red-400' : 'text-zinc-300'}`}>{item.label}</span>
                                </motion.button>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showAuthModal && (
          <SearchAuthModal
            pendingQuery=""
            onClose={() => onCloseAuthModal?.()}
            onAuthSuccess={() => onCloseAuthModal?.()}
          />
        )}
      </AnimatePresence>
    </>
  );
}
