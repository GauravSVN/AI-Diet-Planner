import React from "react";
import axios from "axios";
import { 
  Apple, 
  LogIn, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ChevronRight, 
  Loader2, 
  Sparkles,
  Award,
  BookOpen,
  CalendarDays,
  Activity,
  GlassWater,
  FileText,
  UserCheck,
  History as HistoryIcon,
  HelpCircle,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Menu
} from "lucide-react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import AssessForm from "./components/AssessForm";
import DashboardHome from "./components/DashboardHome";
import DietPlanView from "./components/DietPlanView";
import BmiCalculatorView from "./components/BmiCalculatorView";
import WaterIntakeView from "./components/WaterIntakeView";
import ProgressTrackerView from "./components/ProgressTrackerView";
import MealPlannerView from "./components/MealPlannerView";
import RecipesView from "./components/RecipesView";
import FeedbackView from "./components/FeedbackView";
import SettingsView from "./components/SettingsView";
import AdminPanelView from "./components/AdminPanelView";

import { 
  User, 
  UserRole, 
  PersonalInfo, 
  MedicalInfo, 
  FitnessPreferences, 
  DietPlan, 
  NutritionReport, 
  ProgressLog, 
  Recipe 
} from "./types";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  // Layout & Navigation State
  const [activeSection, setActiveSection] = React.useState("home"); // landing section
  const [currentTab, setCurrentTab] = React.useState("dashboard"); // dashboard section
  const [authMode, setAuthMode] = React.useState<"login" | "register" | "forgot" | null>(null);
  
  // Responsive UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Auth form states
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [regRole, setRegRole] = React.useState<UserRole>("user");
  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState("");
  const [authLoading, setAuthLoading] = React.useState(false);

  // App Data States
  const [latestPlan, setLatestPlan] = React.useState<DietPlan | null>(null);
  const [nutritionReport, setNutritionReport] = React.useState<NutritionReport | null>(null);
  const [progressLogs, setProgressLogs] = React.useState<ProgressLog[]>([]);
  const [feedbacks, setFeedbacks] = React.useState<any[]>([]);
  const [allUsers, setAllUsers] = React.useState<any[]>([]);
  const [adminStats, setAdminStats] = React.useState({
    totalUsers: 0,
    totalAssessments: 0,
    totalFeedbacks: 0,
    averageRating: 5.0,
  });

  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = React.useState(false);

  // Settings options
  const [language, setLanguage] = React.useState<"en" | "hi">("en");
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  // Load token on startup
  React.useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      setActiveSection("dashboard");
    }
  }, []);

  // Fetch dashboard data once logged in
  React.useEffect(() => {
    if (isLoggedIn && token) {
      fetchDashboardData();
    }
  }, [isLoggedIn, token]);

  const fetchDashboardData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch latest plan & report
      const planRes = await axios.get("/api/dietplan", config).catch(() => null);
      if (planRes && planRes.data && typeof planRes.data !== "string") {
        setLatestPlan(planRes.data);
      }
      const reportRes = await axios.get("/api/nutrition-report", config).catch(() => null);
      if (reportRes && reportRes.data && typeof reportRes.data !== "string") {
        setNutritionReport(reportRes.data);
      }

      // Fetch logs
      const logsRes = await axios.get("/api/progress", config).catch(() => ({ data: [] }));
      setProgressLogs(Array.isArray(logsRes.data) ? logsRes.data : []);

      // Fetch feedbacks
      const feedRes = await axios.get("/api/feedback", config).catch(() => ({ data: [] }));
      setFeedbacks(Array.isArray(feedRes.data) ? feedRes.data : []);

      // If Admin, fetch admin stats and users
      if (currentUser?.role === "admin") {
        const statsRes = await axios.get("/api/admin/stats", config).catch(() => null);
        if (statsRes && typeof statsRes.data !== "string") {
          setAdminStats(statsRes.data);
        }
        const usersRes = await axios.get("/api/admin/users", config).catch(() => ({ data: [] }));
        setAllUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      
      setToken(token);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setAuthMode(null);
      setActiveSection("dashboard");
      setCurrentTab("dashboard");
      
      // Clear fields
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setAuthError(err.response?.data?.message || "Invalid credentials. Try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        name: fullName,
        email,
        password,
        role: regRole,
      });
      const { token, user } = res.data;
      
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      
      setToken(token);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setAuthMode(null);
      setActiveSection("dashboard");
      setCurrentTab("dashboard");

      // Clear fields
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setAuthError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      alert("A reset link has been dispatched to your email (simulated).");
      setAuthMode("login");
    } catch (err: any) {
      setAuthError(err.response?.data?.message || "Error processing request.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveSection("home");
  };

  const handleUpdateProfile = async (name: string, email: string) => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put("/api/user/profile", { name, email }, config);
      const updatedUser = res.data;
      setCurrentUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to update profile.");
    }
  };

  // Submit assessment form & trigger AI planner
  const handleSubmitAssessment = async (data: {
    personalInfo: PersonalInfo;
    medicalInfo: MedicalInfo;
    fitnessPreferences: FitnessPreferences;
  }) => {
    if (!token) return;
    setIsGeneratingPlan(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post("/api/assessment", data, config);
      
      setLatestPlan(res.data.dietPlan);
      setNutritionReport(res.data.report);
      
      alert("AI Assessment generated successfully! Redirection to custom diet plan tab...");
      setCurrentTab("diet-plan");
      
      // Refresh general logs
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Metabolic calculations failed. Please retry.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Log water / weight daily
  const handleQuickLog = async (data: Partial<ProgressLog>) => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post("/api/progress", data, config);
      alert("Daily health parameter updated successfully!");
      fetchDashboardData();
    } catch (err) {
      console.error("Error submitting log:", err);
    }
  };

  // Log only water
  const handleWaterLog = async (ml: number) => {
    await handleQuickLog({ waterIntakeMl: ml });
  };

  // Submit Feedback
  const handleAddFeedback = async (feedbackText: string, rating: number) => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post("/api/feedback", { message: feedbackText, rating }, config);
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating feedback:", err);
    }
  };

  // Admin: Toggle Role
  const handleToggleRole = async (userId: string, currentRole: string) => {
    if (!token) return;
    try {
      const newRole = currentRole === "user" ? "nutritionist" : currentRole === "nutritionist" ? "admin" : "user";
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/admin/users/${userId}`, { role: newRole }, config);
      alert(`User role successfully changed to: ${newRole}`);
      fetchDashboardData();
    } catch (err) {
      console.error("Error modifying role:", err);
    }
  };

  // Admin: Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to purge this user? This action is permanent!")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/admin/users/${userId}`, config);
      alert("User purged successfully!");
      fetchDashboardData();
    } catch (err) {
      console.error("Error purging user:", err);
    }
  };

  // Scroll to section helper
  const handleNavigateSection = (section: string) => {
    setActiveSection(section);
    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className={`min-h-screen font-sans ${theme === "dark" ? "bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 text-slate-100" : "bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 text-slate-900"}`}>
      {/* 1. LANDING PAGE VIEW */}
      {activeSection !== "dashboard" ? (
        <div className="pt-16">
          <Navbar 
            onNavigate={handleNavigateSection}
            activeSection={activeSection}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onOpenAuth={(mode) => setAuthMode(mode)}
          />
          <LandingPage 
            isLoggedIn={isLoggedIn}
            onOpenAuth={(mode) => setAuthMode(mode)}
            onStartAssessment={() => {
              if (isLoggedIn) {
                setActiveSection("dashboard");
                setCurrentTab("assessment");
              } else {
                setAuthMode("register");
              }
            }} 
          />
        </div>
      ) : (
        /* 2. LOGGED IN DASHBOARD CORE */
        <div className="flex min-h-screen relative">
          <Sidebar 
            currentTab={currentTab}
            onChangeTab={setCurrentTab}
            userRole={currentUser?.role || "user"}
            userName={currentUser?.name || "Client"}
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileMenuOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          <main id="dashboard-content" className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"} ml-0 flex flex-col`}>
            
            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-900/90 dark:backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
              <div className="group flex items-center space-x-3 cursor-pointer transition-all duration-300">
                <img src="/logo.jpg" alt="AI Dietitian Logo" className="h-8 w-auto rounded-full shadow-sm group-hover:scale-110 group-hover:rotate-[10deg] group-hover:ring-2 group-hover:ring-green-500 group-hover:ring-offset-2 dark:group-hover:ring-offset-slate-900 group-hover:shadow-green-500/50 transition-all duration-300" />
                <span className="text-lg font-black text-slate-800 dark:text-white tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] transition-all duration-300">AI Dietitian</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -mr-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4 sm:p-8 flex-1">
            {isLoadingData ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-500 animate-pulse">Syncing metabolic state logs...</p>
              </div>
            ) : (
              <>
                {currentTab === "dashboard" && (
                  <DashboardHome 
                    user={currentUser}
                    latestPlan={latestPlan}
                    report={nutritionReport}
                    logs={progressLogs}
                    onNavigateTab={setCurrentTab}
                    onQuickLog={handleQuickLog}
                  />
                )}

                {currentTab === "profile" && (
                  <div className="max-w-3xl mx-auto bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-xl hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-green-900/30 pb-3 flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-green-600" />
                      <span>User Profile Details</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 mt-1 block">{currentUser?.name}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Email</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 mt-1 block">{currentUser?.email}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active System Role</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 uppercase tracking-wider mt-1.5">
                          {currentUser?.role}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 mt-1 block">
                          {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "--"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === "assessment" && (
                  <AssessForm 
                    onSubmitAssessment={handleSubmitAssessment}
                    isSubmitting={isGeneratingPlan}
                    initialData={{
                      personalInfo: latestPlan ? {
                        fullName: currentUser?.name || "",
                        age: 25,
                        gender: "male",
                        height: 170,
                        weight: 70,
                        currentBmi: 24.2,
                        country: "India",
                        state: "Delhi",
                        city: "New Delhi",
                        occupation: "Developer",
                        activityLevel: "moderately_active",
                        lifestyle: "Desk Job",
                        dailyRoutine: "Busy daily developer job",
                        sleepHours: 8,
                        wakeUpTime: "07:00",
                        bedTime: "23:00",
                        exerciseTime: "18:00",
                        walkingStepsPerDay: 5000,
                        workingHours: 8,
                        stressLevel: "medium",
                      } : undefined
                    }}
                  />
                )}

                {currentTab === "diet-plan" && (
                  <DietPlanView plan={latestPlan} onNavigateTab={setCurrentTab} />
                )}

                {currentTab === "nutrition-report" && (
                  <div className="max-w-4xl mx-auto bg-white/60 dark:bg-slate-950/80 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/60 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-6 hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-green-900/30 dark:hover:border-green-600/50 transition-all duration-300">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span>Clinical Nutritionist Analysis Report</span>
                    </h2>
                    {nutritionReport ? (
                      <div className="space-y-6 text-sm text-slate-600">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:bg-none dark:bg-black/40 p-4 rounded-2xl border border-blue-100 dark:border-slate-800/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-green-900/30 dark:hover:border-green-500/50 transition-all duration-300 cursor-default">
                            <span className="text-[10px] font-bold text-blue-400 dark:text-emerald-100/90 uppercase tracking-wider block mb-1">Current BMI</span>
                            <span className="text-xl font-black text-blue-700 dark:text-white">{nutritionReport.bmi || "--"}</span>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:bg-none dark:bg-black/40 p-4 rounded-2xl border border-purple-100 dark:border-slate-800/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-green-900/30 dark:hover:border-green-500/50 transition-all duration-300 cursor-default">
                            <span className="text-[10px] font-bold text-purple-400 dark:text-emerald-100/90 uppercase tracking-wider block mb-1">Category</span>
                            <span className="text-lg font-black text-purple-700 dark:text-white truncate block">{nutritionReport.weightCategory || "--"}</span>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:bg-none dark:bg-black/40 p-4 rounded-2xl border border-orange-100 dark:border-slate-800/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-green-900/30 dark:hover:border-green-500/50 transition-all duration-300 cursor-default">
                            <span className="text-[10px] font-bold text-orange-400 dark:text-emerald-100/90 uppercase tracking-wider block mb-1">Base BMR (kcal)</span>
                            <span className="text-xl font-black text-orange-700 dark:text-white">{nutritionReport.bmr || "--"}</span>
                          </div>
                          <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 dark:bg-none dark:bg-black/40 p-4 rounded-2xl border border-rose-100 dark:border-slate-800/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-green-900/30 dark:hover:border-green-500/50 transition-all duration-300 cursor-default">
                            <span className="text-[10px] font-bold text-rose-400 dark:text-emerald-100/90 uppercase tracking-wider block mb-1">TDEE (kcal)</span>
                            <span className="text-xl font-black text-rose-700 dark:text-white">{nutritionReport.tdee || "--"}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-black/40 p-5 rounded-2xl border border-slate-100/60 dark:border-slate-800/50 hover:border-green-500/30 transition-all">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-emerald-200/90 uppercase tracking-wider">Metabolic Summary & Ideal Range</span>
                          <p className="text-slate-700 dark:text-white font-medium leading-relaxed mt-2">{nutritionReport.summaryText}</p>
                          <div className="mt-3 inline-block px-3 py-1 bg-green-100 dark:bg-green-600/20 border dark:border-green-600/30 text-green-700 dark:text-green-400 font-semibold text-xs rounded-lg">
                            Target Ideal Weight: {nutritionReport.idealWeightRange || "N/A"}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-400 dark:text-white uppercase">Deficiencies Warning</span>
                            <ul className="list-disc list-inside space-y-1">
                              {(nutritionReport.deficiencies || []).map((def: string, idx: number) => (
                                <li key={idx} className="text-amber-700 dark:text-orange-300 font-semibold">{def}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-400 dark:text-white uppercase">Suggested Superfoods</span>
                            <ul className="list-disc list-inside space-y-1">
                              {(nutritionReport.superfoods || []).map((food: string, idx: number) => (
                                <li key={idx} className="text-green-700 dark:text-emerald-300 font-semibold">{food}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-400">
                        Complete assessment to let AI generate a customized clinical report.
                      </div>
                    )}
                  </div>
                )}

                {currentTab === "bmi-calc" && <BmiCalculatorView />}

                {currentTab === "water-intake" && (
                  <WaterIntakeView 
                    initialGoalLitres={latestPlan ? latestPlan.waterIntakeLitres : 2.5}
                    initialConsumedMl={progressLogs.find((l) => l.date === new Date().toISOString().split("T")[0])?.waterIntakeMl || 0}
                    onLogWater={handleWaterLog}
                  />
                )}

                {currentTab === "meal-planner" && <MealPlannerView plan={latestPlan} />}

                {currentTab === "progress" && <ProgressTrackerView logs={progressLogs} />}

                {currentTab === "recipes" || currentTab === "history" ? (
                  <RecipesView planRecipes={[]} />
                ) : null}

                {currentTab === "feedback" && (
                  <FeedbackView feedbacks={feedbacks} onAddFeedback={handleAddFeedback} />
                )}

                {currentTab === "settings" && (
                  <SettingsView 
                    language={language}
                    theme={theme}
                    onLanguageChange={setLanguage}
                    onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
                    currentUser={currentUser}
                    onUpdateProfile={handleUpdateProfile}
                  />
                )}

                {currentTab === "admin-panel" && currentUser?.role === "admin" && (
                  <AdminPanelView 
                    stats={adminStats} 
                    users={allUsers} 
                    onToggleRole={handleToggleRole}
                    onDeleteUser={handleDeleteUser}
                  />
                )}
              </>
            )}
            </div>
          </main>
        </div>
      )}

      {/* 3. LOGIN / REGISTRATION MODAL FORM */}
      {authMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl dark:shadow-[0_0_40px_rgba(34,197,94,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden relative p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setAuthMode(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs flex items-center space-x-1.5">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Login Mode */}
            {authMode === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Sign In to Your Account</h3>
                  <p className="text-xs text-slate-400">Unlock your AI meal plan, water tracker & logs.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter registered email..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm focus:outline-none transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode("forgot")}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-bold transition-colors"
                  >
                    Forgot Password?
                  </button>
                  <span className="text-slate-400 dark:text-slate-500">
                    No account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-bold transition-colors"
                    >
                      Sign Up
                    </button>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md dark:shadow-green-900/50 hover:shadow-lg dark:hover:shadow-green-700/50 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-sm"
                >
                  {authLoading ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="h-4.5 w-4.5" />
                      <span>Authenticate Account</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Register Mode */}
            {authMode === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Create AI Planner Profile</h3>
                  <p className="text-xs text-slate-400 font-medium">Join the clinical nutrition platform.</p>
                </div>

                <div className="space-y-3.5">
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm focus:outline-none transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter registered email..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm focus:outline-none transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure password..."
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm focus:outline-none transition-all"
                    />
                  </div>

                  {/* Role Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Access Level Role
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-xs focus:outline-none font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                    >
                      <option value="user">User / Patient Profile</option>
                      <option value="nutritionist">Registered Nutritionist</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-bold transition-colors"
                  >
                    Sign In
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md dark:shadow-green-900/50 hover:shadow-lg dark:hover:shadow-green-700/50 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-sm"
                >
                  {authLoading ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>Register Profile</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Forgot Mode */}
            {authMode === "forgot" && (
              <form onSubmit={handleForgot} className="space-y-5">
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Recover Credentials</h3>
                  <p className="text-xs text-slate-400">Request password reset magic link.</p>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm focus:outline-none transition-all"
                  />
                </div>

                <div className="text-center text-xs text-slate-400 dark:text-slate-500">
                  Back to{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-bold transition-colors"
                  >
                    Login
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md dark:shadow-green-900/50 hover:shadow-lg dark:hover:shadow-green-700/50 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-xs"
                >
                  {authLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Send Password Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
