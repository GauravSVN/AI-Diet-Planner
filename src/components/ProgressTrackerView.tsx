import React from "react";
import { TrendingUp, Award, Calendar, Activity, Zap, Brain, Download, List, FileSpreadsheet, Sparkles } from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { ProgressLog } from "../types";
import { useLanguage } from "../LanguageContext";

interface ProgressTrackerViewProps {
  logs: ProgressLog[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl">
        <p className="text-slate-500 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-700 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm font-black flex items-center justify-between space-x-4" style={{ color: entry.color || entry.fill }}>
            <span>{entry.name}:</span>
            <span>{entry.value} {entry.name.includes("Weight") ? "kg" : entry.name.includes("BMI") ? "" : "kcal"}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgressTrackerView({ logs }: ProgressTrackerViewProps) {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = React.useState<"weekly" | "monthly">("weekly");

  // Sort logs by date ascending
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter logs based on timeframe
  const filteredLogs = timeframe === "weekly" ? sortedLogs.slice(-7) : sortedLogs.slice(-30);

  // Compute stats metrics
  const totalCal = filteredLogs.reduce((acc, curr) => acc + curr.caloriesConsumed, 0);
  const avgCal = filteredLogs.length > 0 ? Math.round(totalCal / filteredLogs.length) : 0;

  const totalWater = filteredLogs.reduce((acc, curr) => acc + curr.waterIntakeMl, 0);
  const avgWater = filteredLogs.length > 0 ? Math.round(totalWater / filteredLogs.length) : 0;

  const initialWeight = sortedLogs.length > 0 ? sortedLogs[0].weight : 0;
  const latestWeight = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].weight : 0;
  const weightChange = Number((latestWeight - initialWeight).toFixed(1));

  return (
    <div id="progress-tracker-tab" className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-sm hover:bg-white dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>{t('prog_title')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t('prog_subtitle')}</p>
        </div>
        
        {/* Weekly / Monthly Toggle button */}
        <div className="flex bg-slate-100 dark:bg-black/40 border dark:border-slate-800/50 p-1 rounded-xl shrink-0 w-fit self-start sm:self-center">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timeframe === "weekly" ? "bg-green-600 text-white shadow-md shadow-green-100/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-green-400 hover:bg-white dark:hover:bg-slate-800"
            }`}
          >
            {t("prog_weekly")}
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timeframe === "monthly" ? "bg-green-600 text-white shadow-md shadow-green-100/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-green-400 hover:bg-white dark:hover:bg-slate-800"
            }`}
          >
            {t("prog_monthly")}
          </button>
        </div>
        
        <button
          onClick={() => alert("Downloading CSV Report...")}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 self-start sm:self-center"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          <span>{t("prog_export")}</span>
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-sm hover:bg-white dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("prog_weight_chg")}</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              {weightChange > 0 ? `+${weightChange}` : weightChange} kg
            </p>
            <span className="text-[10px] text-slate-400 font-medium">{t("prog_since_first")}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-sm hover:bg-white dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("prog_avg_cal")}</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{avgCal} kcal</p>
            <span className="text-[10px] text-slate-400 font-medium">{t("prog_for_period")}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-sm hover:bg-white dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("prog_avg_fluid")}</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{avgWater} ml</p>
            <span className="text-[10px] text-slate-400 font-medium">{t("prog_for_period")}</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50/40 dark:from-indigo-950/40 dark:to-purple-950/20 backdrop-blur-2xl p-5 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-indigo-900/30 transition-all duration-300 flex items-start space-x-4 sm:col-span-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-800/70 dark:text-indigo-300/80 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>{t("prog_ai_insights")}</span>
            </span>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 leading-snug">
              {weightChange < 0 
                ? t("prog_ai_lost").replace("{0}", Math.abs(weightChange).toString())
                : weightChange > 0 
                ? t("prog_ai_gained").replace("{0}", weightChange.toString()).replace("{1}", avgCal.toString())
                : t("prog_ai_stable")}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weight Progression LineChart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-sm hover:bg-white dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>{t("prog_bmi_prog")}</span>
            </h3>
            <p className="text-xs text-slate-400">{t("prog_bmi_prog_sub")}</p>
          </div>

          <div className="h-64 w-full">
            {filteredLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredLogs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#16A34A" fontSize={11} tickLine={false} label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', style: {fontSize: 10, fill: '#16A34A'} }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#84CC16" fontSize={11} tickLine={false} label={{ value: 'BMI', angle: 90, position: 'insideRight', style: {fontSize: 10, fill: '#84CC16'} }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#16A34A" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="bmi" stroke="#84CC16" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                {t("prog_no_logs")}
              </div>
            )}
          </div>
        </div>

        {/* Fluids and calories BarChart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-sm hover:bg-white dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{t("prog_cal_cons")}</h3>
            <p className="text-xs text-slate-400">{t("prog_cal_cons_sub")}</p>
          </div>

          <div className="h-64 w-full">
            {filteredLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredLogs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="caloriesConsumed" fill="#F97316" radius={[4, 4, 0, 0]} name="Calories (kcal)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                {t("prog_no_logs")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed History Table */}
      <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-sm transition-all duration-300 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800/50 pb-4">
          <List className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{t("prog_raw_history")}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">{t("prog_date")}</th>
                <th className="py-3 px-4 font-bold">{t("prog_weight")}</th>
                <th className="py-3 px-4 font-bold">{t("prog_calories")}</th>
                <th className="py-3 px-4 font-bold">{t("prog_water")}</th>
                <th className="py-3 px-4 font-bold text-right">{t("prog_status")}</th>
              </tr>
            </thead>
            <tbody>
              {[...sortedLogs].reverse().map((log, idx) => {
                const statusColor = log.caloriesConsumed > 2500 ? "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30" : "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30";
                const statusText = log.caloriesConsumed > 2500 ? t("prog_warn") : t("prog_ontrack");
                return (
                  <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                    <td className="py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300">{log.date}</td>
                    <td className="py-3 px-4 text-sm font-black text-slate-800 dark:text-white">{log.weight} <span className="text-[10px] text-slate-400">kg</span></td>
                    <td className="py-3 px-4 text-sm font-black text-orange-500">{log.caloriesConsumed} <span className="text-[10px] text-slate-400">kcal</span></td>
                    <td className="py-3 px-4 text-sm font-black text-blue-500">{log.waterIntakeMl} <span className="text-[10px] text-slate-400">ml</span></td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border ${statusColor}`}>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {sortedLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-400 italic">{t("prog_no_history")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
