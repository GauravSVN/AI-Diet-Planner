import React from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AnalyticsTabProps {
  categoryStats: { name: string; value: number }[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsTab({ categoryStats }: AnalyticsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <PieChartIcon className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Analytics & Reports</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-950/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">User Weight Categories</h4>
          
          <div className="flex-1 min-h-[300px]">
            {categoryStats && categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-slate-400">No data available to chart</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
