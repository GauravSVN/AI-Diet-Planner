import React from "react";
import { MessageSquare, Star, CheckCircle, Quote, Sparkles } from "lucide-react";

interface FeedbackViewProps {
  onAddFeedback: (feedbackText: string, rating: number) => void;
  feedbacks: any[];
}

export default function FeedbackView({ onAddFeedback, feedbacks }: FeedbackViewProps) {
  const [rating, setRating] = React.useState(5);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddFeedback(comment, rating);
    setComment("");
    setRating(5);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div id="feedback-tab" className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-100 dark:border-green-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <span>Patient & User Feedback Hub</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5">Submit reviews and feature requests directly to our nutritionist research group.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="md:col-span-5 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-5 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block">Submit Your Feedback</h3>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center space-x-1.5 animate-bounce">
              <CheckCircle className="h-4 w-4" />
              <span>Feedback submitted successfully!</span>
            </div>
          )}

          {/* Star selector */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Rating</span>
            <div className="flex space-x-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(null)}
                  className="p-1.5 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hovered ?? rating) ? "text-amber-500 fill-amber-500" : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Comment / Suggestions</span>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm focus:outline-none transition-all"
              placeholder="e.g. The diet metrics are incredibly detailed! I'd love a meal replacer option in the upcoming build..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
          >
            Submit Feedback
          </button>
        </form>

        {/* Right Testimonials deck */}
        <div className="md:col-span-7 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block">Community Highlights</h3>
            <p className="text-xs text-slate-400">See what other users in the AI Nutrition planner community are saying.</p>

            <div className="space-y-4 overflow-y-auto max-h-72 pr-2 scrollbar-thin">
              {feedbacks.length > 0 ? (
                feedbacks.map((f, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 relative space-y-3.5 hover:border-green-500/50 transition-all group">
                    <Quote className="h-8 w-8 text-green-500/10 group-hover:text-green-500/20 transition-colors absolute top-2.5 right-3" />
                    
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= f.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-emerald-100/90 leading-relaxed italic">"{f.comment}"</p>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                      <span>User: {f.userName || "Community Member"}</span>
                      <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No community feedback submitted yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
