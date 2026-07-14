import React from "react";
import { CalendarDays, ShoppingBag, CheckSquare, Square, Printer, Info, CheckCircle2, RefreshCcw, CalendarClock, Flame, Download } from "lucide-react";
import { DietPlan } from "../types";
import { useLanguage } from "../LanguageContext";

interface MealPlannerViewProps {
  plan: DietPlan | null;
}

export default function MealPlannerView({ plan }: MealPlannerViewProps) {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = React.useState<number>(1);
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
  const [eatenMeals, setEatenMeals] = React.useState<Record<string, boolean>>({});

  // Helper to introduce variety across days by utilizing healthy alternatives
  const getVariedMealName = (mealDetail: any, day: number) => {
    if (!mealDetail) return "N/A";
    const baseName = mealDetail.foodName;
    const alts = mealDetail.healthyAlternatives;
    
    if (day === 1 || !alts || alts.length === 0) {
      return baseName;
    }
    
    // Deterministically pick an alternative based on the day
    const altIndex = (day - 2) % alts.length;
    return alts[altIndex] || baseName;
  };

  const toggleEaten = (mealId: string) => {
    setEatenMeals((prev) => ({ ...prev, [mealId]: !prev[mealId] }));
  };

  const getMealId = (day: number, mealType: string) => `day${day}-${mealType}`;

  if (!plan) {
    return (
      <div id="no-meal-plan-state" className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl rounded-3xl border border-slate-100 dark:border-green-900/40 p-8 text-center space-y-4 max-w-lg mx-auto shadow-xl hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-green-900/30 rounded-full w-fit mx-auto">
          <CalendarDays className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t("meal_no_plan")}</h3>
          <p className="text-slate-500 dark:text-emerald-200/70 text-sm mt-1">
            {t("meal_no_plan_sub")}
          </p>
        </div>
      </div>
    );
  }

  const days = [
    { num: 1, label: `${t("meal_day")} 1`, code: t("meal_mon") },
    { num: 2, label: `${t("meal_day")} 2`, code: t("meal_tue") },
    { num: 3, label: `${t("meal_day")} 3`, code: t("meal_wed") },
    { num: 4, label: `${t("meal_day")} 4`, code: t("meal_thu") },
    { num: 5, label: `${t("meal_day")} 5`, code: t("meal_fri") },
    { num: 6, label: `${t("meal_day")} 6`, code: t("meal_sat") },
    { num: 7, label: `${t("meal_day")} 7`, code: t("meal_sun") },
  ];

  // Derive static shopping list items based on active plan ingredients
  const shoppingList = [
    { id: "item-1", name: "Avocados (Fresh)", qty: "3 pcs", category: "Produce" },
    { id: "item-2", name: "Organic Rolled Oats", qty: "500 grams", category: "Grains" },
    { id: "item-3", name: "Fresh Blueberries / Berries", qty: "1 pack", category: "Produce" },
    { id: "item-4", name: "Brown Rice", qty: "1 kg", category: "Grains" },
    { id: "item-5", name: "Chia Seeds", qty: "100 grams", category: "Superfoods" },
    { id: "item-6", name: "Firm Tofu / Fresh Paneer", qty: "600 grams", category: "Protein" },
    { id: "item-7", name: "Broccoli florets & Spinach", qty: "1 bunch", category: "Produce" },
    { id: "item-8", name: "Almond Milk (Unsweetened)", qty: "1 Litre", category: "Dairy/Alternatives" },
  ];

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      if (!(window as any).html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
          script.onerror = resolve; // Continue even if it fails
        });
      }
      
      if (!(window as any).html2pdf) {
        alert("Failed to load PDF generator. Opening print dialog instead.");
        window.print();
        return;
      }
      
      const htmlContent = `
        <div style="padding: 20px; font-family: sans-serif; color: #333;">
          <h1 style="color: #16a34a; font-size: 24px; margin-bottom: 10px;">Weekly Meal Plan</h1>
          <p style="margin-bottom: 20px;">Daily Targets: ${plan?.dailyCalories || 0} kcal | ${plan?.proteinGrams || 0}g Protein | ${plan?.carbsGrams || 0}g Carbs | ${plan?.fatGrams || 0}g Fat</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6; text-align: left;">
                <th style="padding: 10px; border: 1px solid #e5e7eb;">Meal</th>
                <th style="padding: 10px; border: 1px solid #e5e7eb;">Food</th>
                <th style="padding: 10px; border: 1px solid #e5e7eb;">Quantity</th>
                <th style="padding: 10px; border: 1px solid #e5e7eb;">Calories</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Breakfast</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.breakfast?.foodName || "N/A"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.breakfast?.quantity || "-"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.breakfast?.calories || 0} kcal</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Mid-Morning Snack</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.midMorningSnack?.foodName || "N/A"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.midMorningSnack?.quantity || "-"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.midMorningSnack?.calories || 0} kcal</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Lunch</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.lunch?.foodName || "N/A"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.lunch?.quantity || "-"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.lunch?.calories || 0} kcal</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Evening Snack</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.eveningSnack?.foodName || "N/A"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.eveningSnack?.quantity || "-"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.eveningSnack?.calories || 0} kcal</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Dinner</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.dinner?.foodName || "N/A"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.dinner?.quantity || "-"}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${plan?.meals.dinner?.calories || 0} kcal</td>
              </tr>
            </tbody>
          </table>
          <p style="font-size: 12px; color: #666;">Generated by AI Diet Planner</p>
        </div>
      `;
      
      const opt = {
        margin:       0.5,
        filename:     `meal_plan_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await (window as any).html2pdf().set(opt).from(htmlContent).save();
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("An error occurred while generating PDF. Opening print dialog.");
      window.print();
    }
  };

  const handleSyncCalendar = () => {
    if (!plan) return;
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AI Diet Planner//Meal Planner//EN\n";
    
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + i);
      const dateStr = eventDate.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
      
      const mealTypes = [
        { name: 'Breakfast', time: '080000', end: '083000', desc: plan.meals.breakfast?.foodName || "Breakfast" },
        { name: 'Lunch', time: '130000', end: '133000', desc: plan.meals.lunch?.foodName || "Lunch" },
        { name: 'Dinner', time: '190000', end: '193000', desc: plan.meals.dinner?.foodName || "Dinner" },
        { name: 'Evening Snack', time: '160000', end: '161500', desc: plan.meals.eveningSnack?.foodName || "Evening Snack" }
      ];

      mealTypes.forEach(meal => {
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `DTSTART:${dateStr}T${meal.time}\n`;
        icsContent += `DTEND:${dateStr}T${meal.end}\n`;
        icsContent += `SUMMARY:Meal: ${meal.name}\n`;
        icsContent += `DESCRIPTION:${meal.desc}\n`;
        icsContent += "END:VEVENT\n";
      });
    }
    
    icsContent += "END:VCALENDAR";
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'meal_plan.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalItems = shoppingList.length;
  const checkedCount = shoppingList.filter(item => checkedItems[item.id]).length;
  const progressPct = Math.round((checkedCount / totalItems) * 100) || 0;
  
  const groupedList = shoppingList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof shoppingList[0][]>);

  return (
    <div id="meal-planner-tab" className="space-y-8 animate-in fade-in duration-300">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-100 dark:border-green-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-green-600" />
            <span>{t('meal_title')}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5">{t('meal_subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-center">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-indigo-500" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{t("meal_print")}</span>
          </button>
        </div>
      </div>

      {/* Week days navigator tab */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {days.map((day) => (
          <button
            key={day.num}
            onClick={() => setSelectedDay(day.num)}
            className={`px-5 py-3 rounded-2xl border text-sm font-bold transition-all shrink-0 cursor-pointer ${
              selectedDay === day.num
                ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-100/10"
                : "bg-white text-slate-700 dark:text-white border-slate-100/80 dark:border-slate-800/50 hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-500"
            }`}
          >
            <span>{day.label}</span>
            <span className="text-[10px] block font-medium uppercase mt-0.5 opacity-80">{day.code}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Day meals listing */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{t("meal_timetable").replace("{0}", selectedDay.toString())}</h3>
          </div>
          
          {/* Daily Macro Dashboard */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">{t("dash_calories")}</span>
              <span className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400 flex items-center justify-center space-x-1">
                <Flame className="h-3.5 w-3.5" />
                <span>{plan.dailyCalories}</span>
              </span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">{t("dash_protein")}</span>
              <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">{plan.proteinGrams}g</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">{t("dash_carbs")}</span>
              <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">{plan.carbsGrams}g</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">{t("dash_fats")}</span>
              <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">{plan.fatGrams}g</span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Breakfast row */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 transition-all group ${eatenMeals[getMealId(selectedDay, 'breakfast')] ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex space-x-4 items-start">
                <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs shrink-0 mt-0.5">08:00 AM</div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">{t("meal_breakfast_core")}</span>
                  <span className={`text-sm font-bold block transition-colors ${eatenMeals[getMealId(selectedDay, 'breakfast')] ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400'}`}>{getVariedMealName(plan.meals.breakfast, selectedDay)}</span>
                  <span className="text-xs text-slate-500 dark:text-emerald-200/70 block">Serving: {plan.meals.breakfast.quantity} | {plan.meals.breakfast.calories} kcal</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 sm:mt-0 justify-end w-full sm:w-auto">
                <button onClick={() => toggleEaten(getMealId(selectedDay, 'breakfast'))} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 text-slate-400 transition-all">
                  {eatenMeals[getMealId(selectedDay, 'breakfast')] ? <CheckSquare className="h-4 w-4 text-green-500" /> : <Square className="h-4 w-4" />}
                </button>
                <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 text-slate-400 transition-all">
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mid Snack */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 transition-all group ${eatenMeals[getMealId(selectedDay, 'snack1')] ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex space-x-4 items-start">
                <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs shrink-0 mt-0.5">11:30 AM</div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">{t("diet_mid_morn")}</span>
                  <span className={`text-sm font-bold block transition-colors ${eatenMeals[getMealId(selectedDay, 'snack1')] ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400'}`}>{getVariedMealName(plan.meals.midMorningSnack, selectedDay)}</span>
                  <span className="text-xs text-slate-500 dark:text-emerald-200/70 block">Serving: {plan.meals.midMorningSnack.quantity} | {plan.meals.midMorningSnack.calories} kcal</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 sm:mt-0 justify-end w-full sm:w-auto">
                <button onClick={() => toggleEaten(getMealId(selectedDay, 'snack1'))} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 text-slate-400 transition-all">
                  {eatenMeals[getMealId(selectedDay, 'snack1')] ? <CheckSquare className="h-4 w-4 text-green-500" /> : <Square className="h-4 w-4" />}
                </button>
                <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 text-slate-400 transition-all">
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Lunch row */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 transition-all group ${eatenMeals[getMealId(selectedDay, 'lunch')] ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex space-x-4 items-start">
                <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs shrink-0 mt-0.5">01:30 PM</div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">{t("meal_lunch_core")}</span>
                  <span className={`text-sm font-bold block transition-colors ${eatenMeals[getMealId(selectedDay, 'lunch')] ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400'}`}>{getVariedMealName(plan.meals.lunch, selectedDay)}</span>
                  <span className="text-xs text-slate-500 dark:text-emerald-200/70 block">Serving: {plan.meals.lunch.quantity} | {plan.meals.lunch.calories} kcal</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 sm:mt-0 justify-end w-full sm:w-auto">
                <button onClick={() => toggleEaten(getMealId(selectedDay, 'lunch'))} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 text-slate-400 transition-all">
                  {eatenMeals[getMealId(selectedDay, 'lunch')] ? <CheckSquare className="h-4 w-4 text-green-500" /> : <Square className="h-4 w-4" />}
                </button>
                <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 text-slate-400 transition-all">
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Dinner row */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 transition-all group ${eatenMeals[getMealId(selectedDay, 'dinner')] ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex space-x-4 items-start">
                <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs shrink-0 mt-0.5">08:00 PM</div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">{t("meal_dinner_core")}</span>
                  <span className={`text-sm font-bold block transition-colors ${eatenMeals[getMealId(selectedDay, 'dinner')] ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400'}`}>{getVariedMealName(plan.meals.dinner, selectedDay)}</span>
                  <span className="text-xs text-slate-500 dark:text-emerald-200/70 block">Serving: {plan.meals.dinner.quantity} | {plan.meals.dinner.calories} kcal</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 sm:mt-0 justify-end w-full sm:w-auto">
                <button onClick={() => toggleEaten(getMealId(selectedDay, 'dinner'))} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 text-slate-400 transition-all">
                  {eatenMeals[getMealId(selectedDay, 'dinner')] ? <CheckSquare className="h-4 w-4 text-green-500" /> : <Square className="h-4 w-4" />}
                </button>
                <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 text-slate-400 transition-all">
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Smart Shopping list */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800/50 pb-3">
              <ShoppingBag className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{t("meal_shop_title")}</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-emerald-200/70">{t("meal_progress")}</span>
                <span className="text-green-600">{checkedCount} {t("meal_items_of").replace("{0}", totalItems.toString())}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500 ease-out" 
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-72 pr-2 scrollbar-thin relative">
              {Object.entries(groupedList).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm py-1 z-10">{category}</h4>
                  {items.map((item) => {
                    const isChecked = checkedItems[item.id] || false;
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                          isChecked
                            ? "bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/50 text-slate-400 dark:text-slate-500 line-through"
                            : "bg-white dark:bg-black/40 border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 text-slate-700 dark:text-white hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {isChecked ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-600 dark:text-green-500 shrink-0" />
                          ) : (
                            <Square className="h-4.5 w-4.5 text-slate-300 dark:text-slate-600 shrink-0" />
                          )}
                          <span className="text-sm font-semibold">{item.name}</span>
                        </div>
                        <span className="text-xs font-medium bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-slate-500 dark:text-emerald-200/70">{item.qty}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 text-center">
            <span className="text-xs text-slate-400 font-bold">{t("meal_cache_msg")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
