import React from "react";
import { MessageSquare, Star, CheckCircle, Quote, Sparkles, ThumbsUp, BadgeCheck, Zap, Activity } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface FeedbackViewProps {
  onAddFeedback: (feedbackText: string, rating: number, category?: string) => void;
  feedbacks: any[];
}

export default function FeedbackView({ onAddFeedback, feedbacks }: FeedbackViewProps) {
  const { t } = useLanguage();
  const [rating, setRating] = React.useState(5);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState("");
  const [category, setCategory] = React.useState("Appreciation");
  const [success, setSuccess] = React.useState(false);

  // Maintain English values for state but use translated display strings
  const categories = [
    { val: "Appreciation", label: t("fb_cat_appr") },
    { val: "Feature Request", label: t("fb_cat_feat") },
    { val: "Diet Plan", label: t("fb_cat_diet") },
    { val: "Bug Report", label: t("fb_cat_bug") }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.length > 500) return;

    onAddFeedback(`[${category}] ${comment}`, rating, category);
    setComment("");
    setRating(5);
    setCategory("Appreciation");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) : "0.0";
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = feedbacks.filter(f => f.rating === star).length;
    return { star, count, pct: feedbacks.length ? (count / feedbacks.length) * 100 : 0 };
  });

  return (
    <div id="feedback-tab" className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-100 dark:border-green-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <span>{t("fb_title")}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5">{t("fb_sub")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="md:col-span-5 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-5 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block">{t("fb_submit_title")}</h3>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center space-x-1.5 animate-bounce">
              <CheckCircle className="h-4 w-4" />
              <span>{t("fb_success")}</span>
            </div>
          )}

          {/* Star selector */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t("fb_rating")}</span>
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
                      star <= (hovered ?? rating) ? "text-amber-500 fill-amber-500" : "text-slate-200 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t("fb_category")}</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(({val, label}) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCategory(val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    category === val 
                      ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20" 
                      : "bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-green-400 dark:hover:border-green-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t("fb_comment")}</span>
              <span className={`text-[10px] font-bold ${comment.length > 500 ? "text-red-500" : "text-slate-400"}`}>{comment.length}/500</span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm focus:outline-none transition-all"
              placeholder={t("fb_placeholder")}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
          >
            {t("fb_btn_submit")}
          </button>
        </form>

        {/* Right Testimonials deck */}
        <div className="md:col-span-7 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block">{t("fb_community")}</h3>
            
            {/* Aggregate Dashboard */}
            {feedbacks.length > 0 && (
              <div className="flex items-center space-x-6 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="text-center">
                  <span className="text-4xl font-black text-slate-800 dark:text-white">{avgRating}</span>
                  <div className="flex justify-center mt-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${s <= Number(avgRating) ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-600"}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 block uppercase">{feedbacks.length} {t("fb_reviews")}</span>
                </div>
                <div className="flex-1 space-y-1.5 border-l border-slate-200 dark:border-slate-700 pl-6">
                  {ratingDistribution.map(({ star, pct }) => (
                    <div key={star} className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                      <span className="w-2">{star}</span>
                      <Star className="h-2.5 w-2.5 text-slate-400" />
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 overflow-y-auto max-h-72 pr-2 scrollbar-thin">
              {feedbacks.length > 0 ? (
                feedbacks.map((f, idx) => {
                  const isPositive = f.rating >= 4;
                  return (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 relative space-y-3.5 hover:border-green-500/50 transition-all group">
                      <Quote className="h-8 w-8 text-green-500/10 group-hover:text-green-500/20 transition-colors absolute top-2.5 right-3" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= f.rating ? "text-amber-500 fill-amber-500" : "text-slate-200 dark:text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        {/* AI Sentiment Badge */}
                        <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase tracking-wider ${isPositive ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200 dark:border-green-800/50' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-800/50'}`}>
                          {isPositive ? <Activity className="h-2.5 w-2.5" /> : <Zap className="h-2.5 w-2.5" />}
                          <span>{isPositive ? t("fb_highly_pos") : t("fb_constructive")}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-emerald-100/90 leading-relaxed italic">"{f.comment}"</p>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase pt-2 border-t border-slate-200/50 dark:border-slate-800">
                        <div className="flex items-center space-x-1">
                          <BadgeCheck className="h-3 w-3 text-blue-500" />
                          <span>{f.userName || t("fb_community_member")}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                          <button className="flex items-center space-x-1 hover:text-green-600 transition-colors cursor-pointer group/btn">
                            <ThumbsUp className="h-3 w-3 group-hover/btn:scale-110 transition-transform" />
                            <span>{t("fb_helpful")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  {t("fb_no_feedback")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
