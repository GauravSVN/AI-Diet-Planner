import React, { useState, useEffect } from "react";
import { Settings, Save, AlertCircle, Sparkles } from "lucide-react";

export default function PromptTuningTab() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/admin/config", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPrompt(data.prompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prompt.trim()) return;
    setSaving(true);
    setStatus({ type: null, msg: "" });
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });
      
      if (res.ok) {
        setStatus({ type: "success", msg: "AI Prompt updated successfully! Diet plans will now use these new instructions." });
      } else {
        const errorData = await res.json();
        setStatus({ type: "error", msg: errorData.error || "Failed to update prompt." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "An error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Sparkles className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">AI Prompt Tuning Center</h3>
      </div>
      
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] relative overflow-hidden">
        <div className="space-y-6 relative z-10">
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Base AI Instructions (System Prompt)</h4>
            <p className="text-xs text-slate-400 mb-4">
              Modify the underlying instructions provided to Google Gemini AI. These instructions govern how the AI speaks, what tone it uses, and how strictly it adheres to clinical dietary restrictions. 
              <strong> Warning: Changes here will immediately affect all user assessments!</strong>
            </p>
            
            {status.type && (
              <div className={`p-4 mb-4 rounded-xl flex items-center space-x-2 text-sm font-semibold animate-in fade-in zoom-in-95 duration-200 ${status.type === "success" ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"}`}>
                <AlertCircle className="h-5 w-5" />
                <span>{status.msg}</span>
              </div>
            )}

            <div className="group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={12}
                disabled={loading}
                placeholder="Loading prompt..."
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] hover:border-green-400 dark:hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-slate-800 dark:text-white resize-none font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading || !prompt}
            className="px-6 py-3 bg-gradient-to-b from-green-500 to-green-600 border-b-4 border-green-700 hover:brightness-110 active:border-b-0 active:translate-y-1 text-white font-bold rounded-xl shadow-[0_5px_15px_rgba(22,163,74,0.4)] dark:shadow-[0_5px_15px_rgba(22,163,74,0.2)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? "Saving Changes..." : "Deploy AI Configuration"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
