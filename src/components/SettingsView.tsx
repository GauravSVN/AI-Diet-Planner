import React from "react";
import { Settings, Moon, Sun, Languages, BellRing, Sparkles, CheckCircle, User, Loader2 } from "lucide-react";

import { useLanguage } from "../LanguageContext";

interface SettingsViewProps {
  onThemeToggle: () => void;
  theme: "light" | "dark";
  currentUser: any;
  onUpdateProfile: (name: string, email: string, phone?: string, dob?: string) => Promise<void>;
}

export default function SettingsView({
  onThemeToggle,
  theme,
  currentUser,
  onUpdateProfile,
}: SettingsViewProps) {
  const [reminders, setReminders] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  const [profileName, setProfileName] = React.useState(currentUser?.name || "");
  const [profileEmail, setProfileEmail] = React.useState(currentUser?.email || "");
  const [profilePhone, setProfilePhone] = React.useState(currentUser?.phone || "");
  const [profileDob, setProfileDob] = React.useState(
    currentUser?.dob ? new Date(currentUser.dob).toISOString().split("T")[0] : ""
  );
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdateProfile(profileName, profileEmail, profilePhone, profileDob);
      handleSave();
    } catch (err) {
      alert("Failed to update profile details. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const { t, language, setLanguage } = useLanguage();

  return (
    <div id="settings-tab" className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-100 dark:border-green-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
          <Settings className="h-5 w-5 text-green-600" />
          <span>{t("settings_title")}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5">{t("settings_sub")}</p>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          <span>Profile and Settings have been updated successfully!</span>
        </div>
      )}

      {/* Profile Details Card */}
      <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 transition-all duration-300">
        <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800/50 pb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-green-600" />
          Profile & Basic Details
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-800 dark:text-white text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-800 dark:text-white text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-800 dark:text-white text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
            <input
              type="date"
              value={profileDob}
              onChange={(e) => setProfileDob(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-800 dark:text-white text-sm transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-8 py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-green-600/20 transition-all cursor-pointer text-sm flex items-center justify-center space-x-2"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            <span>Update Profile</span>
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card: Config Options */}
        <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-8 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800/50 pb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-green-600" />
            {t("settings_config")}
          </h3>

          {/* Theme Selector */}
          <div className="space-y-2.5">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t("settings_theme")}</span>
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
                <span>{t("settings_light")}</span>
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
                <span>{t("settings_dark")}</span>
              </button>
            </div>
          </div>

          {/* Language selection */}
          <div className="space-y-2.5">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t("settings_lang")}</span>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`flex-1 p-3 border rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs cursor-pointer transition-all ${
                  language === "en"
                    ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
                    : "bg-white dark:bg-black/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-green-400 hover:border-green-500/50 dark:hover:border-green-500/50"
                }`}
              >
                <Languages className="h-4 w-4" />
                <span>{t("settings_en")}</span>
              </button>

              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`flex-1 p-3 border rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs cursor-pointer transition-all ${
                  language === "hi"
                    ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
                    : "bg-white dark:bg-black/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-green-400 hover:border-green-500/50 dark:hover:border-green-500/50"
                }`}
              >
                <Languages className="h-4 w-4" />
                <span>{t("settings_hi")}</span>
              </button>
            </div>
          </div>

          {/* Reminders Notifications toggle */}
          <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800/50 hover:border-green-500/50 rounded-2xl transition-all">
            <div className="flex items-center space-x-2">
              <BellRing className="h-4 w-4 text-green-600" />
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-white block">{t("settings_reminders")}</span>
                <span className="text-[10px] text-slate-400">{t("settings_reminders_sub")}</span>
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
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md shadow-green-600/20 transition-all cursor-pointer text-xs flex items-center justify-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{t("settings_save")}</span>
          </button>
        </div>

        {/* Right Info: Live Dictionary Preview card */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-green-950 p-6 sm:p-8 rounded-3xl border border-green-100 dark:border-slate-800 text-slate-800 dark:text-white flex flex-col justify-between space-y-6 overflow-hidden relative hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/10 dark:hover:shadow-green-900/40 hover:border-green-300 dark:hover:border-green-500/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-4">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>{t("settings_engine")}</span>
            </span>

            <h3 className="text-lg font-bold tracking-tight">{t("settings_dict_title")}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("settings_dict_desc")}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/50 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
              <span>{t("settings_active_lang")}</span>
              <span className="font-bold text-slate-800 dark:text-white uppercase px-2 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none">{language}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
              <span>{t("settings_dynamic_push")}</span>
              <span className={`font-bold uppercase px-2 py-1 rounded-lg ${reminders ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30" : "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30"}`}>
                {reminders ? t("settings_enabled") : t("settings_disabled")}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/50 pt-3">
              <span>{t("settings_sys_version")}</span>
              <span className="font-bold text-slate-800 dark:text-white">v2.4.0 (Pro)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
