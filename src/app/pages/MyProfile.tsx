import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Phone, Building2, Globe, Save,
  Camera, ShieldCheck, Bell, CreditCard,
  ArrowLeft, CheckCircle2, Edit3, Settings,
  MapPin, Upload, Trash2, X, Briefcase,
} from 'lucide-react';
import { useApp } from '../AppContext';
import { SettingsPanel } from './SettingsPanel';
import type { Page } from '../App';
import { api } from '../../lib/api';

interface MyProfileProps { onNavigate: (page: Page) => void }

export function MyProfile({ onNavigate }: MyProfileProps) {
  const { currentUser, notifications, refreshProfile } = useApp();
  const [editing,      setEditing]      = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(currentUser?.avatarUrl ?? null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync avatar URL when currentUser changes
  useEffect(() => {
    if (currentUser?.avatarUrl !== undefined) {
      setProfileImage(currentUser.avatarUrl);
    }
  }, [currentUser]);

  const initials = currentUser?.fullName
    ? currentUser.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const [fields, setFields] = useState({
    fullName:  currentUser?.fullName ?? 'User',
    email:     currentUser?.email    ?? '',
    phone:     '+91 98765 43210',
    company:   'CideDec Technologies',
    role:      'Chief Analytics Officer',
    website:   'https://cidedec.com',
    bio:       'Data-driven strategist specialising in AI-led business intelligence and growth analytics.',
    location:  'Mumbai, India',
  });

  const personalFields = [
    { label: 'Full Name',    value: fields.fullName, key: 'fullName', icon: User,      type: 'text'  },
    { label: 'Email',        value: fields.email,    key: 'email',    icon: Mail,      type: 'email' },
    { label: 'Phone',        value: fields.phone,    key: 'phone',    icon: Phone,     type: 'tel'   },
    { label: 'Location',     value: fields.location, key: 'location', icon: MapPin,    type: 'text'  },
  ] as const;

  const professionalFields = [
    { label: 'Company',      value: fields.company,  key: 'company',  icon: Building2, type: 'text'  },
    { label: 'Designation',  value: fields.role,     key: 'role',     icon: Briefcase, type: 'text'  },
    { label: 'Website',      value: fields.website,  key: 'website',  icon: Globe,     type: 'url'   },
  ] as const;

  const handleSave = async () => {
    if (currentUser) {
      await api.put(`/api/profiles/${currentUser.id}`, {
        full_name: fields.fullName,
        username: currentUser.username
      });
      await refreshProfile();
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── Photo handlers ── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setProfileImage(base64);
      setShowPhotoMenu(false);

      if (currentUser) {
        await api.put(`/api/profiles/${currentUser.id}`, {
          avatar_url: base64
        });
        await refreshProfile();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = async () => {
    setProfileImage(null);
    setShowPhotoMenu(false);

    if (currentUser) {
      await api.put(`/api/profiles/${currentUser.id}`, {
        avatar_url: null
      });
      await refreshProfile();
    }
  };

  const statCards = [
    { label: 'Queries Run',    value: '142' },
    { label: 'Reports Saved',  value: '38'  },
    { label: 'Insights Found', value: '294' },
    { label: 'Days Active',    value: '61'  },
  ];

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-16">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-zinc-900 px-8 lg:px-16 py-5">
        <div className="flex items-center gap-5">
          <motion.button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-[20px] font-extrabold text-white tracking-tight">My Profile</h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">Manage your account and personal information</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <AnimatePresence>
              {saved && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[13px] text-emerald-400 font-semibold"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <CheckCircle2 className="w-4 h-4" /> Changes saved
                </motion.div>
              )}
            </AnimatePresence>
            {editing ? (
              <motion.button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-[14px] font-semibold shadow-sm transition-colors"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                <Save className="w-4 h-4" /> Save Changes
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-[14px] font-semibold shadow-sm transition-colors"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-8 lg:px-16 pt-8 space-y-6">

        {/* ═══ Avatar Card ═══ */}
        <motion.div
          className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8 flex items-start gap-7 backdrop-blur-sm relative z-10"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {/* Profile photo with upload */}
          <div className="relative shrink-0">
            <div className="w-[110px] h-[110px] rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-white text-[32px] font-extrabold shadow-lg overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>

            {/* Camera button */}
            <motion.button
              onClick={() => setShowPhotoMenu(prev => !prev)}
              className="absolute -bottom-2 -right-2 w-9 h-9 bg-zinc-900 rounded-full border-2 border-zinc-800 shadow-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            >
              <Camera className="w-3.5 h-3.5" />
            </motion.button>

            {/* Photo dropdown menu */}
            <AnimatePresence>
              {showPhotoMenu && (
                <motion.div
                  className="absolute top-full left-0 mt-2 w-56 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden z-[200]"
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  <button
                    onClick={() => { cameraInputRef.current?.click(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-[12px] font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-zinc-500" /> Take a photo
                  </button>
                  <button
                    onClick={() => { fileInputRef.current?.click(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-[12px] font-medium text-zinc-300 hover:bg-zinc-800 transition-colors border-t border-zinc-800"
                  >
                    <Upload className="w-4 h-4 text-zinc-500" /> Upload from device
                  </button>
                  {profileImage && (
                    <button
                      onClick={handleRemovePhoto}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-[12px] font-medium text-red-400 hover:bg-red-950/30 transition-colors border-t border-zinc-800"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" /> Remove photo
                    </button>
                  )}
                  <button
                    onClick={() => setShowPhotoMenu(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-[12px] font-medium text-zinc-500 hover:bg-zinc-800 transition-colors border-t border-zinc-850"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile summary */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[22px] font-extrabold text-white leading-tight">{fields.fullName}</h2>
            <p className="text-[14px] text-zinc-400 mt-1">{fields.role} · {fields.company}</p>
            <p className="text-[14px] text-zinc-500 mt-0.5 truncate">{fields.email}</p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <div className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[13px] font-medium text-zinc-400">{fields.location}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Statistics ═══ */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {statCards.map((s, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-zinc-700 transition-all">
              <p className="text-[32px] font-extrabold text-white leading-none">{s.value}</p>
              <p className="text-[13px] text-zinc-500 font-medium mt-2">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ═══ Personal Information ═══ */}
        <motion.div
          className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="px-6 py-5 border-b border-zinc-800/80">
            <p className="text-[13px] font-extrabold text-white uppercase tracking-wider">Personal Information</p>
            <p className="text-[12px] text-zinc-500 mt-0.5">Your private details — only visible to you</p>
          </div>
          <div className="divide-y divide-zinc-900">
            {personalFields.map((f, i) => {
              const FIcon = f.icon;
              return (
                <div key={i} className="flex items-center gap-5 px-6 py-5">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shrink-0">
                    <FIcon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">{f.label}</p>
                    {editing ? (
                      <input
                        type={f.type}
                        value={fields[f.key]}
                        onChange={e => setFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full text-[15px] font-medium text-zinc-200 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 outline-none focus:border-zinc-500 transition-all"
                      />
                    ) : (
                      <p className="text-[15px] font-medium text-zinc-200 truncate">{f.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ Professional Information ═══ */}
        <motion.div
          className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-6 py-5 border-b border-zinc-800/80">
            <p className="text-[13px] font-extrabold text-white uppercase tracking-wider">Professional Information</p>
            <p className="text-[12px] text-zinc-500 mt-0.5">Company and role details</p>
          </div>
          <div className="divide-y divide-zinc-900">
            {professionalFields.map((f, i) => {
              const FIcon = f.icon;
              return (
                <div key={i} className="flex items-center gap-5 px-6 py-5">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shrink-0">
                    <FIcon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">{f.label}</p>
                    {editing ? (
                      <input
                        type={f.type}
                        value={fields[f.key]}
                        onChange={e => setFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full text-[15px] font-medium text-zinc-200 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 outline-none focus:border-zinc-500 transition-all"
                      />
                    ) : (
                      <p className="text-[15px] font-medium text-zinc-200 truncate">{f.value}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bio */}
            <div className="flex items-start gap-5 px-6 py-5">
              <div className="w-11 h-11 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                <Edit3 className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">Bio</p>
                {editing ? (
                  <textarea
                    value={fields.bio}
                    onChange={e => setFields(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full text-[15px] font-medium text-zinc-200 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 outline-none focus:border-zinc-500 transition-all resize-none"
                  />
                ) : (
                  <p className="text-[15px] font-medium text-zinc-300 leading-relaxed">{fields.bio}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} onNavigate={(p) => { setShowSettings(false); onNavigate(p); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
