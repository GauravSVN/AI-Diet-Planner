import React from "react";
import { GlassWater, Droplet, Clock, Plus, ShieldAlert, CheckCircle, Volume2 } from "lucide-react";

interface WaterIntakeViewProps {
  initialGoalLitres: number;
  initialConsumedMl: number;
  onLogWater: (ml: number) => void;
}

export default function WaterIntakeView({
  initialGoalLitres,
  initialConsumedMl,
  onLogWater,
}: WaterIntakeViewProps) {
  // Activity Level State
  const [activityLevel, setActivityLevel] = React.useState<"sedentary" | "active" | "athlete">("sedentary");
  
  const baseGoalMl = initialGoalLitres * 1000;
  const activityBonus = activityLevel === "sedentary" ? 0 : activityLevel === "active" ? 500 : 1000;
  const goalMl = baseGoalMl + activityBonus;

  const pct = Math.min(Math.round((initialConsumedMl / goalMl) * 100), 100);

  // SVG Progress Circle Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const quickButtons = [
    { label: "+250 ml", ml: 250, sub: "Standard Glass" },
    { label: "+500 ml", ml: 500, sub: "Small Bottle" },
    { label: "+750 ml", ml: 750, sub: "Sports Shaker" },
    { label: "+1000 ml", ml: 1000, sub: "Large Thermos" },
  ];

  // Reminder settings state
  const [reminderActive, setReminderActive] = React.useState(true);
  const [reminderInterval, setReminderInterval] = React.useState(60); // minutes
  const [notificationStatus, setNotificationStatus] = React.useState<string | null>(null);

  const triggerMockSound = () => {
    setNotificationStatus(`Water Reminder Configured: You will be prompted every ${reminderInterval} minutes to stay hydrated!`);
    setTimeout(() => {
      setNotificationStatus(null);
    }, 4000);
  };

  const getHydrationStatus = () => {
    if (pct < 30) return { label: "Dehydrated", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-900/50", msg: "Drink water to avoid fatigue." };
    if (pct < 80) return { label: "On Track", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-900/50", msg: "Keep sipping water throughout the day." };
    return { label: "Optimal", color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-900/50", msg: "Excellent! You are perfectly hydrated." };
  };
  const status = getHydrationStatus();

  // Timeline State
  const [logs, setLogs] = React.useState<{ time: string, ml: number }[]>([
    { time: "10:15 AM", ml: 500 },
    { time: "08:30 AM", ml: 250 }
  ]);
  
  const handleLogWater = (ml: number) => {
    onLogWater(ml);
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs([{ time: timeString, ml }, ...logs].slice(0, 5)); // Keep last 5
  };

  return (
    <div id="water-intake-tab" className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-150 dark:border-cyan-900/50 shadow-[0_4px_20px_-4px_rgba(6,182,212,0.1)] hover:border-cyan-500/30 dark:hover:border-cyan-500/50 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group cursor-default">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <GlassWater className="h-5 w-5 text-blue-500 dark:text-cyan-400 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all" />
            <span className="dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-300 dark:to-blue-300">Smart Hydration Tracker</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-cyan-100/70 mt-0.5">Log daily fluid inputs to keep your metabolic rate optimal.</p>
        </div>
      </div>

      {notificationStatus && (
        <div className="p-4 bg-blue-50 dark:bg-cyan-950/80 border border-blue-200 dark:border-cyan-600/50 text-blue-800 dark:text-cyan-300 rounded-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300 flex items-center space-x-2 shadow-sm">
          <Clock className="h-4 w-4 shrink-0 text-blue-600 dark:text-cyan-400" />
          <span>{notificationStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Circular Indicator */}
        <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-cyan-900/40 shadow-sm flex flex-col items-center justify-center space-y-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-cyan-900/30 dark:hover:border-cyan-600/50 transition-all duration-300 cursor-default relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Activity Selector */}
          <div className="flex bg-slate-50 dark:bg-black/40 rounded-xl p-1 mb-2 relative z-10 w-full max-w-[250px] border border-slate-100 dark:border-cyan-900/30">
            <button onClick={() => setActivityLevel("sedentary")} className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${activityLevel === "sedentary" ? "bg-white dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600"}`}>Sedentary</button>
            <button onClick={() => setActivityLevel("active")} className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${activityLevel === "active" ? "bg-white dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600"}`}>Active</button>
            <button onClick={() => setActivityLevel("athlete")} className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${activityLevel === "athlete" ? "bg-white dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600"}`}>Athlete</button>
          </div>

          <h3 className="text-base font-bold text-slate-800 dark:text-cyan-300 uppercase tracking-wider block relative z-10">Today's Intake Goal</h3>

          <div className="relative h-44 w-44 flex items-center justify-center z-10">
            {/* SVG circle */}
            <svg className="w-full h-full rotate-270 transform">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="text-slate-100 dark:text-cyan-950/60 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="text-blue-500 dark:text-cyan-400 stroke-current transition-all duration-1000 ease-out"
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(34, 211, 238, 0.6))' }}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            {/* Inside Label */}
            <div className="absolute text-center">
              <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight drop-shadow-sm">{pct}%</span>
              <p className="text-[10px] text-slate-400 dark:text-cyan-200/80 font-bold uppercase mt-0.5">Hydrated</p>
            </div>
          </div>

          <div className="text-center relative z-10">
            <p className="text-2xl font-black text-slate-800 dark:text-white">
              {initialConsumedMl} <span className="text-sm font-medium text-slate-400 dark:text-cyan-200/70">/ {goalMl} ml</span>
            </p>
            {pct >= 100 && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-500/10 dark:bg-cyan-500/20 text-green-700 dark:text-cyan-300 rounded-full text-xs font-semibold mt-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Water target met!</span>
              </span>
            )}
          </div>

          {/* Hydration Status */}
          <div className={`w-full p-4 rounded-2xl border flex flex-col items-center text-center relative z-10 transition-colors ${status.bg} ${status.border}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${status.color}`}>
              <ShieldAlert className="h-3 w-3" />
              <span>{status.label} Status</span>
            </span>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1.5">{status.msg}</p>
          </div>
        </div>

        {/* Right Log Buttons & Reminders */}
        <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-cyan-900/40 shadow-sm flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-cyan-900/30 dark:hover:border-cyan-600/50 transition-all duration-300 cursor-default">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-cyan-300 uppercase tracking-wider">Quick Log Fluid Intake</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickButtons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLogWater(btn.ml)}
                  className="p-4 border border-slate-100 dark:border-slate-800/50 dark:bg-black/40 hover:border-cyan-500 hover:bg-cyan-50/50 dark:hover:border-cyan-500 dark:hover:bg-cyan-950/50 dark:hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:-translate-y-1 text-left rounded-2xl transition-all duration-300 cursor-pointer flex justify-between items-center group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <span className="text-sm font-bold text-slate-800 dark:text-white block group-hover:text-cyan-600 dark:group-hover:text-cyan-200 transition-colors">
                      {btn.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-cyan-100/60 font-medium block mt-0.5 group-hover:text-cyan-600/70 dark:group-hover:text-cyan-200/80 transition-colors">
                      {btn.sub}
                    </span>
                  </div>
                  <Droplet className="h-4 w-4 text-slate-300 dark:text-cyan-700/50 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-transform duration-300 group-hover:scale-125 relative z-10" />
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="h-4 w-4 text-cyan-500" />
              <span>Recent Intake Logs</span>
            </h3>
            <div className="space-y-3">
              {logs.map((log, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-black/40 p-3.5 rounded-xl border border-slate-100 dark:border-cyan-900/30 hover:border-cyan-500/30 transition-colors">
                  <span className="text-xs font-bold text-slate-500 dark:text-cyan-100/60">{log.time}</span>
                  <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">+{log.ml} ml</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders Toggle config */}
          <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-white">Hydration Reminder Settings</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderActive}
                  onChange={(e) => setReminderActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {reminderActive && (
              <div className="flex items-center space-x-4 bg-slate-50 dark:bg-black/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50 transition-all">
                <span className="text-xs font-semibold text-slate-500 dark:text-cyan-100/90 shrink-0">Interval Duration:</span>
                <select
                  value={reminderInterval}
                  onChange={(e) => setReminderInterval(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-xs focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 dark:text-white w-full transition-all cursor-pointer"
                >
                  <option value={30}>Every 30 Minutes</option>
                  <option value={60}>Every 1 Hour</option>
                  <option value={120}>Every 2 Hours</option>
                  <option value={180}>Every 3 Hours</option>
                </select>
                <button
                  onClick={triggerMockSound}
                  className="p-2 bg-blue-50 dark:bg-slate-900/50 text-blue-600 dark:text-cyan-400 rounded-xl border border-blue-100 dark:border-slate-700/50 shrink-0 cursor-pointer hover:bg-blue-100 dark:hover:bg-cyan-950/50 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-cyan-900/30"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
