import React from "react";
import { Apple, LogIn, Menu, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface NavbarProps {
  onNavigate: (page: string) => void;
  activeSection: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenAuth: (mode: "login" | "register") => void;
}

export default function Navbar({
  onNavigate,
  activeSection,
  isLoggedIn,
  onLogout,
  onOpenAuth,
}: NavbarProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: "home", label: t("top_home") },
    { id: "features", label: t("top_features") },
    { id: "how-it-works", label: t("top_how") },
    { id: "testimonials", label: t("top_test") },
    { id: "faq", label: t("top_faq") },
    { id: "contact", label: t("top_contact") },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav id="landing-navbar" className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            onClick={() => handleItemClick("home")}
            className="flex items-center space-x-3 cursor-pointer group transition-all duration-300"
          >
            <img src="/logo.jpg" alt="AI Dietitian Logo" className="h-10 w-auto rounded-full shadow-sm group-hover:scale-110 group-hover:rotate-[10deg] group-hover:ring-2 group-hover:ring-green-500 group-hover:ring-offset-2 dark:group-hover:ring-offset-slate-900 group-hover:shadow-green-500/50 transition-all duration-300" />
            <span className="text-xl font-black text-slate-800 dark:text-white tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] transition-all duration-300">
              AI Dietitian
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`group relative px-4 py-2 text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeSection === item.id ? "text-green-600 dark:text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400"
                }`}
              >
                {/* Corner Trims for Sci-Fi Effect */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-transparent group-hover:border-green-500 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-transparent group-hover:border-green-500 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-transparent group-hover:border-green-500 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-transparent group-hover:border-green-500 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md shadow-green-100 dark:shadow-green-900/50 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {t("top_dashboard")}
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 rounded-xl transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  {t("top_signout")}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t("top_login")}</span>
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md shadow-green-100 dark:shadow-green-900/50 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {t("top_register")}
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-green-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-green-50 text-green-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-green-600"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-100 px-4 flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate("dashboard");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-center text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {t("top_dashboard")}
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-center text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {t("top_signout")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onOpenAuth("login");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-center text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {t("top_login")}
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth("register");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-center text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {t("top_register")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
