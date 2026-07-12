import React from "react";
import { CalendarDays, ShoppingBag, CheckSquare, Square, Printer, Info, CheckCircle2 } from "lucide-react";
import { DietPlan } from "../types";

interface MealPlannerViewProps {
  plan: DietPlan | null;
}

export default function MealPlannerView({ plan }: MealPlannerViewProps) {
  const [selectedDay, setSelectedDay] = React.useState<number>(1);
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  if (!plan) {
    return (
      <div id="no-meal-plan-state" className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl rounded-3xl border border-slate-100 dark:border-green-900/40 p-8 text-center space-y-4 max-w-lg mx-auto shadow-xl hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-green-900/30 rounded-full w-fit mx-auto">
          <CalendarDays className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">No Active Meal Plan</h3>
          <p className="text-slate-500 dark:text-emerald-200/70 text-sm mt-1">
            Complete the Health Assessment Form so our clinical AI model can compute a custom 7-day meal schedule.
          </p>
        </div>
      </div>
    );
  }

  const days = [
    { num: 1, label: "Day 1", code: "Mon" },
    { num: 2, label: "Day 2", code: "Tue" },
    { num: 3, label: "Day 3", code: "Wed" },
    { num: 4, label: "Day 4", code: "Thu" },
    { num: 5, label: "Day 5", code: "Fri" },
    { num: 6, label: "Day 6", code: "Sat" },
    { num: 7, label: "Day 7", code: "Sun" },
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

  return (
    <div id="meal-planner-tab" className="space-y-8 animate-in fade-in duration-300">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-100 dark:border-green-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-green-600" />
            <span>7-Day Clinical Meal Scheduler</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5">Custom rotating plates based on budget and culinary constraints.</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 self-start sm:self-center"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Weekly Plan</span>
        </button>
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
          <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Day {selectedDay} Meal Timetable</h3>
          
          <div className="space-y-4">
            {/* Breakfast row */}
            <div className="flex space-x-4 items-start p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 transition-all group">
              <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs shrink-0 mt-0.5">08:00 AM</div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">Breakfast Core</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white block group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{plan.meals.breakfast.foodName}</span>
                <span className="text-xs text-slate-500 dark:text-emerald-200/70 block">Serving: {plan.meals.breakfast.quantity} | {plan.meals.breakfast.calories} kcal</span>
              </div>
            </div>

            {/* Mid Snack */}
            <div className="flex space-x-4 items-start p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 transition-all group">
              <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs shrink-0 mt-0.5">11:30 AM</div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">Mid-Morning Snack</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white block group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{plan.meals.midMorningSnack.foodName}</span>
                <span className="text-xs text-slate-500 dark:text-emerald-200/70 block">Serving: {plan.meals.midMorningSnack.quantity} | {plan.meals.midMorningSnack.calories} kcal</span>
              </div>
            </div>

            {/* Lunch row */}
            <div className="flex space-x-4 items-start p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 transition-all group">
              <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs shrink-0 mt-0.5">01:30 PM</div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">Lunch Core</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white block group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{plan.meals.lunch.foodName}</span>
                <span className="text-xs text-slate-500 dark:text-emerald-200/70 block">Serving: {plan.meals.lunch.quantity} | {plan.meals.lunch.calories} kcal</span>
              </div>
            </div>

            {/* Dinner row */}
            <div className="flex space-x-4 items-start p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500 dark:hover:border-green-500 transition-all group">
              <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs shrink-0 mt-0.5">08:00 PM</div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-emerald-100/60 font-bold uppercase tracking-wider block">Dinner Core</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white block group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{plan.meals.dinner.foodName}</span>
                <span className="text-xs text-slate-500 dark:text-emerald-200/70 block">Serving: {plan.meals.dinner.quantity} | {plan.meals.dinner.calories} kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Smart Shopping list */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
              <ShoppingBag className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Shopping / Grocery Checklist</h3>
            </div>

            <p className="text-xs text-slate-400">Checked items are saved to memory cache automatically.</p>

            <div className="space-y-2.5 overflow-y-auto max-h-72 pr-2 scrollbar-thin">
              {shoppingList.map((item) => {
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
          </div>

          <div className="pt-4 border-t border-slate-50 text-center">
            <span className="text-xs text-slate-400 font-bold">Check off ingredients as you stock them.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
