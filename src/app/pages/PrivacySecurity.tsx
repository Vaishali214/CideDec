import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Shield, Lock, Eye, Smartphone, Fingerprint,
  Globe, Database, UserCheck, Bell, ChevronRight, Download,
  AlertTriangle, MapPin, BarChart3, ShieldCheck, Activity,
  Trash2,
} from 'lucide-react';
import type { Page } from '../App';

interface PrivacySecurityProps { onNavigate: (page: Page) => void }

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="relative shrink-0 rounded-full cursor-pointer transition-colors duration-200"
      style={{ width: 46, height: 26, background: on ? '#6366f1' : '#3f3f46' }}
    >
      <motion.span
        className="block absolute rounded-full bg-white"
        style={{ width: 18, height: 18, top: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
        animate={{ left: on ? 24 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    </div>
  );
}

function ToggleRow({ icon: Icon, label, desc, on, onToggle }: {
  icon: any; label: string; desc: string; on: boolean; onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-zinc-400" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white">{label}</p>
          <p className="text-[12px] text-zinc-500">{desc}</p>
        </div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

function Section({ icon: Icon, title, subtitle, delay, children }: {
  icon: any; title: string; subtitle: string; delay: number; children: React.ReactNode;
}) {
  return (
    <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center gap-4">
        <div className="w-11 h-11 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-zinc-400" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-white">{title}</p>
          <p className="text-[12px] text-zinc-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

const SIDEBAR_ITEMS = [
  { id: 'overview',       label: 'Overview',            icon: Shield },
  { id: 'activity',       label: 'Activity Log',         icon: Activity },
  { id: 'data',           label: 'Data Management',      icon: Database },
];

export function PrivacySecurity({ onNavigate }: PrivacySecurityProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [twoFA,       setTwoFA]       = useState(true);
  const [biometric,   setBiometric]   = useState(false);
  const [loginAlerts, setLoginAlerts]  = useState(true);
  const [location,    setLocation]     = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle'|'granted'|'denied'|'requesting'>('idle');
  const [analytics,   setAnalytics]    = useState(false);

  const handleLocationToggle = () => {
    if (location) {
      // Turn off
      setLocation(false);
      setLocationStatus('idle');
      return;
    }
    // Request browser location permission
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation(true);
        setLocationStatus('granted');
      },
      () => {
        setLocation(false);
        setLocationStatus('denied');
      }
    );
  };

  const auditLog = [
    { action: 'Login',           ip: '103.82.44.12', device: 'Chrome · Windows', time: 'Today 9:42 AM' },
    { action: 'ROI Query',       ip: '103.82.44.12', device: 'Chrome · Windows', time: 'Today 9:48 AM' },
    { action: 'Export Report',   ip: '103.82.44.12', device: 'Chrome · Windows', time: 'Today 10:15 AM' },
    { action: 'Settings Update', ip: '103.82.44.12', device: 'Chrome · Windows', time: 'Yesterday 4:20 PM' },
    { action: 'Password Changed',ip: '103.82.44.12', device: 'Chrome · Windows', time: '2 days ago' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return (
        <div className="space-y-5">
          {/* E2E Banner */}
          <motion.div className="relative bg-gradient-to-br from-emerald-900/40 via-zinc-900 to-teal-900/30 border border-emerald-500/20 rounded-2xl p-6 overflow-hidden"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-2xl" />
            <div className="relative z-10 flex items-start gap-5">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center shrink-0">
                <Lock className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-white mb-2">End-to-End Encrypted</h2>
                <p className="text-[14px] text-zinc-400 leading-relaxed">
                  All your queries, analytics, and personal data are encrypted using AES-256 before leaving your device.
                  <span className="text-emerald-400 font-medium"> We cannot read your data</span> — not even our engineers.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['AES-256 Encryption', 'TLS 1.3 Transport', 'Zero-Knowledge', 'SOC 2 Compliant'].map(b => (
                    <span key={b} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" /> {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>



          {/* Transparency */}
          <Section icon={Eye} title="Data Transparency" subtitle="Clear and simple. No hidden data practices." delay={0.12}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
              {[
                { icon: Database, title: 'What we collect', desc: 'Only query text, session timestamps & usage patterns. No personal documents.', color: '#3b82f6' },
                { icon: Globe, title: "How it's used", desc: 'To generate analytics, improve AI models & personalise your experience. Never for ads.', color: '#10b981' },
                { icon: UserCheck, title: 'Your rights', desc: 'Access, correct, export or delete your data anytime from settings.', color: '#8b5cf6' },
              ].map((item, i) => {
                const IIcon = item.icon;
                return (
                  <motion.div key={i} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 hover:border-zinc-600 transition-colors cursor-pointer group"
                    whileHover={{ y: -2 }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.color + '15', border: `1px solid ${item.color}25` }}>
                        <IIcon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <h3 className="text-[14px] font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-[12px] text-zinc-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </Section>



          <Section icon={ShieldCheck} title="Permission Controls" subtitle="Manage app permissions" delay={0.16}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">Location Access</p>
                  <p className="text-[12px] text-zinc-500">
                    {locationStatus === 'requesting' && '⏳ Requesting permission...'}
                    {locationStatus === 'granted'    && '✅ Location access granted'}
                    {locationStatus === 'denied'     && '❌ Permission denied by browser'}
                    {(locationStatus === 'idle')     && 'Used for regional market insights'}
                  </p>
                </div>
              </div>
              <Toggle on={location} onToggle={handleLocationToggle} />
            </div>
            <ToggleRow icon={BarChart3} label="Analytics Sharing" desc="Share anonymised usage to improve AI models" on={analytics} onToggle={() => setAnalytics(v => !v)} />
          </Section>

          {/* Activity Log preview */}
          <motion.div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <button onClick={() => setActiveTab('activity')}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-bold text-white">Recent Activity Log</p>
                  <p className="text-[12px] text-zinc-500">See recent security events and account activity</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          </motion.div>

          {/* Data Management */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <button className="flex items-center gap-4 p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all text-left group">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-white">Export My Data</p>
                <p className="text-[12px] text-zinc-500">Download a copy of all your data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </button>
            <button className="flex items-center gap-4 p-5 bg-zinc-900/60 border border-red-500/20 rounded-2xl hover:border-red-500/40 transition-all text-left group">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-red-400">Delete Account</p>
                <p className="text-[12px] text-zinc-500">Permanently erase all your data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-red-400 transition-colors" />
            </button>
          </motion.div>
        </div>
      );

      case 'activity': return (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-800">
            <p className="text-[15px] font-bold text-white">Activity Log</p>
            <p className="text-[12px] text-zinc-500">Recent security events and account activity</p>
          </div>
          <div className="divide-y divide-zinc-800/80">
            {auditLog.map((log, i) => (
              <motion.div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{log.action}</p>
                    <p className="text-[11px] text-zinc-500">{log.device} · IP {log.ip}</p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-600 shrink-0 ml-4">{log.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );

      case 'data': return (
        <div className="space-y-4">
          <button className="w-full flex items-center gap-4 p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all text-left group">
            <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white">Export My Data</p>
              <p className="text-[12px] text-zinc-500">Download a copy of all your data in JSON format</p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
          </button>
          <button className="w-full flex items-center gap-4 p-5 bg-zinc-900/60 border border-red-500/20 rounded-2xl hover:border-red-500/40 transition-all text-left group">
            <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-red-400">Delete Account</p>
              <p className="text-[12px] text-zinc-500">Permanently erase all your data. This cannot be undone.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-red-400" />
          </button>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Header */}
      <div className="border-b border-zinc-800 px-8 lg:px-16 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <motion.button onClick={() => onNavigate('home')}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
              whileTap={{ scale: 0.95 }}>
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-[20px] font-extrabold text-white">Settings</h1>
              <p className="text-[13px] text-zinc-500">End-to-end protection · Full transparency · You're in control</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[13px] font-semibold text-emerald-400">Protected</span>
          </div>
        </div>
      </div>

      {/* Layout: Sidebar + Content */}
      <div className="w-full px-8 lg:px-16 py-8 flex gap-8 items-start">
        {/* Sidebar */}
        <nav className="hidden md:block w-[220px] shrink-0">
          <div className="sticky top-20 space-y-1">
            {SIDEBAR_ITEMS.map(item => {
              const SIcon = item.icon;
              const active = activeTab === item.id;
              return (
                <motion.button key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all text-left ${
                    active
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                  }`}
                  whileTap={{ scale: 0.98 }}>
                  <SIcon className="w-4.5 h-4.5 shrink-0" />
                  {item.label}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-12">
          {/* Mobile tab bar */}
          <div className="md:hidden flex overflow-x-auto gap-1 pb-3 mb-4 border-b border-zinc-800">
            {SIDEBAR_ITEMS.map(item => {
              const active = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                    active ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}>
                  {item.label}
                </button>
              );
            })}
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
