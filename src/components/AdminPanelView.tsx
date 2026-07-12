import React from "react";
import { Users, Shield, Database, Search, AlertCircle, RefreshCw, Trash2, Check, Star } from "lucide-react";

interface AdminPanelViewProps {
  stats: {
    totalUsers: number;
    totalAssessments: number;
    totalFeedbacks: number;
    averageRating: number;
  };
  users: any[];
  onToggleUserRole: (userId: string, currentRole: string) => void;
  onDeleteUser: (userId: string) => void;
}

export default function AdminPanelView({
  stats,
  users,
  onToggleUserRole,
  onDeleteUser,
}: AdminPanelViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="admin-panel-tab" className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Nutritionist & Admin Administrative Command Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Differentiate user accounts, modify roles, purge tables, and inspect analytical metadata.</p>
        </div>
      </div>

      {/* Global Metadata statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered Accounts</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clinical Assessments Run</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{stats.totalAssessments}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Community Feedback reviews</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{stats.totalFeedbacks}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Platform Rating</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-800">{stats.averageRating.toFixed(1)}</span>
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-50 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>User Base Administration</span>
            </h3>
            <p className="text-xs text-slate-400">Toggle role flags between USER, NUTRITIONIST, and ADMIN parameters.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user email or role..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 focus:border-green-500 focus:bg-white dark:focus:bg-slate-800/90 rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">User Details</th>
                <th className="p-4">Active Role Flag</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:bg-slate-800/50/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-slate-800 block">{u.name}</span>
                        <span className="text-xs text-slate-400 font-medium block mt-0.5">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-rose-50 border-rose-100 text-rose-600"
                          : u.role === "nutritionist"
                          ? "bg-blue-50 border-blue-100 text-blue-600"
                          : "bg-green-50 border-green-100 text-green-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onToggleUserRole(u.id, u.role)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => onDeleteUser(u.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border border-slate-100 hover:border-rose-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                    No matching accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
