import React from "react";
import { Activity, ShieldAlert, Sparkles, Scale, Info } from "lucide-react";

export default function BmiCalculatorView() {
  const [height, setHeight] = React.useState<number>(170); // in cm
  const [weight, setWeight] = React.useState<number>(70); // in kg
  const [age, setAge] = React.useState<number>(25); // years
  const [gender, setGender] = React.useState<"male" | "female">("male");

  const heightM = height / 100;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));

  // Medical BMI Ranges
  // Underweight: < 18.5
  // Normal: 18.5 - 24.9
  // Overweight: 25.0 - 29.9
  // Obese: >= 30.0
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: "Underweight", color: "text-blue-500 bg-blue-50 border-blue-200" };
    if (val < 25) return { label: "Normal Weight", color: "text-green-600 bg-green-50 border-green-200" };
    if (val < 30) return { label: "Overweight", color: "text-orange-500 bg-orange-50 border-orange-200" };
    return { label: "Obese", color: "text-rose-600 bg-rose-50 border-rose-200" };
  };

  const category = getBmiCategory(bmi);

  // BFP Formula (Deurenberg)
  const genderValue = gender === "male" ? 1 : 0;
  const bfp = Number(((1.20 * bmi) + (0.23 * age) - (10.8 * genderValue) - 5.4).toFixed(1));

  // Health Risk logic
  const getHealthRisk = (val: number) => {
    if (val < 18.5) return { level: "Moderate Risk", color: "text-amber-600 bg-amber-50 border-amber-200" };
    if (val < 25) return { level: "Low Risk", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (val < 30) return { level: "Increased Risk", color: "text-orange-600 bg-orange-50 border-orange-200" };
    return { level: "High Risk", color: "text-red-600 bg-red-50 border-red-200" };
  };
  const healthRisk = getHealthRisk(bmi);

  // Ideal weight based on Devine formula
  const minIdeal = Number((18.5 * heightM * heightM).toFixed(1));
  const maxIdeal = Number((24.9 * heightM * heightM).toFixed(1));

  const getClinicalSuggestions = (val: number) => {
    if (val < 18.5) {
      return "Focus on complex carbohydrates and high-quality protein to support lean muscle mass reconstruction. Add nutrient-dense fats like avocados, walnuts, and seeds into daily snacks.";
    }
    if (val < 25) {
      return "Excellent! You are in the optimal clinical BMI category. Maintain a balanced diet of whole grains, lean proteins, and stay hydrated with at least 2.5 Litres of water daily.";
    }
    if (val < 30) {
      return "Incorporate a mild caloric deficit (approx. 200-300 kcal below TDEE) alongside regular moderate aerobic workouts (at least 150 minutes/week) to reduce body fat percentage.";
    }
    return "Consistently practice deep-breathing stress management, reduce simple sugars and high-sodium items. Consider consulting a registered medical practitioner to structure a safe therapeutic routine.";
  };

  return (
    <div id="bmi-calc-tab" className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-5 rounded-2xl border border-slate-100 dark:border-green-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
          <Activity className="h-5 w-5 text-green-600" />
          <span>Interactive BMI & Health Index Calculator</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5">Calculate metabolic metrics dynamically using WHO medical standards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Interactive Sliders */}
        <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm space-y-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Adjust Parameters</h3>
          
          <div className="flex space-x-3 mb-2">
            <button 
              onClick={() => setGender("male")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${gender === "male" ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" : "bg-slate-50 dark:bg-black/40 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
            >
              Male
            </button>
            <button 
              onClick={() => setGender("female")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${gender === "female" ? "bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-500/20" : "bg-slate-50 dark:bg-black/40 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-pink-50 dark:hover:bg-pink-900/20"}`}
            >
              Female
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600 dark:text-emerald-100/90">
              <span>Age</span>
              <span className="text-green-600 font-bold">{age} Years</span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-green-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            />
          </div>

          {/* Height slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600 dark:text-emerald-100/90">
              <span>Height</span>
              <span className="text-green-600 font-bold">{height} cm</span>
            </div>
            <input
              type="range"
              min={100}
              max={230}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-green-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
          </div>

          {/* Weight slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600 dark:text-emerald-100/90">
              <span>Weight</span>
              <span className="text-green-600 font-bold">{weight} kg</span>
            </div>
            <input
              type="range"
              min={30}
              max={180}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-green-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
          </div>

          <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500/30 transition-all text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ideal Weight Min</span>
              <p className="text-lg font-extrabold text-slate-800 dark:text-white mt-0.5">{minIdeal} kg</p>
            </div>
            <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500/30 transition-all text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ideal Weight Max</span>
              <p className="text-lg font-extrabold text-slate-800 dark:text-white mt-0.5">{maxIdeal} kg</p>
            </div>
          </div>
        </div>

        {/* Right Dynamic BMI Result Analysis */}
        <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Your Clinical BMI</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-6xl font-black text-slate-800 dark:text-white tracking-tighter">{bmi}</span>
                  <span className="text-sm text-slate-400 font-semibold">kg/m²</span>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end space-y-2">
                <div className={`px-4 py-1.5 border rounded-xl text-sm font-bold w-fit shadow-sm ${category.color}`}>
                  {category.label}
                </div>
                <div className={`px-3 py-1 border rounded-lg text-xs font-bold w-fit shadow-sm flex items-center space-x-1.5 ${healthRisk.color}`}>
                  <ShieldAlert className="h-3 w-3" />
                  <span>{healthRisk.level}</span>
                </div>
              </div>
            </div>

            {/* Visual BMI Gauge */}
            <div className="pt-2">
              <div className="flex justify-between text-[9px] font-extrabold text-slate-400 mb-2 px-1 uppercase tracking-widest">
                <span>Under</span>
                <span>Normal</span>
                <span>Over</span>
                <span>Obese</span>
              </div>
              <div className="relative w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="w-[18.5%] h-full bg-blue-400"></div>
                <div className="w-[25%] h-full bg-green-400"></div>
                <div className="w-[19%] h-full bg-orange-400"></div>
                <div className="flex-1 h-full bg-red-500"></div>
                
                {/* Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-slate-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out z-10"
                  style={{ left: `${Math.min(99, Math.max(0, ((bmi - 10) / 30) * 100))}%` }}
                ></div>
              </div>
            </div>
            
            {/* Estimated BFP */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Est. Body Fat (BFP)</span>
              </div>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">{bfp}%</span>
            </div>
          </div>

          <div className="space-y-3.5 border-t border-slate-50 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span>AI Health Recommendation</span>
            </h4>
            <p className="text-sm text-slate-600 dark:text-emerald-100/90 leading-relaxed bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-green-500/30 transition-all">
              {getClinicalSuggestions(bmi)}
            </p>
          </div>
        </div>
      </div>

      {/* Standard reference table */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight mb-4">World Health Organization (WHO) Ranges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm font-medium">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-blue-900/20 dark:hover:border-blue-700/50 transition-all duration-300 cursor-default rounded-xl">
            <span className="text-xs text-blue-500 dark:text-blue-400 block">Underweight</span>
            <span className="font-bold text-slate-700 dark:text-white mt-1 block">&lt; 18.5</span>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-green-900/20 dark:hover:border-green-700/50 transition-all duration-300 cursor-default rounded-xl">
            <span className="text-xs text-green-600 dark:text-green-400 block">Normal Weight</span>
            <span className="font-bold text-slate-700 dark:text-white mt-1 block">18.5 - 24.9</span>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-orange-900/20 dark:hover:border-orange-700/50 transition-all duration-300 cursor-default rounded-xl">
            <span className="text-xs text-orange-600 dark:text-orange-400 block">Overweight</span>
            <span className="font-bold text-slate-700 dark:text-white mt-1 block">25.0 - 29.9</span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-rose-900/20 dark:hover:border-rose-700/50 transition-all duration-300 cursor-default rounded-xl">
            <span className="text-xs text-rose-600 dark:text-rose-400 block">Obese</span>
            <span className="font-bold text-slate-700 dark:text-white mt-1 block">&gt;= 30.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
