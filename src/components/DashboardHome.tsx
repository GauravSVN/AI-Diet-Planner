import React from "react";
import { 
  Flame, 
  Droplet, 
  Scale, 
  Timer, 
  Sparkles, 
  Plus, 
  CheckCircle, 
  ArrowRight, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Apple
} from "lucide-react";
import { DietPlan, NutritionReport, ProgressLog } from "../types";
import { useLanguage } from "../LanguageContext";

interface DashboardHomeProps {
  user: any;
  latestPlan: DietPlan | null;
  report: NutritionReport | null;
  logs: ProgressLog[];
  onNavigateTab: (tab: string) => void;
  onQuickLog: (data: Partial<ProgressLog>) => void;
}

export default function DashboardHome({
  user,
  latestPlan,
  report,
  logs,
  onNavigateTab,
  onQuickLog,
}: DashboardHomeProps) {
  const { t } = useLanguage();
  const [quickWeight, setQuickWeight] = React.useState("");
  const [quickWater, setQuickWater] = React.useState("");
  const [quickCal, setQuickCal] = React.useState("");
  const [quickEx, setQuickEx] = React.useState("");

  const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : (report?.bmi ? 75 : null);
  const currentBmi = logs.length > 0 ? logs[logs.length - 1].bmi : (report?.bmi || null);

  // Hydration status
  const todayLog = logs.find((l) => l.date === new Date().toISOString().split("T")[0]);
  const waterConsumedMl = todayLog?.waterIntakeMl || 0;
  const calConsumed = todayLog?.caloriesConsumed || 0;
  const exerciseMins = todayLog?.exerciseMinutes || 0;

  const waterGoalMl = latestPlan ? latestPlan.waterIntakeLitres * 1000 : 2500;
  const calGoal = latestPlan ? latestPlan.dailyCalories : 2000;

  const waterPct = Math.min(Math.round((waterConsumedMl / waterGoalMl) * 100), 100);
  const calPct = Math.min(Math.round((calConsumed / calGoal) * 100), 100);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickLog({
      weight: quickWeight ? Number(quickWeight) : undefined,
      waterIntakeMl: quickWater ? Number(quickWater) : undefined,
      caloriesConsumed: quickCal ? Number(quickCal) : undefined,
      exerciseMinutes: quickEx ? Number(quickEx) : undefined,
    });
    setQuickWeight("");
    setQuickWater("");
    setQuickCal("");
    setQuickEx("");
  };

  return (
    <div id="dashboard-home-tab" className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 dark:from-slate-900 dark:via-slate-800 dark:to-green-950 p-6 sm:p-8 rounded-3xl border border-green-500/30 dark:border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("dash_ai_metabolism")}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("dash_welcome")}, <span className="text-emerald-300 dark:text-green-400">{user.name}</span>!
          </h2>
          <p className="text-emerald-50 dark:text-slate-300 text-sm max-w-xl">
            {latestPlan 
              ? `${t("dash_subtitle")} : ${latestPlan.dailyCalories} kcal/day.`
              : "Complete your health assessment profile so our clinical AI model can compute your custom meal metrics."}
          </p>
        </div>

        {!latestPlan && (
          <button
            onClick={() => onNavigateTab("assessment")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-900/40 transition-all shrink-0 cursor-pointer"
          >
            {t("dash_start_assessment")}
          </button>
        )}
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Calorie Widget */}
        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 dark:hover:shadow-green-900/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-2 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dash_calories")}</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{calGoal} kcal</p>
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${calPct}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{calPct}%</span>
            </div>
          </div>
        </div>

        {/* Water Widget */}
        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 dark:hover:shadow-green-900/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-2 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Droplet className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dash_water")}</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              {waterConsumedMl} / {waterGoalMl} ml
            </p>
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${waterPct}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{waterPct}%</span>
            </div>
          </div>
        </div>

        {/* Weight Widget */}
        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 dark:hover:shadow-green-900/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-2 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dash_current_weight")}</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              {currentWeight ? `${currentWeight} kg` : "--"}
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              {t("dash_bmi_label")}: {currentBmi ? currentBmi : "--"}
            </span>
          </div>
        </div>

        {/* Exercise Widget */}
        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 dark:hover:shadow-green-900/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-2 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Timer className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("dash_exercise_log")}</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{exerciseMins} {t("dash_mins")}</p>
            <span className="text-[10px] text-slate-500 font-bold">
              {exerciseMins >= 30 ? t("dash_target_hit") : t("dash_keep_moving")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Log Form */}
        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 hover:-translate-y-2 transition-all duration-300 space-y-5 lg:col-span-1">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{t("dash_quick_log")}</h3>
            <p className="text-xs text-slate-500">{t("dash_quick_log_sub")}</p>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {t("dash_quick_weight_lbl")}
              </label>
              <input
                type="number"
                step="0.1"
                value={quickWeight}
                onChange={(e) => setQuickWeight(e.target.value)}
                placeholder={currentWeight ? `${currentWeight} kg` : "75.0"}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {t("dash_quick_water_lbl")}
              </label>
              <input
                type="number"
                value={quickWater}
                onChange={(e) => setQuickWater(e.target.value)}
                placeholder="250 (One Standard Glass)"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {t("dash_quick_cal_lbl")}
                </label>
                <input
                  type="number"
                  value={quickCal}
                  onChange={(e) => setQuickCal(e.target.value)}
                  placeholder="350"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {t("dash_quick_ex_lbl")}
                </label>
                <input
                  type="number"
                  value={quickEx}
                  onChange={(e) => setQuickEx(e.target.value)}
                  placeholder="30"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>{t("dash_log_btn")}</span>
            </button>
          </form>
        </div>

        {/* AI Diet Highlights Summary */}
        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 hover:-translate-y-2 transition-all duration-300 space-y-6 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
                <Apple className="h-5 w-5 text-green-500" />
                <span>{t("dash_today_plan")}</span>
              </h3>
              {latestPlan && (
                <button
                  onClick={() => onNavigateTab("diet-plan")}
                  className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center space-x-1 cursor-pointer"
                >
                  <span>{t("dash_full_meals")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {latestPlan ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t("dash_targets")}</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t("dash_prot_target")}</span>
                      <span className="font-bold text-slate-700 dark:text-white">{latestPlan.proteinGrams}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t("dash_fiber_target")}</span>
                      <span className="font-bold text-slate-700 dark:text-white">{latestPlan.fiberGrams}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t("dash_fat_limit")}</span>
                      <span className="font-bold text-slate-700 dark:text-white">{latestPlan.fatGrams}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t("dash_hyd_target")}</span>
                      <span className="font-bold text-blue-600">{latestPlan.waterIntakeLitres} L</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t("dash_ai_advice")}</span>
                  <p className="text-xs text-slate-600 dark:text-emerald-100/90 leading-relaxed bg-slate-50 dark:bg-black/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500/30 transition-all">
                    {report?.summaryText || t("dash_advice_fallback")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-full w-fit mx-auto border border-slate-100">
                  <AlertCircle className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  {t("dash_no_summary")}
                </p>
              </div>
            )}
          </div>

          {latestPlan && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Breakfast</span>
                <p className="text-xs font-semibold text-slate-700 dark:text-white truncate mt-0.5">{latestPlan.meals.breakfast.foodName}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lunch</span>
                <p className="text-xs font-semibold text-slate-700 dark:text-white truncate mt-0.5">{latestPlan.meals.lunch.foodName}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dinner</span>
                <p className="text-xs font-semibold text-slate-700 dark:text-white truncate mt-0.5">{latestPlan.meals.dinner.foodName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
