"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Loader2 } from "lucide-react";

interface DisciplineAnalyticsProps {
  data: any;
  isLoading: boolean;
}

const COLORS = ['#e74c3c', '#f39c12', '#3498db', '#9b59b6', '#34495e'];

export default function DisciplineAnalytics({ data, isLoading }: DisciplineAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { violationCategoryChart, suspensionTrendChart } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Violation Categories */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-text-primary mb-6">Violations by Category</h3>
        <div className="h-[250px] w-full flex flex-col sm:flex-row items-center justify-center">
          {violationCategoryChart.length === 0 ? (
             <p className="text-text-muted">No discipline records found.</p>
          ) : (
            <>
              <div className="h-full w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={violationCategoryChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {violationCategoryChart.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                <ul className="space-y-3">
                  {violationCategoryChart.map((entry: any, index: number) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm text-text-secondary truncate max-w-[120px]" title={entry.name}>{entry.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-text-primary">{entry.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Suspension Trends */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-text-primary mb-6">Suspension Trends (Monthly)</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={suspensionTrendChart} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <RechartsTooltip 
                cursor={{ fill: 'var(--color-background)' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [value, 'Suspensions']}
              />
              <Bar dataKey="count" fill="var(--color-status-danger)" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
