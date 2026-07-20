import React, { useState, useEffect } from "react";
import { Shield, Clock, FileText, User as UserIcon, AlertCircle, RefreshCw } from "lucide-react";

export default function AuditLogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/admin/audit-logs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Security Audit Logs</h3>
        </div>
        <button 
          onClick={fetchLogs} 
          disabled={loading}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)]">
        
        {loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="text-sm font-semibold text-slate-500">Decrypting security logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-400">
            <AlertCircle className="h-12 w-12 opacity-50" />
            <p className="font-medium text-sm">No security logs recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-950/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md dark:hover:shadow-blue-900/10 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300 gap-4"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    log.action.includes('DELETE') ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                    log.action.includes('UPDATE') ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}>
                    {log.action.includes('DELETE') ? <AlertCircle className="h-4 w-4" /> : 
                     log.action.includes('UPDATE') ? <FileText className="h-4 w-4" /> : 
                     <UserIcon className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{log.action.replace(/_/g, ' ')}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Admin: <span className="font-medium">{log.adminEmail}</span></p>
                    <p className="text-xs text-slate-500">Target: <span className="font-medium">{log.target}</span></p>
                    {log.details && (
                      <p className="text-[10px] text-slate-400 mt-1 italic">{log.details}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 w-fit shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(log.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
