import React from "react";
import { 
  Printer, 
  Mail, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Coffee, 
  ChevronRight, 
  RotateCcw, 
  UtensilsCrossed,
  Info,
  Activity,
  Droplet,
  Award,
  Clock,
  Target,
  CheckCircle2,
  Calendar,
  FileSpreadsheet
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { DietPlan } from "../types";
import { useLanguage } from "../LanguageContext";

interface DietPlanViewProps {
  plan: DietPlan | null;
  onNavigateTab: (tab: string) => void;
}

export default function DietPlanView({ plan, onNavigateTab }: DietPlanViewProps) {
  const { t } = useLanguage();
  const [activeMealKey, setActiveMealKey] = React.useState<string>("breakfast");
  const [emailSent, setEmailSent] = React.useState(false);
  const [isEmailing, setIsEmailing] = React.useState(false);
  const [waterIntake, setWaterIntake] = React.useState(0);

  if (!plan) {
    return (
      <div id="no-diet-plan-state" className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl rounded-3xl border border-slate-150 dark:border-green-900/40 p-8 text-center space-y-6 max-w-lg mx-auto shadow-xl shadow-slate-100/50 hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div className="p-5 bg-green-50 dark:bg-green-950/40 rounded-full w-fit mx-auto border border-green-100 dark:border-green-900/50 shadow-inner">
          <Activity className="h-10 w-10 text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white dark:text-white tracking-tight">{t('diet_no_plan')}</h3>
          <p className="text-slate-500 dark:text-emerald-200/70 text-sm mt-1">
            {t('diet_no_plan_sub')}
          </p>
        </div>
        <button
          onClick={() => onNavigateTab("assessment")}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all cursor-pointer"
        >
          {t('diet_go_assessment')}
        </button>
      </div>
    );
  }

  // Chart data: Macros distribution
  const macroData = [
    { name: t('diet_carbs'), value: plan.carbsGrams * 4, grams: plan.carbsGrams, color: "#22C55E" }, // 4 kcal/g
    { name: t('diet_protein'), value: plan.proteinGrams * 4, grams: plan.proteinGrams, color: "#16A34A" }, // 4 kcal/g
    { name: t('diet_fats'), value: plan.fatGrams * 9, grams: plan.fatGrams, color: "#84CC16" }, // 9 kcal/g
  ];

  // Meals data for summary chart
  const mealsChartData = [
    { name: "M", Calories: plan.meals.morningDrink.calories, Protein: plan.meals.morningDrink.protein },
    { name: "B", Calories: plan.meals.breakfast.calories, Protein: plan.meals.breakfast.protein },
    { name: "S1", Calories: plan.meals.midMorningSnack.calories, Protein: plan.meals.midMorningSnack.protein },
    { name: "L", Calories: plan.meals.lunch.calories, Protein: plan.meals.lunch.protein },
    { name: "S2", Calories: plan.meals.eveningSnack.calories, Protein: plan.meals.eveningSnack.protein },
    { name: "D", Calories: plan.meals.dinner.calories, Protein: plan.meals.dinner.protein },
    { name: "N", Calories: plan.meals.beforeSleep.calories, Protein: plan.meals.beforeSleep.protein },
  ];

  const mealOptions = [
    { key: "morningDrink", label: t("diet_wake"), sub: t("diet_wake_sub") },
    { key: "breakfast", label: t("diet_breakfast"), sub: t("diet_breakfast_sub") },
    { key: "midMorningSnack", label: t("diet_mid_morn"), sub: t("diet_mid_morn_sub") },
    { key: "lunch", label: t("diet_lunch"), sub: t("diet_lunch_sub") },
    { key: "eveningSnack", label: t("diet_eve_snack"), sub: t("diet_eve_snack_sub") },
    { key: "dinner", label: t("diet_dinner"), sub: t("diet_dinner_sub") },
    { key: "beforeSleep", label: t("diet_sleep"), sub: t("diet_sleep_sub") },
  ];

  const activeMeal = (plan.meals as any)[activeMealKey];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      // If already loaded
      if ((window as any).html2pdf) {
        await generatePDF();
        return;
      }

      // Load script
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      
      script.onload = async () => {
        try {
          await generatePDF();
        } catch (err) {
          console.error("PDF generation failed:", err);
          alert("Could not generate PDF automatically. Opening print dialog to save as PDF.");
          window.print();
        }
      };

      script.onerror = () => {
        console.error("Failed to load html2pdf");
        alert("Failed to load PDF generator. Opening print dialog to save as PDF.");
        window.print();
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  const getPDFHtmlContent = () => {
    if (!plan || !plan.meals) return null;
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333;">
        <h1 style="color: #16a34a; text-align: center; margin-bottom: 10px;">Your Personalized Diet Plan</h1>
        <p style="text-align: center; color: #666; margin-bottom: 40px;">Generated by AI Dietitian</p>
        
        <div style="margin-bottom: 30px; background: #f0fdf4; padding: 20px; border-radius: 10px;">
          <h2 style="margin-top: 0; color: #166534;">Daily Targets</h2>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 20px;">
            <li><strong>Calories:</strong> ${plan.dailyCalories} kcal</li>
            <li><strong>Protein:</strong> ${plan.proteinGrams}g</li>
            <li><strong>Carbs:</strong> ${plan.carbsGrams}g</li>
            <li><strong>Fat:</strong> ${plan.fatGrams}g</li>
            <li><strong>Fiber:</strong> ${plan.fiberGrams}g</li>
            <li><strong>Water:</strong> ${plan.waterIntakeLitres} L</li>
          </ul>
        </div>

        <h2 style="color: #166534; border-bottom: 2px solid #bbf7d0; padding-bottom: 10px;">Meal Schedule</h2>
        
        ${Object.entries({
          morningDrink: t('meal_morning_drink'),
          breakfast: t('meal_breakfast'),
          midMorningSnack: t('meal_mid_snack'),
          lunch: t('meal_lunch'),
          eveningSnack: t('meal_eve_snack'),
          dinner: t('meal_dinner'),
          beforeSleep: t('meal_before_sleep')
        }).map(([key, label]) => {
          const meal = (plan.meals as any)[key];
          if (!meal) return '';
          return `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
              <h3 style="color: #15803d; margin-bottom: 10px;">${label}</h3>
              <p style="margin: 5px 0;"><strong>Food:</strong> ${meal.foodName} (${meal.quantity})</p>
              <div style="font-size: 14px; color: #555;">
                <span style="margin-right: 15px;">🔥 ${meal.calories} kcal</span>
                <span style="margin-right: 15px;">🥩 ${meal.protein}g Protein</span>
                <span style="margin-right: 15px;">🍞 ${meal.carbs}g Carbs</span>
                <span>🥑 ${meal.fat}g Fat</span>
              </div>
            </div>
          `;
        }).join('')}
        
        <div style="margin-top: 40px; font-size: 12px; color: #999; text-align: center;">
          <p>Please consult with a healthcare provider before making major changes to your diet.</p>
        </div>
      </div>
    `;
  };

  const generatePDF = async () => {
    const htmlContent = getPDFHtmlContent();
    if (!htmlContent) return;
    
    const opt = {
      margin:       0,
      filename:     `diet_plan_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Save the PDF using the HTML string
    await (window as any).html2pdf().set(opt).from(htmlContent).save();
  };

  const handleEmailPlan = async () => {
    const htmlContent = getPDFHtmlContent();
    if (!htmlContent) return;
    
    setIsEmailing(true);

    try {
      const opt = {
        margin:       0,
        filename:     `diet_plan_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Load html2pdf if not loaded
      if (!(window as any).html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Output base64 URI
      const pdfBase64 = await (window as any).html2pdf().set(opt).from(htmlContent).output('datauristring');
      
      const token = localStorage.getItem("auth_token");
      
      const response = await fetch("/api/email-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ pdfBase64 })
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
      }, 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to email the diet plan. Please check your connection or try again later.");
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div id="diet-plan-tab" className="space-y-8 animate-in fade-in duration-300">
      {emailSent && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300 flex items-center space-x-2">
          <Info className="h-4 w-4 shrink-0 text-green-600" />
          <span>{t('diet_email_success')}</span>
        </div>
      )}

      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <UtensilsCrossed className="h-5 w-5 text-green-600" />
            <span>{t('diet_title')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t('diet_subtitle')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            <Award className="h-5 w-5 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-emerald-600/80 tracking-wider">{t('diet_match')}</span>
              <span className="text-sm font-black text-emerald-600">{t('diet_optimal')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-green-500 hover:text-slate-800 dark:hover:text-green-400 hover:bg-slate-50 dark:hover:bg-green-950/30 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-green-500" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={handleEmailPlan}
              disabled={isEmailing}
              className={`px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-green-500 hover:text-slate-800 dark:hover:text-green-400 hover:bg-slate-50 dark:hover:bg-green-950/30 rounded-xl transition-all flex items-center space-x-1.5 ${isEmailing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Mail className={`h-3.5 w-3.5 ${isEmailing ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isEmailing ? 'Sending...' : t('diet_email')}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{t('diet_print')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Water Tracker */}
      <div className="bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              <span>{t('diet_water_title')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">{t('diet_water_sub')}</p>
          </div>
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl font-bold text-sm border border-blue-100 dark:border-blue-800/30 shadow-inner flex items-center space-x-2">
            <span className="text-xl font-black">{waterIntake * 250}</span>
            <span className="text-xs font-bold opacity-70">ml / 2000 ml</span>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
          {[...Array(8)].map((_, i) => (
            <button
              key={i}
              onClick={() => setWaterIntake(i + 1)}
              className={`relative h-14 w-10 sm:h-16 sm:w-12 rounded-t-lg rounded-b-md border-2 transition-all duration-500 overflow-hidden cursor-pointer flex-shrink-0 ${waterIntake > i ? 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'}`}
            >
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700 ease-out`}
                style={{ height: waterIntake > i ? '100%' : '0%' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplet className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-500 ${waterIntake > i ? 'text-white drop-shadow-md' : 'text-slate-300 dark:text-slate-700'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Targets Overview & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Macros summary */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 hover:-translate-y-2 transition-all duration-300 space-y-6 flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block">{t('diet_macro_title')}</h3>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} kcal`}
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#14532d', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#e2e8f0', fontWeight: '600' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/50 pt-6">
            {macroData.map((item, idx) => {
              const totalKcal = plan.calories;
              const percentage = Math.round((item.value / totalKcal) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center space-x-2 text-sm font-bold text-slate-700 dark:text-emerald-50">
                      <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-black text-sm text-slate-800 dark:text-white">
                      {item.grams}g <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800/50 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${percentage}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Bar chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 hover:-translate-y-2 transition-all duration-300 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider block">{t('diet_caloric_load')}</h3>
            <p className="text-xs text-slate-500">{t('diet_caloric_load_sub')}</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealsChartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#22c55e', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#14532d', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#e2e8f0', fontWeight: '600' }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Calories" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Protein" fill="#84CC16" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Meals Navigator */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Meal Side Tabs */}
        <div className="md:col-span-4 space-y-2">
          {mealOptions.map((opt) => {
            const isSelected = activeMealKey === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setActiveMealKey(opt.key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center cursor-pointer ${
                  isSelected
                    ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-100/10"
                    : "bg-white dark:bg-green-950/40 text-slate-700 dark:text-white border-slate-100/80 dark:border-green-800/50 hover:bg-slate-50 dark:hover:bg-green-900/60"
                }`}
              >
                <div>
                  <span className={`text-sm font-bold block ${isSelected ? "text-white" : "text-slate-800 dark:text-white"}`}>
                    {opt.label}
                  </span>
                  <span className={`text-[10px] ${isSelected ? "text-green-100" : "text-slate-400"}`}>
                    {opt.sub}
                  </span>
                </div>
                <ChevronRight className={`h-4 w-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Meal By Meal Breakdown */}
        <div className="md:col-span-8 bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white dark:hover:bg-slate-900/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 hover:-translate-y-2 transition-all duration-300 space-y-6">
          <div className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="inline-flex items-center w-fit space-x-1.5 px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                <Coffee className="h-3.5 w-3.5" />
                <span className="capitalize">{activeMealKey.replace(/([A-Z])/g, " $1")}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {activeMeal?.protein > 15 && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {t("diet_high_pro")}
                  </span>
                )}
                {activeMeal?.calories < 300 && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {t("diet_light_meal")}
                  </span>
                )}
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Clock className="h-3 w-3" />
                  <span>{t("diet_prep_time")}</span>
                </span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight mt-4 mb-1">{activeMeal?.foodName}</h3>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Target className="h-4 w-4" />
              <span>{t("diet_serving")}: {activeMeal?.quantity}</span>
            </span>
          </div>

          {/* Quick Nutritional Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-green-950/40 p-3 rounded-2xl border border-slate-100/60 dark:border-green-800/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('dash_calories')}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">{activeMeal?.calories} kcal</span>
            </div>
            <div className="bg-slate-50 dark:bg-green-950/40 p-3 rounded-2xl border border-slate-100/60 dark:border-green-800/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('dash_protein')}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">{activeMeal?.protein}g</span>
            </div>
            <div className="bg-slate-50 dark:bg-green-950/40 p-3 rounded-2xl border border-slate-100/60 dark:border-green-800/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('dash_carbs')}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">{activeMeal?.carbs}g</span>
            </div>
            <div className="bg-slate-50 dark:bg-green-950/40 p-3 rounded-2xl border border-slate-100/60 dark:border-green-800/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t("diet_fiber")}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">{activeMeal?.fiber}g</span>
            </div>
          </div>

          {/* Cooking Instructions */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{t('diet_instructions')}</h4>
            <p className="text-sm text-slate-600 dark:text-emerald-100/90 leading-relaxed bg-slate-50 dark:bg-green-950/40 p-4 rounded-2xl border border-slate-100/60 dark:border-green-800/50">
              {activeMeal?.cookingInstructions}
            </p>
          </div>

          {/* Healthy Alternatives & Micronutrients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{t("diet_alt")}</h4>
              <div className="flex flex-wrap gap-2">
                {activeMeal?.healthyAlternatives.map((alt: string, index: number) => (
                  <span key={index} className="px-3 py-1.5 bg-green-500/10 text-green-700 text-xs font-semibold rounded-xl">
                    {alt}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{t("diet_vitamins")}</h4>
              <div className="flex flex-wrap gap-2">
                {[...(activeMeal?.vitamins || []), ...(activeMeal?.minerals || [])].map((item: string, index: number) => (
                  <span key={index} className="px-3 py-1.5 bg-slate-100 dark:bg-green-900/40 text-slate-600 dark:text-emerald-100/90 text-xs font-semibold rounded-xl border border-slate-200/40 dark:border-green-800/50">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Clinical Guidance Box */}
      <div className="bg-amber-50 dark:bg-orange-950/40 p-5 rounded-3xl border border-amber-200/60 dark:border-orange-900/50 text-amber-900 dark:text-orange-200 flex items-start space-x-3.5">
        <Info className="h-5 w-5 text-amber-600 dark:text-orange-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm tracking-tight block">{t("diet_guide_title")}</span>
          <p className="text-xs text-amber-800 dark:text-orange-200/80 leading-relaxed">
            {t("diet_guide_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
