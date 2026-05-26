"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Loader2 } from "lucide-react";

interface FinancialAnalyticsProps {
  data: any;
  isLoading: boolean;
}

const COLORS = ['#2980b9', '#27ae60', '#e74c3c', '#f39c12', '#8e44ad'];

export default function FinancialAnalytics({ data, isLoading }: FinancialAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { monthlyRevenueChart, paymentMethodChart } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Revenue Chart */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-text-primary mb-6">Monthly Revenue</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueChart} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickFormatter={(val) => `₹${val/1000}k`} />
              <RechartsTooltip 
                cursor={{ fill: 'var(--color-background)' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="amount" fill="var(--color-status-success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-text-primary mb-6">Payment Methods</h3>
        <div className="h-[250px] w-full flex items-center justify-center">
          {paymentMethodChart.length === 0 ? (
             <p className="text-text-muted">No data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodChart.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Legend */}
        {paymentMethodChart.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {paymentMethodChart.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-medium text-text-secondary">{entry.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
