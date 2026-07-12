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
  const [step, setStep] = React.useState(1);

  // 1. Personal Info State
  const [personal, setPersonal] = React.useState<PersonalInfo>({
    fullName: initialData?.personalInfo?.fullName || "",
    age: initialData?.personalInfo?.age || 25,
    gender: initialData?.personalInfo?.gender || "male",
    height: initialData?.personalInfo?.height || 170,
    weight: initialData?.personalInfo?.weight || 70,
    currentBmi: initialData?.personalInfo?.currentBmi || 24.2,
    bodyFat: initialData?.personalInfo?.bodyFat || undefined,
    country: initialData?.personalInfo?.country || "",
    state: initialData?.personalInfo?.state || "",
    city: initialData?.personalInfo?.city || "",
    occupation: initialData?.personalInfo?.occupation || "",
    activityLevel: initialData?.personalInfo?.activityLevel || "moderately_active",
    lifestyle: initialData?.personalInfo?.lifestyle || "",
    dailyRoutine: initialData?.personalInfo?.dailyRoutine || "",
    sleepHours: initialData?.personalInfo?.sleepHours || 8,
    wakeUpTime: initialData?.personalInfo?.wakeUpTime || "07:00",
    bedTime: initialData?.personalInfo?.bedTime || "23:00",
    exerciseTime: initialData?.personalInfo?.exerciseTime || "18:00",
    walkingStepsPerDay: initialData?.personalInfo?.walkingStepsPerDay || 5000,
    workingHours: initialData?.personalInfo?.workingHours || 8,
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
    cookingTime: initialData?.fitnessPreferences?.cookingTime || 30,
    waterIntakeGoal: initialData?.fitnessPreferences?.waterIntakeGoal || 2.5,
    mealsPerDay: initialData?.fitnessPreferences?.mealsPerDay || 3,
    snacksAllowed: initialData?.fitnessPreferences?.snacksAllowed || true,
    supplements: initialData?.fitnessPreferences?.supplements || "",
  });

  // Real-time BMI calculation
  React.useEffect(() => {
    if (personal.height && personal.weight) {
      const heightM = personal.height / 100;
      const bmi = Number((personal.weight / (heightM * heightM)).toFixed(1));
      setPersonal((prev) => ({ ...prev, currentBmi: bmi }));
    }
  }, [personal.height, personal.weight]);

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
            <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">AI Clinical Assessment</h2>
            <p className="text-xs text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70">Provide parameters for metabolic & diet plan calculations.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          <div className={`flex items-center space-x-1.5 ${step === 1 ? "text-green-600 font-bold" : "text-slate-400"}`}>
            <User className="h-4 w-4" />
            <span className="text-xs">1. Personal</span>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <div className={`flex items-center space-x-1.5 ${step === 2 ? "text-green-600 font-bold" : "text-slate-400"}`}>
            <HeartPulse className="h-4 w-4" />
            <span className="text-xs">2. Medical</span>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <div className={`flex items-center space-x-1.5 ${step === 3 ? "text-green-600 font-bold" : "text-slate-400"}`}>
            <Target className="h-4 w-4" />
            <span className="text-xs">3. Goal & Diet</span>
          </div>
        </div>
      </div>

      {/* Form Wizard */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 pb-2">
              Step 1: Physical Parameters & Lifestyle
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={personal.fullName}
                  onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={personal.age}
                    onChange={(e) => handlePersonalChange("age", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Gender
                  </label>
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
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={250}
                    value={personal.height}
                    onChange={(e) => handlePersonalChange("height", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    required
                    min={20}
                    max={300}
                    value={personal.weight}
                    onChange={(e) => handlePersonalChange("weight", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Body Fat % (Optional)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={70}
                    value={personal.bodyFat || ""}
                    onChange={(e) => handlePersonalChange("bodyFat", e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                    placeholder="e.g. 18"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Calculated BMI
                  </label>
                  <div className="w-full px-4 py-3 bg-slate-100 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 rounded-xl text-sm text-slate-700 dark:text-white font-bold">
                    {personal.currentBmi} ({personal.currentBmi < 18.5 ? "Underweight" : personal.currentBmi < 25 ? "Normal" : personal.currentBmi < 30 ? "Overweight" : "Obese"})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={personal.country}
                    onChange={(e) => handlePersonalChange("country", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="e.g. India"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={personal.state}
                    onChange={(e) => handlePersonalChange("state", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="Delhi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={personal.city}
                    onChange={(e) => handlePersonalChange("city", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="New Delhi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  required
                  value={personal.occupation}
                  onChange={(e) => handlePersonalChange("occupation", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Physical Activity Level
                </label>
                <select
                  value={personal.activityLevel}
                  onChange={(e) => handlePersonalChange("activityLevel", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-800/80 rounded-xl text-sm transition-all focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                >
                  <option value="sedentary">Sedentary (Little/no exercise)</option>
                  <option value="lightly_active">Lightly Active (Light sport 1-3 days/week)</option>
                  <option value="moderately_active">Moderately Active (Moderate sport 3-5 days/week)</option>
                  <option value="very_active">Very Active (Hard sport 6-7 days/week)</option>
                  <option value="extra_active">Extra Active (Very hard sport & physical job)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Sleep Hours
                  </label>
                  <input
                    type="number"
                    required
                    min={4}
                    max={16}
                    value={personal.sleepHours}
                    onChange={(e) => handlePersonalChange("sleepHours", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Stress Level
                  </label>
                  <select
                    value={personal.stressLevel}
                    onChange={(e) => handlePersonalChange("stressLevel", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  >
                    <option value="low">Low (Relaxed)</option>
                    <option value="medium">Medium (Moderate daily pressure)</option>
                    <option value="high">High (High pressure/Anxiety)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Wake Up Time
                  </label>
                  <input
                    type="text"
                    required
                    value={personal.wakeUpTime}
                    onChange={(e) => handlePersonalChange("wakeUpTime", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="07:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Bed Time
                  </label>
                  <input
                    type="text"
                    required
                    value={personal.bedTime}
                    onChange={(e) => handlePersonalChange("bedTime", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                    placeholder="11:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Exercise Time
                  </label>
                  <input
                    type="text"
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
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Walking Steps / Day
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={personal.walkingStepsPerDay}
                    onChange={(e) => handlePersonalChange("walkingStepsPerDay", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Working Hours / Day
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={24}
                    value={personal.workingHours}
                    onChange={(e) => handlePersonalChange("workingHours", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                Describe Your Daily Routine
              </label>
              <textarea
                rows={3}
                value={personal.dailyRoutine}
                onChange={(e) => handlePersonalChange("dailyRoutine", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                placeholder="Briefly explain your morning, afternoon, and evening routine..."
              ></textarea>
            </div>
          </div>
        )}

        {/* STEP 2: MEDICAL INFORMATION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 pb-2">
              Step 2: Medical Parameters & Conditions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Blood Group
                </label>
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
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Blood Pressure
                </label>
                <select
                  value={medical.bloodPressure}
                  onChange={(e) => handleMedicalChange("bloodPressure", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                >
                  <option value="normal">Normal BP</option>
                  <option value="low">Low BP (Hypotension)</option>
                  <option value="high">High BP (Hypertension)</option>
                </select>
              </div>
            </div>

            {/* Checkbox grid for medical conditions */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-3">
                Pre-existing Chronic Diseases (Check all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: "diabetes", label: "Diabetes (Type 1 or 2)" },
                  { key: "thyroid", label: "Thyroid Disorder" },
                  { key: "heartDisease", label: "Heart Condition" },
                  { key: "kidneyDisease", label: "Kidney Disease" },
                  { key: "liverDisease", label: "Liver Disease" },
                  { key: "cholesterol", label: "High Cholesterol" },
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
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Food Allergies & Intolerances
                </label>
                <input
                  type="text"
                  value={medical.foodAllergies}
                  onChange={(e) => handleMedicalChange("foodAllergies", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  placeholder="e.g. Peanuts, Lactose, Gluten (or None)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Current Medications
                </label>
                <input
                  type="text"
                  value={medical.medication}
                  onChange={(e) => handleMedicalChange("medication", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  placeholder="e.g. Metformin 500mg, Levothyroxine"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Digestive Problems
                </label>
                <input
                  type="text"
                  value={medical.digestiveProblems}
                  onChange={(e) => handleMedicalChange("digestiveProblems", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
                  placeholder="e.g. IBS, Bloating, Acid Reflux (or None)"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-6">
                {[
                  { key: "pregnant", label: "Pregnant / Lactating" },
                  { key: "smoking", label: "Smokes Tobacco" },
                  { key: "alcohol", label: "Consumes Alcohol" },
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
              Step 3: Goals, Diet Types & Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Primary Fitness Goal
                </label>
                <select
                  value={prefs.goal}
                  onChange={(e) => handlePrefsChange("goal", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                >
                  <option value="lose_weight">Lose Weight (Caloric Deficit)</option>
                  <option value="gain_weight">Gain Weight (Caloric Surplus)</option>
                  <option value="maintain_weight">Maintain Current Weight</option>
                  <option value="build_muscle">Build Lean Muscle Mass</option>
                  <option value="fat_loss">Direct Body Fat Loss</option>
                  <option value="healthy_lifestyle">General Healthy Lifestyle</option>
                  <option value="medical_diet">Therapeutic/Medical Diet Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Dietary Category Preference
                </label>
                <select
                  value={prefs.dietType}
                  onChange={(e) => handlePrefsChange("dietType", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                >
                  <option value="vegetarian">Vegetarian (No meat/fish)</option>
                  <option value="vegan">Vegan (No animal products)</option>
                  <option value="eggetarian">Eggetarian (Eggs allowed, no meat)</option>
                  <option value="non_vegetarian">Non-Vegetarian (Meat/poultry/fish allowed)</option>
                  <option value="jain">Jain Diet (Strict vegetarian, no root vegetables)</option>
                  <option value="keto">Ketogenic (Ultra-low-carb, high-fat)</option>
                  <option value="low_carb">Low Carbohydrate</option>
                  <option value="high_protein">High Protein Focus</option>
                  <option value="mediterranean">Mediterranean Diet</option>
                  <option value="intermittent_fasting">Intermittent Fasting Schedule</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Favorite / Preferred Foods
                </label>
                <input
                  type="text"
                  value={prefs.favoriteFoods}
                  onChange={(e) => handlePrefsChange("favoriteFoods", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  placeholder="e.g. Oats, Chicken breast, Paneer, Apples"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                  Disliked / Avoided Foods
                </label>
                <input
                  type="text"
                  value={prefs.dislikedFoods}
                  onChange={(e) => handlePrefsChange("dislikedFoods", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  placeholder="e.g. Broccoli, Mushrooms, Eggplant"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Daily Meals Count
                  </label>
                  <input
                    type="number"
                    required
                    min={2}
                    max={6}
                    value={prefs.mealsPerDay}
                    onChange={(e) => handlePrefsChange("mealsPerDay", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Daily Budget Category
                  </label>
                  <select
                    value={prefs.dailyBudget}
                    onChange={(e) => handlePrefsChange("dailyBudget", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  >
                    <option value="low">Budget-Friendly (Simple local items)</option>
                    <option value="medium">Standard / Balanced</option>
                    <option value="high">Premium (Exotic ingredients, organics)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Cooking Time Available (Mins)
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={180}
                    value={prefs.cookingTime}
                    onChange={(e) => handlePrefsChange("cookingTime", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                    Snacks Allowed
                  </label>
                  <select
                    value={prefs.snacksAllowed ? "true" : "false"}
                    onChange={(e) => handlePrefsChange("snacksAllowed", e.target.value === "true")}
                    className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                  >
                    <option value="true">Yes, light mid-meal snacks</option>
                    <option value="false">No, meals only</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-emerald-200/70 uppercase tracking-wider mb-2">
                List any Supplements you consume
              </label>
              <input
                type="text"
                value={prefs.supplements}
                onChange={(e) => handlePrefsChange("supplements", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-green-950/40 border border-slate-200 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-green-900/60 rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-100/50"
                placeholder="e.g. Whey Protein, Multivitamins, Fish Oil (or None)"
              />
            </div>

            <div className="flex items-start space-x-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/50 p-4 rounded-2xl">
              <ShieldAlert className="h-5 w-5 text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-800 dark:text-orange-200 leading-relaxed font-medium">
                <strong className="font-bold">Clinical Safety Check:</strong> By checking 'Generate Diet Plan', you acknowledge that the AI-powered recommendations do not replace medical consults. Always seek professional advice for chronic gastrointestinal, renal, or endocrine disorders.
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
              <span>Back</span>
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
                <span>AI is Analysing Parameters...</span>
              </>
            ) : step < 3 ? (
              <>
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Generate Diet Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
