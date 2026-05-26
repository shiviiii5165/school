"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { Loader2, Award } from "lucide-react";

interface AcademicAnalyticsProps {
  data: any;
  isLoading: boolean;
}

export default function AcademicAnalytics({ data, isLoading }: AcademicAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { topPerformers, subjectComparisonChart } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subject Performance */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-text-primary mb-6">Subject Averages</h3>
        <div className="h-[250px] w-full">
          {subjectComparisonChart.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-text-muted">No academic data available yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectComparisonChart} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} width={80} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--color-background)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Average Score']}
                />
                <Bar dataKey="average" fill="var(--color-role-parent)" radius={[0, 4, 4, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border">
          <h3 className="font-display font-semibold text-text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-role-parent" />
            Top Performers (School-wide)
          </h3>
        </div>

        <div className="overflow-y-auto max-h-[250px] custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-background border-b border-border z-10">
              <tr>
                <th className="p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Student Name</th>
                <th className="p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Class</th>
                <th className="p-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topPerformers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-text-secondary">
                    No results available yet.
                  </td>
                </tr>
              ) : (
                topPerformers.map((student: any, idx: number) => (
                  <tr key={idx} className="hover:bg-background/50 transition-colors">
                    <td className="p-3 text-sm font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-text-muted font-bold">{idx + 1}.</span>
                        {student.name}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-text-secondary">{student.className}</td>
                    <td className="p-3 text-right">
                      <span className="inline-block px-2 py-1 rounded-md bg-role-parent/10 text-role-parent font-bold text-sm">
                        {student.percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
