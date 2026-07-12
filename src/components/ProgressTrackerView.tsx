import React from "react";
import { TrendingUp, Award, Calendar, Activity, Zap } from "lucide-react";
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

interface ProgressTrackerViewProps {
  logs: ProgressLog[];
}

export default function ProgressTrackerView({ logs }: ProgressTrackerViewProps) {
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/60 dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/60 dark:border-green-900/40 shadow-sm hover:bg-white/90 dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Progress & Metrics History Tracker</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Visualize your metabolic indicators, weight changes, and caloric intake charts.</p>
        </div>
        
        {/* Weekly / Monthly Toggle button */}
        <div className="flex bg-slate-100 dark:bg-black/40 border dark:border-slate-800/50 p-1 rounded-xl shrink-0 w-fit self-start sm:self-center">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timeframe === "weekly" ? "bg-green-600 text-white shadow-md shadow-green-100/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-green-400 hover:bg-white dark:hover:bg-slate-800"
            }`}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timeframe === "monthly" ? "bg-green-600 text-white shadow-md shadow-green-100/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-green-400 hover:bg-white dark:hover:bg-slate-800"
            }`}
          >
            Monthly Report
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/60 dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/60 dark:border-green-900/40 shadow-sm hover:bg-white/90 dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weight Change</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              {weightChange > 0 ? `+${weightChange}` : weightChange} kg
            </p>
            <span className="text-[10px] text-slate-400 font-medium">Since first log</span>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/60 dark:border-green-900/40 shadow-sm hover:bg-white/90 dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Daily Calories</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{avgCal} kcal</p>
            <span className="text-[10px] text-slate-400 font-medium">For selected period</span>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/60 dark:border-green-900/40 shadow-sm hover:bg-white/90 dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Daily Fluids</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{avgWater} ml</p>
            <span className="text-[10px] text-slate-400 font-medium">For selected period</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weight Progression LineChart */}
        <div className="lg:col-span-7 bg-white/60 dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 dark:border-green-900/40 shadow-sm hover:bg-white/90 dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Weight & BMI Progression</span>
            </h3>
            <p className="text-xs text-slate-400">Track standard physical indicators from log entries.</p>
          </div>

          <div className="h-64 w-full">
            {filteredLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredLogs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#16A34A" fontSize={11} tickLine={false} label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', style: {fontSize: 10, fill: '#16A34A'} }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#84CC16" fontSize={11} tickLine={false} label={{ value: 'BMI', angle: 90, position: 'insideRight', style: {fontSize: 10, fill: '#84CC16'} }} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#16A34A" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="bmi" stroke="#84CC16" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                No logs recorded yet. Add parameters in the home tab log.
              </div>
            )}
          </div>
        </div>

        {/* Fluids and calories BarChart */}
        <div className="lg:col-span-5 bg-white/60 dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 dark:border-green-900/40 shadow-sm hover:bg-white/90 dark:hover:bg-slate-950/80 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Calories Consumed</h3>
            <p className="text-xs text-slate-400">Daily calorie log counts compared side by side.</p>
          </div>

          <div className="h-64 w-full">
            {filteredLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredLogs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="caloriesConsumed" fill="#F97316" radius={[4, 4, 0, 0]} name="Calories (kcal)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                No logs recorded yet. Add parameters in the home tab log.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
