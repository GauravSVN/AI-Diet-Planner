import React from "react";
import { Radio, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface BroadcastTabProps {
  users: any[];
}

export default function BroadcastTab({ users }: BroadcastTabProps) {
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [targetUser, setTargetUser] = React.useState("all");
  const [status, setStatus] = React.useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const [sending, setSending] = React.useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      setStatus({ type: "error", msg: "Title and message are required." });
      return;
    }
    
    setSending(true);
    setStatus({ type: null, msg: "" });
    const token = localStorage.getItem("auth_token");

    try {
      let targets = [];
      if (targetUser === "all") {
        targets = users.map(u => u.id);
      } else {
        targets = [targetUser];
      }

      // Send to all targets
      const promises = targets.map(userId => 
        fetch("/api/admin/notify", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ userId, title, message, type: "system" })
        }).then(res => res.json())
      );

      await Promise.all(promises);
      
      setStatus({ type: "success", msg: `Notification successfully sent to ${targets.length} user(s).` });
      setTitle("");
      setMessage("");
    } catch (error: any) {
      setStatus({ type: "error", msg: error.message || "Failed to send notification." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Radio className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Broadcast Notifications</h3>
      </div>
      
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] max-w-2xl hover:shadow-[0_15px_40px_rgb(0,0,0,0.16)] dark:hover:shadow-[0_15px_40px_rgba(34,197,94,0.15),inset_0_2px_4px_rgba(255,255,255,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <form onSubmit={handleSend} className="space-y-6 relative z-10">
          {status.type && (
            <div className={`p-4 rounded-xl flex items-center space-x-2 text-sm font-semibold animate-in fade-in zoom-in-95 duration-200 ${status.type === "success" ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"}`}>
              {status.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{status.msg}</span>
            </div>
          )}

          <div className="group">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-green-500 transition-colors">Target Audience</label>
            <select
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] hover:border-green-400 dark:hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-slate-800 dark:text-white"
            >
              <option value="all">All Users (Broadcast)</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-green-500 transition-colors">Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., System Maintenance Update"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] hover:border-green-400 dark:hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-slate-800 dark:text-white"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-green-500 transition-colors">Message Body</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Enter the notification message here..."
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] hover:border-green-400 dark:hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-slate-800 dark:text-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 bg-gradient-to-b from-green-500 to-green-600 border-b-4 border-green-700 hover:brightness-110 active:border-b-0 active:translate-y-1 text-white font-bold rounded-xl shadow-[0_5px_15px_rgba(22,163,74,0.4)] dark:shadow-[0_5px_15px_rgba(22,163,74,0.2)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
          >
            <Send className={`h-4 w-4 ${sending ? 'animate-pulse' : 'group-hover:translate-x-1'} transition-transform`} />
            <span>{sending ? "Sending..." : "Send Notification"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
