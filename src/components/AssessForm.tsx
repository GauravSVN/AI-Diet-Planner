import React from "react";
import { 
  User, 
  HeartPulse, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Sparkles, 
  Activity,
  Smile,
  ShieldAlert
} from "lucide-react";
import { PersonalInfo, MedicalInfo, FitnessPreferences } from "../types";
import { useLanguage } from "../LanguageContext";

interface AssessFormProps {
  onSubmitAssessment: (data: {
    personalInfo: PersonalInfo;
    medicalInfo: MedicalInfo;
    fitnessPreferences: FitnessPreferences;
  }) => Promise<void>;
  isSubmitting: boolean;
  initialData?: {
    personalInfo?: PersonalInfo;
    medicalInfo?: MedicalInfo;
    fitnessPreferences?: FitnessPreferences;
  };
}

export default function AssessForm({
  onSubmitAssessment,
  isSubmitting,
  initialData,
}: AssessFormProps) {
  const { t } = useLanguage();
  const [step, setStep] = React.useState(1);

  // 1. Personal Info State
  const [personal, setPersonal] = React.useState<PersonalInfo>({
    fullName: initialData?.personalInfo?.fullName || "",
    age: initialData?.personalInfo?.age || 0,
    gender: initialData?.personalInfo?.gender || "male",
    height: initialData?.personalInfo?.height || 0,
    weight: initialData?.personalInfo?.weight || 0,
    currentBmi: initialData?.personalInfo?.currentBmi || 0,
    bodyFat: initialData?.personalInfo?.bodyFat || undefined,
    country: initialData?.personalInfo?.country || "",
    state: initialData?.personalInfo?.state || "",
    city: initialData?.personalInfo?.city || "",
    occupation: initialData?.personalInfo?.occupation || "",
    activityLevel: initialData?.personalInfo?.activityLevel || "moderately_active",
    lifestyle: initialData?.personalInfo?.lifestyle || "",
    dailyRoutine: initialData?.personalInfo?.dailyRoutine || "",
    sleepHours: initialData?.personalInfo?.sleepHours || 0,
    wakeUpTime: initialData?.personalInfo?.wakeUpTime || "",
    bedTime: initialData?.personalInfo?.bedTime || "",
    exerciseTime: initialData?.personalInfo?.exerciseTime || "",
    walkingStepsPerDay: initialData?.personalInfo?.walkingStepsPerDay || 0,
    workingHours: initialData?.personalInfo?.workingHours || 0,
    stressLevel: initialData?.personalInfo?.stressLevel || "medium",
  });

  // 2. Medical Info State
  const [medical, setMedical] = React.useState<MedicalInfo>({
    bloodGroup: initialData?.medicalInfo?.bloodGroup || "O+",
    bloodPressure: initialData?.medicalInfo?.bloodPressure || "normal",
    diabetes: initialData?.medicalInfo?.diabetes || false,
    thyroid: initialData?.medicalInfo?.thyroid || false,
    heartDisease: initialData?.medicalInfo?.heartDisease || false,
    kidneyDisease: initialData?.medicalInfo?.kidneyDisease || false,
    liverDisease: initialData?.medicalInfo?.liverDisease || false,
    cholesterol: initialData?.medicalInfo?.cholesterol || false,
    foodAllergies: initialData?.medicalInfo?.foodAllergies || "",
    medication: initialData?.medicalInfo?.medication || "",
    digestiveProblems: initialData?.medicalInfo?.digestiveProblems || "",
    pregnant: initialData?.medicalInfo?.pregnant || false,
    smoking: initialData?.medicalInfo?.smoking || false,
    alcohol: initialData?.medicalInfo?.alcohol || false,
  });

  // 3. Fitness & Preferences State
  const [prefs, setPrefs] = React.useState<FitnessPreferences>({
    goal: initialData?.fitnessPreferences?.goal || "healthy_lifestyle",
    dietType: initialData?.fitnessPreferences?.dietType || "vegetarian",
    favoriteFoods: initialData?.fitnessPreferences?.favoriteFoods || "",
    dislikedFoods: initialData?.fitnessPreferences?.dislikedFoods || "",
    dailyBudget: initialData?.fitnessPreferences?.dailyBudget || "medium",
    cookingTime: initialData?.fitnessPreferences?.cookingTime || 0,
    waterIntakeGoal: initialData?.fitnessPreferences?.waterIntakeGoal || 0,
    mealsPerDay: initialData?.fitnessPreferences?.mealsPerDay || 0,
    snacksAllowed: initialData?.fitnessPreferences?.snacksAllowed || true,
    supplements: initialData?.fitnessPreferences?.supplements || "",
  });

  const [timeFocus, setTimeFocus] = React.useState({ wake: false, bed: false, ex: false });

  // Real-time BMI calculation
  React.useEffect(() => {
    if (personal.height && personal.weight) {
      const heightM = personal.height / 100;
      const bmi = Number((personal.weight / (heightM * heightM)).toFixed(1));
      setPersonal((prev) => ({ ...prev, currentBmi: bmi }));
    }
  }, [personal.height, personal.weight]);

  const handleNumberInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePersonalChange = (key: keyof PersonalInfo, value: any) => {
    setPersonal((prev) => ({ ...prev, [key]: value }));
  };

  const handleMedicalChange = (key: keyof MedicalInfo, value: any) => {
    setMedical((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrefsChange = (key: keyof FitnessPreferences, value: any) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    await onSubmitAssessment({
      personalInfo: personal,
      medicalInfo: medical,
      fitnessPreferences: prefs,
    });
  };

  return (
    <div id="assessment-form-container" className="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl border border-slate-100 dark:border-green-900/40 rounded-3xl shadow-xl shadow-slate-100/50 hover:shadow-2xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
      {/* Step Indicators */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
        <div className="flex items-center space-x-2">
          <div className="p-2.5 bg-green-500 rounded-2xl shadow-md shadow-green-100">
            <Activity className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t('assess_title')}</h2>
            <p className="text-xs text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70">{t('assess_subtitle')}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          <div className={`flex items-center space-x-1.5 ${step === 1 ? "text-green-600 font-bold" : "text-slate-400"}`}>
            <User className="h-4 w-4" />
            <span className="text-xs">1. {t('assess_step1')}</span>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <div className={`flex items-center space-x-1.5 ${step === 2 ? "text-green-600 font-bold" : "text-slate-400"}`}>
            <HeartPulse className="h-4 w-4" />
            <span className="text-xs">2. {t('assess_step2')}</span>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <div className={`flex items-center space-x-1.5 ${step === 3 ? "text-green-600 font-bold" : "text-slate-400"}`}>
            <Target className="h-4 w-4" />
            <span className="text-xs">3. {t('assess_step4')}</span>
          </div>
        </div>
      </div>

      {/* Form Wizard */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 pb-2">
              {t('assess_step1')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_full_name")}</label>
                <input
                  type="text"
                  required
                  value={personal.fullName}
                  onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  placeholder={t("af_name_ph")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_age")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    required
                    min={1}
                    max={120}
                    value={personal.age === 0 ? "" : personal.age}
                    onChange={(e) => handlePersonalChange("age", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_gender")}</label>
                  <select
                    value={personal.gender}
                    onChange={(e) => handlePersonalChange("gender", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_height")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    required
                    min={50}
                    max={250}
                    value={personal.height === 0 ? "" : personal.height}
                    onChange={(e) => handlePersonalChange("height", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_weight")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    required
                    min={20}
                    max={300}
                    value={personal.weight === 0 ? "" : personal.weight}
                    onChange={(e) => handlePersonalChange("weight", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_body_fat")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    min={2}
                    max={70}
                    value={personal.bodyFat || ""}
                    onChange={(e) => handlePersonalChange("bodyFat", e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                    placeholder={t("af_body_fat")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_calc_bmi")}</label>
                  <div className="w-full px-4 py-3 bg-slate-100 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 rounded-xl text-sm text-slate-700 dark:text-white font-bold">
                    {personal.currentBmi} ({personal.currentBmi < 18.5 ? "Underweight" : personal.currentBmi < 25 ? "Normal" : personal.currentBmi < 30 ? "Overweight" : "Obese"})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_country")}</label>
                  <input
                    type="text"
                    required
                    value={personal.country}
                    onChange={(e) => handlePersonalChange("country", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder={t("af_country_ph")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_state")}</label>
                  <input
                    type="text"
                    required
                    value={personal.state}
                    onChange={(e) => handlePersonalChange("state", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder={t("af_state_ph")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_city")}</label>
                  <input
                    type="text"
                    required
                    value={personal.city}
                    onChange={(e) => handlePersonalChange("city", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder={t("af_city_ph")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_occupation")}</label>
                <input
                  type="text"
                  required
                  value={personal.occupation}
                  onChange={(e) => handlePersonalChange("occupation", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  placeholder={t("af_occ_ph")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_activity")}</label>
                <select
                  value={personal.activityLevel}
                  onChange={(e) => handlePersonalChange("activityLevel", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                >
                  <option value="sedentary">{t("af_sedentary")}</option>
                  <option value="lightly_active">{t("af_light")}</option>
                  <option value="moderately_active">{t("af_moderate")}</option>
                  <option value="very_active">{t("af_very")}</option>
                  <option value="extra_active">{t("af_extra")}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_sleep")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    required
                    min={4}
                    max={16}
                    value={personal.sleepHours === 0 ? "" : personal.sleepHours}
                    onChange={(e) => handlePersonalChange("sleepHours", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_stress")}</label>
                  <select
                    value={personal.stressLevel}
                    onChange={(e) => handlePersonalChange("stressLevel", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  >
                    <option value="low">{t("af_stress_low")}</option>
                    <option value="medium">{t("af_stress_med")}</option>
                    <option value="high">{t("af_stress_high")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_wake")}</label>
                  <input
                    type={timeFocus.wake || personal.wakeUpTime ? "time" : "text"}
                    onFocus={() => setTimeFocus((prev) => ({ ...prev, wake: true }))}
                    onBlur={() => setTimeFocus((prev) => ({ ...prev, wake: false }))}
                    required
                    value={personal.wakeUpTime}
                    onChange={(e) => handlePersonalChange("wakeUpTime", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="07:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_bed")}</label>
                  <input
                    type={timeFocus.bed || personal.bedTime ? "time" : "text"}
                    onFocus={() => setTimeFocus((prev) => ({ ...prev, bed: true }))}
                    onBlur={() => setTimeFocus((prev) => ({ ...prev, bed: false }))}
                    required
                    value={personal.bedTime}
                    onChange={(e) => handlePersonalChange("bedTime", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="11:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_ex_time")}</label>
                  <input
                    type={timeFocus.ex || personal.exerciseTime ? "time" : "text"}
                    onFocus={() => setTimeFocus((prev) => ({ ...prev, ex: true }))}
                    onBlur={() => setTimeFocus((prev) => ({ ...prev, ex: false }))}
                    required
                    value={personal.exerciseTime}
                    onChange={(e) => handlePersonalChange("exerciseTime", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="06:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_steps")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    required
                    min={0}
                    value={personal.walkingStepsPerDay === 0 ? "" : personal.walkingStepsPerDay}
                    onChange={(e) => handlePersonalChange("walkingStepsPerDay", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_work_hours")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    required
                    min={0}
                    max={24}
                    value={personal.workingHours === 0 ? "" : personal.workingHours}
                    onChange={(e) => handlePersonalChange("workingHours", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="8"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_routine")}</label>
              <textarea
                rows={3}
                value={personal.dailyRoutine}
                onChange={(e) => handlePersonalChange("dailyRoutine", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                placeholder={t("af_routine_ph")}
              ></textarea>
            </div>
          </div>
        )}

        {/* STEP 2: MEDICAL INFORMATION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 pb-2">{t("assess_step2")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_blood_grp")}</label>
                <select
                  value={medical.bloodGroup}
                  onChange={(e) => handleMedicalChange("bloodGroup", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_bp")}</label>
                <select
                  value={medical.bloodPressure}
                  onChange={(e) => handleMedicalChange("bloodPressure", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                >
                  <option value="normal">{t("af_bp_norm")}</option>
                  <option value="low">{t("af_bp_low")}</option>
                  <option value="high">{t("af_bp_high")}</option>
                </select>
              </div>
            </div>

            {/* Checkbox grid for medical conditions */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-3">{t("af_chronic")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: "diabetes", label: t("af_diab") },
                  { key: "thyroid", label: t("af_thyroid") },
                  { key: "heartDisease", label: t("af_heart") },
                  { key: "kidneyDisease", label: t("af_kidney") },
                  { key: "liverDisease", label: t("af_liver") },
                  { key: "cholesterol", label: t("af_chol") },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-center space-x-3 p-3.5 border rounded-2xl cursor-pointer transition-all ${
                      (medical as any)[item.key]
                        ? "bg-green-50 dark:bg-green-600 border-green-200 dark:border-green-500 text-green-700 dark:text-white"
                        : "bg-slate-50 dark:bg-green-950/40 border-slate-200 dark:border-green-800/50 text-slate-600 dark:text-emerald-100/90 hover:bg-slate-100 dark:hover:bg-green-900/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(medical as any)[item.key]}
                      onChange={(e) => handleMedicalChange(item.key as keyof MedicalInfo, e.target.checked)}
                      className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                    />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_allergies")}</label>
                <input
                  type="text"
                  value={medical.foodAllergies}
                  onChange={(e) => handleMedicalChange("foodAllergies", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  placeholder={t("af_al_ph")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_meds")}</label>
                <input
                  type="text"
                  value={medical.medication}
                  onChange={(e) => handleMedicalChange("medication", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  placeholder={t("af_meds_ph")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_digest")}</label>
                <input
                  type="text"
                  value={medical.digestiveProblems}
                  onChange={(e) => handleMedicalChange("digestiveProblems", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  placeholder={t("af_dig_ph")}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-6">
                {[
                  { key: "pregnant", label: t("af_preg") },
                  { key: "smoking", label: t("af_smoke") },
                  { key: "alcohol", label: t("af_alcohol") },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex flex-col items-center justify-center p-3 border rounded-2xl cursor-pointer text-center transition-all ${
                      (medical as any)[item.key]
                        ? "bg-green-50 dark:bg-green-600 border-green-200 dark:border-green-500 text-green-700 dark:text-white font-bold"
                        : "bg-slate-50 dark:bg-green-950/40 border-slate-200 dark:border-green-800/50 text-slate-500 dark:text-emerald-200/70 hover:bg-slate-100 dark:hover:bg-green-900/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(medical as any)[item.key]}
                      onChange={(e) => handleMedicalChange(item.key as keyof MedicalInfo, e.target.checked)}
                      className="sr-only"
                    />
                    <span className="text-[11px] uppercase tracking-wider font-semibold mb-1">{item.label}</span>
                    <span className="text-xs">{(medical as any)[item.key] ? "Yes" : "No"}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FITNESS GOALS & DIET PREFERENCES */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-green-900/30 pb-2">
              {t('assess_step4')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_goal")}</label>
                <select
                  value={prefs.goal}
                  onChange={(e) => handlePrefsChange("goal", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                >
                  <option value="lose_weight">{t("af_goal_lose")}</option>
                  <option value="gain_weight">{t("af_goal_gain")}</option>
                  <option value="maintain_weight">{t("af_goal_maint")}</option>
                  <option value="build_muscle">{t("af_goal_musc")}</option>
                  <option value="fat_loss">{t("af_goal_fat")}</option>
                  <option value="healthy_lifestyle">{t("af_goal_health")}</option>
                  <option value="medical_diet">{t("af_goal_med")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_diet_pref")}</label>
                <select
                  value={prefs.dietType}
                  onChange={(e) => handlePrefsChange("dietType", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                >
                  <option value="vegetarian">{t("af_veg")}</option>
                  <option value="vegan">{t("af_vegan")}</option>
                  <option value="eggetarian">{t("af_egg")}</option>
                  <option value="non_vegetarian">{t("af_nonveg")}</option>
                  <option value="jain">{t("af_jain")}</option>
                  <option value="keto">{t("af_keto")}</option>
                  <option value="low_carb">{t("af_lowcarb")}</option>
                  <option value="high_protein">{t("af_highpro")}</option>
                  <option value="mediterranean">{t("af_medit")}</option>
                  <option value="intermittent_fasting">{t("af_fasting")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_fav")}</label>
                <input
                  type="text"
                  value={prefs.favoriteFoods}
                  onChange={(e) => handlePrefsChange("favoriteFoods", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  placeholder={t("af_fav_ph")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_dislike")}</label>
                <input
                  type="text"
                  value={prefs.dislikedFoods}
                  onChange={(e) => handlePrefsChange("dislikedFoods", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  placeholder={t("af_dis_ph")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_meals")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    required
                    min={2}
                    max={6}
                    value={prefs.mealsPerDay === 0 ? "" : prefs.mealsPerDay}
                    onChange={(e) => handlePrefsChange("mealsPerDay", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_budget")}</label>
                  <select
                    value={prefs.dailyBudget}
                    onChange={(e) => handlePrefsChange("dailyBudget", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  >
                    <option value="low">{t("af_bud_low")}</option>
                    <option value="medium">{t("af_bud_med")}</option>
                    <option value="high">{t("af_bud_high")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_cook_time")}</label>
                  <input
                    type="number"
                    onKeyDown={handleNumberInputKeyDown}
                    required
                    min={10}
                    max={180}
                    value={prefs.cookingTime === 0 ? "" : prefs.cookingTime}
                    onChange={(e) => handlePrefsChange("cookingTime", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_snacks")}</label>
                  <select
                    value={prefs.snacksAllowed ? "true" : "false"}
                    onChange={(e) => handlePrefsChange("snacksAllowed", e.target.value === "true")}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  >
                    <option value="true">{t("af_sn_yes")}</option>
                    <option value="false">{t("af_sn_no")}</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">{t("af_supp")}</label>
              <input
                type="text"
                value={prefs.supplements}
                onChange={(e) => handlePrefsChange("supplements", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                placeholder={t("af_sup_ph")}
              />
            </div>

            <div className="flex items-start space-x-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/50 p-4 rounded-2xl">
              <ShieldAlert className="h-5 w-5 text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-800 dark:text-orange-200 leading-relaxed font-medium">
                <strong className="font-bold">Clinical Safety Check:</strong> {t("af_safety")}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1 px-5 py-3 border border-slate-200 text-slate-600 dark:text-emerald-100/90 hover:border-slate-300 hover:text-slate-800 rounded-xl transition-colors font-medium cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t("af_btn_back")}</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-green-600/60 text-white font-semibold rounded-xl shadow-md shadow-green-100 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t('assess_generating')}</span>
              </>
            ) : step < 3 ? (
              <>
                <span>{t("af_btn_cont")}</span>
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>{t('assess_submit')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
