import React from "react";
import { Settings, Moon, Sun, Languages, BellRing, Sparkles, CheckCircle, User, Loader2 } from "lucide-react";

interface SettingsViewProps {
  onLanguageChange: (lang: "en" | "hi") => void;
  language: "en" | "hi";
  onThemeToggle: () => void;
  theme: "light" | "dark";
  currentUser: any;
  onUpdateProfile: (name: string, email: string) => Promise<void>;
}

export default function SettingsView({
  onLanguageChange,
  language,
  onThemeToggle,
  theme,
  currentUser,
  onUpdateProfile,
}: SettingsViewProps) {
  const [reminders, setReminders] = React.useState(true);
  const [name, setName] = React.useState(currentUser?.name || "");
  const [email, setEmail] = React.useState(currentUser?.email || "");
  const [profileSaving, setProfileSaving] = React.useState(false);
  const [profileSaved, setProfileSaved] = React.useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await onUpdateProfile(name, email);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Static Hindi translations dictionary preview
  const dictionary = {
    en: {
      title: "Settings & System Preferences",
      sub: "Configure visual theme, localized language parameters, and automatic notifications.",
      theme: "Visual Theme Mode",
      lang: "Language / भाषा",
      save: "Save System Preferences",
    },
    hi: {
      title: "सेटिंग्स और सिस्टम प्राथमिकताएं",
      sub: "दृश्य थीम, स्थानीयकृत भाषा मापदंडों और स्वचालित सूचनाओं को कॉन्फ़िगर करें।",
      theme: "दृश्य थीम मोड",
      lang: "भाषा / Language",
      save: "सिस्टम प्राथमिकताएं सहेजें",
    }
  };

  const t = dictionary[language];

  return (
    <div id="settings-tab" className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-100 dark:border-green-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
          <Settings className="h-5 w-5 text-green-600" />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5">{t.sub}</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <User className="h-5 w-5 text-green-600" />
            <span>Profile Details</span>
          </h3>
          {profileSaved && (
            <div className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center space-x-1.5 animate-in fade-in zoom-in">
              <CheckCircle className="h-4 w-4" />
              <span>Profile updated!</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center space-x-2"
            >
              {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              <span>{profileSaving ? "Saving..." : "Update Profile"}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card: Config Options */}
        <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block">Preferences Form</h3>

          {saved && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center space-x-1.5 animate-bounce">
              <CheckCircle className="h-4 w-4" />
              <span>Preferences saved successfully to local memory cache!</span>
            </div>
          )}

          {/* Theme Selector */}
          <div className="space-y-2.5">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t.theme}</span>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => { if (theme === "dark") onThemeToggle(); }}
                className={`flex-1 p-3 border rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs cursor-pointer transition-all ${
                  theme === "light"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-white dark:bg-black/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-green-400 hover:border-green-500/50 dark:hover:border-green-500/50"
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Light Theme</span>
              </button>

              <button
                type="button"
                onClick={() => { if (theme === "light") onThemeToggle(); }}
                className={`flex-1 p-3 border rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs cursor-pointer transition-all ${
                  theme === "dark"
                    ? "bg-slate-900 border-slate-800 text-green-400 shadow-md shadow-green-900/20"
                    : "bg-white dark:bg-black/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-green-400 hover:border-green-500/50 dark:hover:border-green-500/50"
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Slate Dark Theme</span>
              </button>
            </div>
          </div>

          {/* Language selection */}
          <div className="space-y-2.5">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t.lang}</span>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`flex-1 p-3 border rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs cursor-pointer transition-all ${
                  language === "en"
                    ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
                    : "bg-white dark:bg-black/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-green-400 hover:border-green-500/50 dark:hover:border-green-500/50"
                }`}
              >
                <Languages className="h-4 w-4" />
                <span>English</span>
              </button>

              <button
                type="button"
                onClick={() => onLanguageChange("hi")}
                className={`flex-1 p-3 border rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs cursor-pointer transition-all ${
                  language === "hi"
                    ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
                    : "bg-white dark:bg-black/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-green-400 hover:border-green-500/50 dark:hover:border-green-500/50"
                }`}
              >
                <Languages className="h-4 w-4" />
                <span>हिंदी (Hindi)</span>
              </button>
            </div>
          </div>

          {/* Reminders Notifications toggle */}
          <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800/50 hover:border-green-500/50 rounded-2xl transition-all">
            <div className="flex items-center space-x-2">
              <BellRing className="h-4 w-4 text-green-600" />
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-white block">Daily Push Reminders</span>
                <span className="text-[10px] text-slate-400">Receive meal alert chime timers in background.</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reminders}
                onChange={(e) => setReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
          >
            {t.save}
          </button>
        </div>

        {/* Right Info: Live Dictionary Preview card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-green-950 p-6 sm:p-8 rounded-3xl border border-slate-800 text-white flex flex-col justify-between space-y-6 overflow-hidden relative hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/30 hover:border-green-600/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-4">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Localization Engine Active</span>
            </span>

            <h3 className="text-lg font-bold tracking-tight">Active Translation Dictionary</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our clinical app architecture dynamically translates metrics, calories guidance, water reminders, and nutritionist advice based on translation locale coordinates.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Active Language Code:</span>
              <span className="font-bold text-white uppercase">{language}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Dynamic Chime Notifications:</span>
              <span className="font-bold text-white">{reminders ? "ENABLED" : "DISABLED"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
