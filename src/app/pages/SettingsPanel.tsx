import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, User, Shield, Bell, CreditCard, Database,
  LogOut, ChevronRight, Check, Settings as SettingsIcon,
  Lock, Trash2, AlertTriangle, CheckCircle2, Download,
} from 'lucide-react';
import { useApp } from '../AppContext';
import type { Page } from '../App';
import { api } from '../../lib/api';

interface SettingsPanelProps {
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className={`relative shrink-0 rounded-full cursor-pointer transition-colors duration-200 ${
        on ? 'bg-blue-600' : 'bg-zinc-600'
      }`}
      style={{ height: 26, width: 46 }}
    >
      <motion.span
        className="block absolute rounded-full bg-white"
        style={{
          width: 18,
          height: 18,
          top: 4,
          boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}
        animate={{ left: on ? 24 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    </div>
  );
}

function Row({ label, desc, on, onToggle }: { label: string; desc?: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-zinc-800/60 last:border-0">
      <div>
        <p className="text-[13px] font-semibold text-zinc-200">{label}</p>
        {desc && <p className="text-[11px] text-zinc-500 mt-0.5">{desc}</p>}
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

type SettingsTab = 'account' | 'privacy' | 'notifications' | 'subscription' | 'data' | 'logout';

export function SettingsPanel({ onClose, onNavigate }: SettingsPanelProps) {
  const { currentUser, signOut, notifications } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('privacy');
  const [saved, setSaved] = useState(false);

  /* toggle states */
  const [twoFA,        setTwoFA]        = useState(true);
  const [biometric,    setBiometric]    = useState(false);
  const [sessionAlert, setSessionAlert] = useState(true);
  const [notifInsight, setNotifInsight] = useState(true);
  const [notifAlert,   setNotifAlert]   = useState(true);
  const [notifUpdate,  setNotifUpdate]  = useState(false);
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [analyticsShare, setAnalyticsShare] = useState(false);
  const [crashReports,   setCrashReports]   = useState(true);
  const [dataRetention,  setDataRetention]  = useState('90');

  // Load preferences from DB on mount
  useEffect(() => {
    async function loadSettings() {
      const { data } = await api.get<any>('/api/settings');
      if (data) {
        setNotifEmail(data.email_notifications === 1);
        if (data.display_preferences) {
          try {
            const prefs = JSON.parse(data.display_preferences);
            if (prefs.twoFA !== undefined) setTwoFA(prefs.twoFA);
            if (prefs.biometric !== undefined) setBiometric(prefs.biometric);
            if (prefs.sessionAlert !== undefined) setSessionAlert(prefs.sessionAlert);
            if (prefs.notifInsight !== undefined) setNotifInsight(prefs.notifInsight);
            if (prefs.notifAlert !== undefined) setNotifAlert(prefs.notifAlert);
            if (prefs.notifUpdate !== undefined) setNotifUpdate(prefs.notifUpdate);
            if (prefs.analyticsShare !== undefined) setAnalyticsShare(prefs.analyticsShare);
            if (prefs.crashReports !== undefined) setCrashReports(prefs.crashReports);
            if (prefs.dataRetention !== undefined) setDataRetention(prefs.dataRetention);
          } catch {
            // fallback silently
          }
        }
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    const prefs = {
      twoFA,
      biometric,
      sessionAlert,
      notifInsight,
      notifAlert,
      notifUpdate,
      analyticsShare,
      crashReports,
      dataRetention
    };

    await api.put('/api/settings', {
      email_notifications: notifEmail,
      push_notifications: false,
      theme_preference: 'dark',
      language: 'en',
      display_preferences: prefs
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<any>; badge?: number }[] = [
    { id: 'privacy',       label: 'Privacy & Security', icon: Shield       },
    { id: 'notifications', label: 'Notifications',      icon: Bell, badge: notifications.filter(n => !n.read).length },

    { id: 'data',          label: 'Data Preferences',   icon: Database     },
    { id: 'logout',        label: 'Sign Out',           icon: LogOut       },
  ];

  return (
    <div className="fixed inset-0 z-[998] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-0 sm:px-4">
      <motion.div
        className="bg-[#070709] w-full sm:max-w-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-800"
        style={{ maxHeight: '90vh' }}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <SettingsIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-[15px] font-extrabold text-white tracking-tight">Settings</h2>
              <p className="text-[11px] text-zinc-500">{currentUser?.fullName} · {currentUser?.plan} Plan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <motion.span
                className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle2 className="w-3 h-3" /> Saved
              </motion.span>
            )}
            <motion.button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition-colors" whileTap={{ scale: 0.93 }}>
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar tabs */}
          <div className="w-44 sm:w-52 border-r border-zinc-800 py-3 px-2 shrink-0 overflow-y-auto bg-zinc-950/40">
            {tabs.map(tab => {
              const TIcon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] font-medium mb-0.5 transition-colors text-left ${active ? 'bg-zinc-900 text-white font-semibold' : tab.id === 'logout' ? 'text-rose-500 hover:bg-rose-500/10' : 'text-zinc-400 hover:bg-zinc-900/50'}`}>
                  <TIcon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : tab.id === 'logout' ? 'text-rose-500' : 'text-zinc-500'}`} />
                  <span className="flex-1 truncate">{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? <span className="w-4 h-4 bg-blue-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shrink-0">{tab.badge}</span> : null}
                  {active && tab.id !== 'logout' && <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 bg-zinc-950/20">
            <AnimatePresence mode="wait">

              {/* ── ACCOUNT ── */}
              {activeTab === 'account' && (
                <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                  <h3 className="text-[13px] font-extrabold text-white mb-4 uppercase tracking-wider">Account Details</h3>
                  <div className="bg-zinc-900/60 rounded-2xl p-4 mb-5 flex items-center gap-4 border border-zinc-800/80">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-850 border border-zinc-800 flex items-center justify-center text-white text-[18px] font-extrabold shadow-md">
                      {currentUser?.fullName?.charAt(0) ?? 'U'}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white">{currentUser?.fullName}</p>
                      <p className="text-[12px] text-zinc-500">{currentUser?.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1 bg-zinc-900 text-zinc-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-zinc-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{currentUser?.plan} Plan · Active
                      </span>
                    </div>
                  </div>
                  {[
                    { label: 'Full Name', value: currentUser?.fullName ?? '', key: 'name' },
                    { label: 'Email Address', value: currentUser?.email ?? '', key: 'email' },
                    { label: 'Username', value: currentUser?.username ?? '', key: 'user' },
                  ].map(f => (
                    <div key={f.key} className="mb-4">
                      <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">{f.label}</label>
                      <input type="text" defaultValue={f.value}
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[13px] text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  ))}
                  <motion.button onClick={handleSave} className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[12px] font-bold shadow-sm transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    Save Changes
                  </motion.button>
                </motion.div>
              )}

              {/* ── PRIVACY & SECURITY ── */}
              {activeTab === 'privacy' && (
                <motion.div key="privacy" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                  <h3 className="text-[13px] font-extrabold text-white mb-4 uppercase tracking-wider">Privacy & Security</h3>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-5 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-bold text-emerald-400">End-to-End Encrypted</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">All your queries, analytics data, and session activity are encrypted in transit and at rest using AES-256. CideDec cannot read your data.</p>
                    </div>
                  </div>

                  <motion.button onClick={() => onNavigate('privacy')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 text-[12px] font-semibold hover:bg-zinc-800/50 transition-colors" whileHover={{ scale: 1.01 }}>
                    <span>View full Privacy Policy</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}

              {/* ── NOTIFICATIONS ── */}
              {activeTab === 'notifications' && (
                <motion.div key="notifs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                  <h3 className="text-[13px] font-extrabold text-white mb-4 uppercase tracking-wider">Notification Preferences</h3>
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl px-4 mb-4">
                    <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider pt-3.5 pb-2">In-App Alerts</p>
                    <Row label="AI Insights"   desc="New patterns and opportunities"   on={notifInsight} onToggle={() => setNotifInsight(v => !v)} />
                    <Row label="Risk Alerts"   desc="Critical risk score changes"      on={notifAlert}   onToggle={() => setNotifAlert(v => !v)}   />
                    <Row label="System Updates" desc="Platform updates and maintenance" on={notifUpdate}  onToggle={() => setNotifUpdate(v => !v)}  />
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl px-4 mb-4">
                    <p className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider pt-3.5 pb-2">Email Notifications</p>
                    <Row label="Weekly Digest" desc="Summarised analytics report" on={notifEmail} onToggle={() => setNotifEmail(v => !v)} />
                  </div>
                  <motion.button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[12px] font-bold shadow-sm transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    Save Preferences
                  </motion.button>
                </motion.div>
              )}

              {/* ── DATA PREFERENCES ── */}
              {activeTab === 'data' && (
                <motion.div key="data" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                  <h3 className="text-[13px] font-extrabold text-white mb-4 uppercase tracking-wider">Data Preferences</h3>
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl px-4 mb-4">
                    <Row label="Share Analytics Data" desc="Help improve CideDec (anonymised)" on={analyticsShare} onToggle={() => setAnalyticsShare(v => !v)} />
                    <Row label="Crash Reports"        desc="Auto-send error reports"             on={crashReports}   onToggle={() => setCrashReports(v => !v)}   />
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 mb-4">
                    <p className="text-[12px] font-semibold text-zinc-300 mb-2">Query history retention</p>
                    <select value={dataRetention} onChange={e => setDataRetention(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[13px] text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 text-[12px] font-semibold text-zinc-400 hover:bg-zinc-900/50 hover:text-white transition-colors">
                      <Download className="w-3.5 h-3.5" /> Export My Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-[12px] font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Account
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── SIGN OUT ── */}
              {activeTab === 'logout' && (
                <motion.div key="logout" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                  <h3 className="text-[13px] font-extrabold text-white mb-4 uppercase tracking-wider">Sign Out</h3>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mb-5">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                      <p className="text-[13px] font-bold text-red-400">You are about to sign out</p>
                    </div>
                    <p className="text-[12px] text-zinc-400 leading-relaxed">Your session will be securely ended. All unsaved analysis results will be cleared. Your account data, settings, and query history are safely stored in the cloud.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-zinc-850 text-[13px] font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">Cancel</button>
                    <motion.button onClick={() => { onClose(); signOut(); }} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-650 text-white text-[13px] font-semibold shadow-sm transition-colors"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      Sign Out
                    </motion.button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
