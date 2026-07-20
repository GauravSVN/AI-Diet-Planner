import React from "react";
import { Activity, Server, Clock, Database, CheckCircle2 } from "lucide-react";

export default function HealthTab() {
  const [healthData, setHealthData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem("auth_token");
    fetch("/api/admin/health", { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setHealthData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatUptime = (seconds: number) => {
    if (!seconds) return "Unknown";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading system metrics...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Activity className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">System Health & API Logs</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] flex items-center space-x-4 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_15px_40px_rgba(16,185,129,0.15),inset_0_2px_4px_rgba(255,255,255,0.05)] hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 group cursor-default relative overflow-hidden">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] transition-all duration-300 relative z-10">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Status</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{healthData?.status || "Unknown"}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] flex items-center space-x-4 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_15px_40px_rgba(59,130,246,0.15),inset_0_2px_4px_rgba(255,255,255,0.05)] hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300 group cursor-default relative overflow-hidden">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] transition-all duration-300 relative z-10">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Uptime</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{formatUptime(healthData?.uptime)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] flex items-center space-x-4 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_15px_40px_rgba(168,85,247,0.15),inset_0_2px_4px_rgba(255,255,255,0.05)] hover:border-purple-300 dark:hover:border-purple-700/50 transition-all duration-300 group cursor-default relative overflow-hidden">
          <div className="p-4 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] transition-all duration-300 relative z-10">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Memory Usage</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{healthData?.memory?.rss || "Unknown"}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] space-y-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">API Services & Integration Health</h4>
        <div className="space-y-3">
          {healthData?.apis?.map((api: any, idx: number) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(34,197,94,0.1)] dark:hover:shadow-[0_10px_20px_rgba(34,197,94,0.1),inset_0_2px_6px_rgba(0,0,0,0.4)] hover:border-green-300 dark:hover:border-green-700/50 transition-all duration-300 cursor-default group">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <Database className="h-5 w-5 text-slate-400 group-hover:text-green-500 transition-colors" />
                <span className="font-bold text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{api.name}</span>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span><span className="text-slate-500 dark:text-slate-400 font-medium">{api.status}</span></span>
                <span className="text-slate-500 dark:text-slate-400">Latency: <span className="font-semibold text-slate-700 dark:text-slate-300">{api.latency}</span></span>
                <span className="text-slate-500 dark:text-slate-400">Calls: <span className="font-semibold text-slate-700 dark:text-slate-300">{api.callsToday}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
