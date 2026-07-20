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
  Menu,
  Scale,
  Flame,
  ShieldAlert,
  Target
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
import NutritionistDashboardView from "./components/NutritionistDashboardView";
import UserChatView from "./components/UserChatView";
import UserProfileView from "./components/UserProfileView";

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
import { useLanguage } from "./LanguageContext";

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
    totalPremiumUsers: 0,
  });

  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = React.useState(false);

  // Settings options
  const { t, language, setLanguage } = useLanguage();
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  // Load token on startup
  React.useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setIsLoggedIn(true);
      setActiveSection("dashboard");
      if (parsedUser.email === "gauravraj17062000@gmail.com") {
        setCurrentTab("admin-dashboard");
      }
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
      if (user.email === "gauravraj17062000@gmail.com") {
        setCurrentTab("admin-dashboard");
      } else {
        setCurrentTab("dashboard");
      }
      
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

  const handleUpdateProfile = async (name: string, email: string, phone?: string, dob?: string) => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put("/api/user/profile", { name, email, phone, dob }, config);
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

  // Admin: Toggle Subscription
  const handleToggleSubscription = async (userId: string) => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`/api/admin/users/${userId}/subscription`, {}, config);
      fetchDashboardData();
    } catch (err) {
      console.error("Error toggling subscription:", err);
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
    <div className={`min-h-screen font-sans ${theme === "dark" ? "dark bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 text-slate-100" : "bg-slate-200 text-slate-900"}`}>
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
            userEmail={currentUser?.email || ""}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileMenuOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            onLogout={handleLogout}
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
                  <UserProfileView 
                    currentUser={currentUser} 
                    onUpdateProfile={handleUpdateProfile} 
                  />
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
                  <div className="max-w-4xl mx-auto bg-white dark:bg-slate-950/80 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] border border-white/40 dark:border-green-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-8 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-5">
                      <div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                            <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <span>{t('report_title')}</span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{t('report_subtitle')}</p>
                      </div>
                      {nutritionReport && (
                        <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-bold text-sm border border-green-200 dark:border-green-800/50 shadow-sm flex items-center space-x-2">
                          <UserCheck className="h-4 w-4" />
                          <span>{t('report_status')}</span>
                        </div>
                      )}
                    </div>

                    {nutritionReport ? (
                      <div className="space-y-8">
                        {/* Core Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 dark:from-blue-950/30 dark:to-slate-900/50 p-5 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
                            <div className="flex items-center space-x-2 mb-3">
                              <Scale className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] font-bold text-blue-600/80 dark:text-blue-400 uppercase tracking-wider">{t("report_current_bmi")}</span>
                            </div>
                            <span className="text-3xl font-black text-blue-700 dark:text-blue-300 block">{nutritionReport.bmi || "--"}</span>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100/40 dark:from-purple-950/30 dark:to-slate-900/50 p-5 rounded-2xl border border-purple-100/50 dark:border-purple-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
                            <div className="flex items-center space-x-2 mb-3">
                              <Activity className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] font-bold text-purple-600/80 dark:text-purple-400 uppercase tracking-wider">{t('report_cat')}</span>
                            </div>
                            <span className="text-xl font-black text-purple-700 dark:text-purple-300 block truncate leading-tight">{nutritionReport.weightCategory || "--"}</span>
                          </div>
                          
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100/40 dark:from-orange-950/30 dark:to-slate-900/50 p-5 rounded-2xl border border-orange-100/50 dark:border-orange-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group">
                            <div className="flex items-center space-x-2 mb-3">
                              <Flame className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] font-bold text-orange-600/80 dark:text-orange-400 uppercase tracking-wider">{t('report_bmr')}</span>
                            </div>
                            <span className="text-3xl font-black text-orange-700 dark:text-orange-300 block">{nutritionReport.bmr || "--"} <span className="text-xs font-bold opacity-60">kcal</span></span>
                          </div>
                          
                          <div className="bg-gradient-to-br from-rose-50 to-rose-100/40 dark:from-rose-950/30 dark:to-slate-900/50 p-5 rounded-2xl border border-rose-100/50 dark:border-rose-900/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 group">
                            <div className="flex items-center space-x-2 mb-3">
                              <Target className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] font-bold text-rose-600/80 dark:text-rose-400 uppercase tracking-wider">{t('report_tdee')}</span>
                            </div>
                            <span className="text-3xl font-black text-rose-700 dark:text-rose-300 block">{nutritionReport.tdee || "--"} <span className="text-xs font-bold opacity-60">kcal</span></span>
                          </div>
                        </div>

                        {/* Metabolic Summary */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 hover:border-green-500/40 transition-all">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span>{t('report_summary')}</span>
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-3 bg-white dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-inner">{nutritionReport.summaryText}</p>
                          <div className="mt-4 flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 w-fit px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                            <Target className="h-4 w-4" />
                            <span className="font-bold text-sm">{t('report_target_weight')}: {nutritionReport.idealWeightRange || "N/A"}</span>
                          </div>
                        </div>

                        {/* Insights Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-orange-50/50 dark:bg-orange-950/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 space-y-4 hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
                            <h3 className="text-sm font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                              <ShieldAlert className="h-4 w-4" />
                              <span>{t('report_deficiencies')}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {(nutritionReport.deficiencies || []).map((def: string, idx: number) => (
                                <span key={idx} className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 font-semibold text-xs rounded-lg border border-orange-200 dark:border-orange-800/50">
                                  {def}
                                </span>
                              ))}
                              {(!nutritionReport.deficiencies || nutritionReport.deficiencies.length === 0) && (
                                <span className="text-sm text-slate-500 italic">{t("report_no_def")}</span>
                              )}
                            </div>
                          </div>

                          <div className="bg-green-50/50 dark:bg-green-950/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30 space-y-4 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                            <h3 className="text-sm font-bold text-green-800 dark:text-green-400 uppercase tracking-wider flex items-center space-x-2">
                              <Sparkles className="h-4 w-4 text-green-500" />
                              <span>{t('report_superfoods')}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {(nutritionReport.superfoods || []).map((food: string, idx: number) => (
                                <span key={idx} className="px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-semibold text-xs rounded-lg border border-green-200 dark:border-green-800/50 shadow-sm">
                                  {food}
                                </span>
                              ))}
                              {(!nutritionReport.superfoods || nutritionReport.superfoods.length === 0) && (
                                <span className="text-sm text-slate-500 italic">{t("report_no_super")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="p-4 bg-white dark:bg-black/40 rounded-full shadow-sm">
                          <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{t('report_unavail')}</h3>
                          <p className="text-slate-500 max-w-sm mt-1 text-sm leading-relaxed">{t('report_unavail_sub')}</p>
                          <button 
                            onClick={() => setCurrentTab("assessment")}
                            className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all font-bold text-sm cursor-pointer"
                          >
                            {t('nav_assessment')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentTab === "bmi-calc" && <BmiCalculatorView userData={currentUser?.personalInfo} />}

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

                {currentTab === "chat" && (
                  <UserChatView currentUser={currentUser} />
                )}

                {currentTab === "nutri-dashboard" && currentUser?.role === "nutritionist" && (
                  <NutritionistDashboardView currentUser={currentUser} />
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

                {currentTab.startsWith("admin-") && currentUser?.role === "admin" && (
                  <AdminPanelView 
                    activeTab={currentTab.replace("admin-", "")}
                    stats={adminStats} 
                    users={allUsers} 
                    onToggleRole={handleToggleRole}
                    onDeleteUser={handleDeleteUser}
                    onToggleSubscription={handleToggleSubscription}
                    onNavigate={(tab) => setCurrentTab(`admin-${tab}`)}
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
          <div className="bg-white dark:bg-slate-950/80 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl dark:shadow-[0_0_40px_rgba(34,197,94,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden relative p-6 sm:p-8 space-y-6">
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
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
