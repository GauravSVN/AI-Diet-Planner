import React from "react";
import {
  Apple,
  LayoutDashboard,
  User,
  Activity,
  CalendarDays,
  FileText,
  GlassWater,
  TrendingUp,
  History,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MessageSquareHeart,
  BookOpenCheck
} from "lucide-react";
import { UserRole } from "../types";
import { useLanguage } from "../LanguageContext";

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  currentTab,
  onChangeTab,
  userRole,
  userName,
  userEmail,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileMenuOpen,
  onCloseMobile,
}: SidebarProps) {
  const { t } = useLanguage();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AI";
  };

  const navItems = [
    { id: "dashboard", label: t("nav_home"), icon: LayoutDashboard },
    { id: "profile", label: t("nav_profile"), icon: User },
    { id: "assessment", label: t("nav_assessment"), icon: ClipboardList },
    { id: "diet-plan", label: t("nav_diet"), icon: Apple },
    { id: "nutrition-report", label: t("nav_report"), icon: FileText },
    { id: "bmi-calc", label: t("nav_bmi"), icon: Activity },
    { id: "water-intake", label: t("nav_water"), icon: GlassWater },
    { id: "meal-planner", label: t("nav_meal"), icon: CalendarDays },
    { id: "progress", label: t("nav_progress"), icon: TrendingUp },
    { id: "history", label: t("nav_history"), icon: History },
    { id: "feedback", label: t("nav_feedback"), icon: MessageSquareHeart },
    { id: "settings", label: t("nav_settings"), icon: Settings },
  ];

  // Admin / Nutritionist additions
  const adminItems = [
    { id: "admin-panel", label: "Admin Panel", icon: ShieldCheck },
  ];

  const nutritionistItems = [
    { id: "nutri-dashboard", label: "Client Assessments", icon: BookOpenCheck },
  ];

  const isSuperAdmin = userEmail === "gauravraj17062000@gmail.com";

  const visibleItems = isSuperAdmin ? adminItems : [
    ...navItems,
    ...(userRole === "admin" ? adminItems : []),
    ...(userRole === "nutritionist" ? nutritionistItems : []),
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}
      
      <aside
        id="dashboard-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-900/90 dark:backdrop-blur-2xl text-slate-800 dark:text-slate-100 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
      <div>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-150 dark:border-slate-800">
          <div className="group flex items-center space-x-3 px-2 mt-2 cursor-pointer transition-all duration-300">
            <img src="/logo.jpg" alt="AI Dietitian Logo" className="h-10 w-auto rounded-full shadow-sm group-hover:scale-110 group-hover:rotate-[10deg] group-hover:ring-2 group-hover:ring-green-500 group-hover:ring-offset-2 dark:group-hover:ring-offset-slate-900 group-hover:shadow-green-500/50 transition-all duration-300" />
            {!isCollapsed && (
              <span className="text-xl font-black text-slate-800 dark:text-white tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] transition-all duration-300">
                AI Dietitian
              </span>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="hidden md:block p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Profile Summary Widget */}
        <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex items-center space-x-3 overflow-hidden">
          <div className="h-10 w-10 rounded-xl bg-green-600/10 border border-green-500/20 flex items-center justify-center font-bold text-green-700 shrink-0 shadow-sm">
            {getInitials(userName)}
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate leading-snug">
                {userName}
              </h4>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block">
                {userRole === "admin" ? t('nav_role_admin') : userRole === "nutritionist" ? t('nav_role_nutritionist') : t('nav_role_user')}
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)] scrollbar-thin">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-r-4 border-green-600 dark:border-green-500 font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-green-600" : "text-slate-400"}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-150 dark:border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
    </>
  );
}

