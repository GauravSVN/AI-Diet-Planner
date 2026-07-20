import React from "react";
import { Star, MessageSquare } from "lucide-react";

export default function FeedbackTab() {
  const [feedbacks, setFeedbacks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/feedback")
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data.feedbacks || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <MessageSquare className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">User Feedbacks & Reviews</h3>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Loading feedbacks...</div>
      ) : feedbacks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {feedbacks.map((fb, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 dark:text-white">{fb.name || "Anonymous User"}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">{new Date(fb.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full border border-amber-100 dark:border-amber-500/20">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{fb.rating}</span>
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 leading-relaxed italic">
                "{fb.message}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30">
          <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-600 dark:text-slate-400">No feedbacks yet</h4>
          <p className="text-xs text-slate-400 mt-1">Users haven't submitted any platform reviews.</p>
        </div>
      )}
    </div>
  );
}
