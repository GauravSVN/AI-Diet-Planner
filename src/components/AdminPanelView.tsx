import React from "react";
import { Users, Shield, Database, Search, AlertCircle, RefreshCw, Trash2, Check, Star, X, Calendar, User as UserIcon, Phone, Mail, Clock, LayoutDashboard, MessageSquare, Radio, PieChart, FileText, Activity as ActivityIcon, Download, Crown, Settings, ShieldCheck } from "lucide-react";
import FeedbackTab from "./admin/FeedbackTab";
import BroadcastTab from "./admin/BroadcastTab";
import AnalyticsTab from "./admin/AnalyticsTab";
import CmsTab from "./admin/CmsTab";
import HealthTab from "./admin/HealthTab";
import PromptTuningTab from "./admin/PromptTuningTab";
import AuditLogsTab from "./admin/AuditLogsTab";

interface AdminPanelViewProps {
  stats: {
    totalUsers: number;
    totalAssessments: number;
    totalFeedbacks: number;
    averageRating: number;
    totalPremiumUsers?: number;
    categoryStats?: { name: string; value: number }[];
  };
  users: any[];
  onToggleUserRole: (userId: string, currentRole: string) => void;
  onDeleteUser: (userId: string) => void;
  onToggleSubscription?: (userId: string) => void;
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export default function AdminPanelView({
  stats,
  users,
  onToggleUserRole,
  onDeleteUser,
  onToggleSubscription,
  activeTab = "dashboard",
  onNavigate,
}: AdminPanelViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<any | null>(null);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCsv = () => {
    const headers = ["ID", "Name", "Email", "Role", "Subscription", "Joined"];
    const rows = users.map(u => [
      u.id, 
      `"${u.name}"`, 
      u.email, 
      u.role, 
      u.subscription || "free",
      new Date(u.createdAt).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-panel-tab" className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 dark:from-slate-900 dark:via-slate-800 dark:to-green-950 p-6 sm:p-8 rounded-3xl border border-green-500/30 dark:border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-500/10 text-emerald-100 dark:text-green-400 border border-green-500/20 rounded-full text-xs font-semibold">
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Terminal</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrative <span className="text-emerald-300 dark:text-green-400">Command Center</span>
          </h2>
          <p className="text-emerald-50 dark:text-slate-300 text-sm max-w-xl">
            Differentiate user accounts, modify roles, purge tables, and inspect analytical metadata.
          </p>
        </div>
      </div>

      {/* DASHBOARD TAB CONTENT */}
      {activeTab === "dashboard" && (
        <div className="space-y-8 animate-in fade-in duration-300">

      {/* Global Metadata statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => {
            const el = document.getElementById("user-management");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-white dark:bg-slate-950/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-green-500/10 hover:border-green-200 dark:hover:border-green-800/50 transition-all duration-300 group cursor-pointer"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Total Registered Accounts</span>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stats.totalUsers}</p>
        </div>

        <div 
          onClick={() => onNavigate && onNavigate("analytics")}
          className="bg-white dark:bg-slate-950/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-green-500/10 hover:border-green-200 dark:hover:border-green-800/50 transition-all duration-300 group cursor-pointer"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Clinical Assessments Run</span>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stats.totalAssessments}</p>
        </div>

        <div 
          onClick={() => onNavigate && onNavigate("feedback")}
          className="bg-white dark:bg-slate-950/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-green-500/10 hover:border-green-200 dark:hover:border-green-800/50 transition-all duration-300 group cursor-pointer"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Community Feedback reviews</span>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stats.totalFeedbacks}</p>
        </div>

        <div 
          onClick={() => onNavigate && onNavigate("feedback")}
          className="bg-white dark:bg-slate-950/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-amber-500/10 hover:border-amber-200 dark:hover:border-amber-800/50 transition-all duration-300 group cursor-pointer"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Average Platform Rating</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-800 dark:text-white">{stats.averageRating.toFixed(1)}</span>
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
        </div>

        <div 
          onClick={() => {
            const el = document.getElementById("user-management");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-white dark:bg-slate-950/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-purple-500/10 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300 group cursor-pointer"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Premium Active Users</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-800 dark:text-white">{stats.totalPremiumUsers || 0}</span>
            <Crown className="h-5 w-5 text-purple-500" />
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div id="user-management" className="bg-white dark:bg-slate-950/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-50 dark:border-slate-800/50 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>User Base Administration</span>
            </h3>
            <p className="text-xs text-slate-400">Toggle role flags between USER, NUTRITIONIST, and ADMIN parameters.</p>
          </div>

          {/* Search and Export */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user email or role..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>
            <button
              onClick={exportCsv}
              className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">User Details</th>
                <th className="p-4">Active Role Flag</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, index) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 text-center text-slate-400 font-bold text-xs">{index + 1}</td>
                    <td className="p-4">
                      <div 
                        className="cursor-pointer group w-fit" 
                        onClick={() => setSelectedUser(u)}
                      >
                        <span className="font-bold text-slate-800 dark:text-white block group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{u.name}</span>
                        <span className="text-xs text-slate-400 font-medium block mt-0.5 group-hover:text-green-500/70 dark:group-hover:text-green-400/70 transition-colors">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400"
                          : u.role === "nutritionist"
                          ? "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400"
                          : "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-700 dark:text-green-400"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {onToggleSubscription && (
                          <button
                            onClick={() => onToggleSubscription(u.id)}
                            title="Toggle Premium Subscription"
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              u.subscription === "premium" 
                                ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500 border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20" 
                                : "text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:text-amber-500"
                            }`}
                          >
                            <Crown className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onToggleUserRole(u.id, u.role)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl transition-all cursor-pointer"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => onDeleteUser(u.id)}
                          className="p-2 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl border border-slate-100 dark:border-rose-500/20 hover:border-rose-200 dark:hover:border-rose-500/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">
                    No matching accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )}

      {activeTab === "feedback" && <FeedbackTab />}
      {activeTab === "broadcast" && <BroadcastTab users={users} />}
      {activeTab === "analytics" && <AnalyticsTab categoryStats={stats.categoryStats || []} />}
      {activeTab === "cms" && <CmsTab />}
      {activeTab === "health" && <HealthTab />}
      {activeTab === "prompt" && <PromptTuningTab />}
      {activeTab === "audit" && <AuditLogsTab />}

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-green-500" />
                <span>User Profile</span>
              </h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-green-500/20 shrink-0">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white">{selectedUser.name}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${
                    selectedUser.role === "admin"
                      ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20"
                      : selectedUser.role === "nutritionist"
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20"
                      : "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20"
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5"><Mail className="h-3.5 w-3.5" /> <span>Email</span></span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate" title={selectedUser.email}>{selectedUser.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5"><Phone className="h-3.5 w-3.5" /> <span>Phone</span></span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedUser.phone || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5"><Calendar className="h-3.5 w-3.5" /> <span>Date of Birth</span></span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedUser.dob || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5"><UserIcon className="h-3.5 w-3.5" /> <span>Gender</span></span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{selectedUser.gender || "Not provided"}</p>
                </div>
                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5"><Clock className="h-3.5 w-3.5" /> <span>Joined On</span></span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {new Date(selectedUser.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
