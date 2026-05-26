"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { AlertTriangle, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { exportToExcel } from "@/lib/exportUtils";

interface AttendanceAnalyticsProps {
  data: any;
  isLoading: boolean;
}

export default function AttendanceAnalytics({ data, isLoading }: AttendanceAnalyticsProps) {
  const queryClient = useQueryClient();
  const [detainingId, setDetainingId] = useState<string | null>(null);

  const detainMutation = useMutation({
    mutationFn: async ({ studentId, name }: { studentId: string, name: string }) => {
      const res = await fetch(`/api/student/${studentId}/detain`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Low attendance - Admin enforced" })
      });
      if (!res.ok) throw new Error("Failed to detain");
      return res.json();
    },
    onMutate: ({ studentId }) => setDetainingId(studentId),
    onSettled: () => setDetainingId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports-attendance"] });
    }
  });

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { classWiseAttendance, dailyTrends, lowAttendanceStudents, threshold } = data;

  const handleExport = () => {
    exportToExcel(
      lowAttendanceStudents.map((s: any) => ({
        "Registration ID": s.regId,
        "Name": s.name,
        "Class": s.className,
        "Attendance %": s.percentage.toFixed(1),
        "Status": s.isDetained ? "DETAINED" : "AT RISK"
      })),
      "Low_Attendance_Report"
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class-wise Bar Chart */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-display font-semibold text-text-primary mb-6">Class-wise Attendance</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classWiseAttendance} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="className" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--color-background)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="percentage" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Trends Line Chart */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-display font-semibold text-text-primary mb-6">7-Day Trend</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrends} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Line type="monotone" dataKey="present" stroke="var(--color-status-success)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-status-success)" }} name="Present %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Table: Low Attendance */}
      <div className="bg-surface border border-status-danger/30 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-status-danger-bg/50">
          <div>
            <h3 className="font-display font-bold text-status-danger-text flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Students Below Threshold ({threshold}%)
            </h3>
            <p className="text-sm text-text-secondary mt-1">Review and enforce detention policies for these students.</p>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-lg text-sm font-medium hover:bg-background transition-colors">
            <Download className="w-4 h-4" />
            Export List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Student Info</th>
                <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Class</th>
                <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Attendance</th>
                <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lowAttendanceStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">
                    No students currently below the {threshold}% threshold.
                  </td>
                </tr>
              ) : (
                lowAttendanceStudents.map((student: any) => (
                  <tr key={student.id} className="hover:bg-background/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-text-primary">{student.name}</p>
                      <p className="text-xs text-text-muted">{student.regId}</p>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">{student.className}</td>
                    <td className="p-4 text-right">
                      <span className="inline-block px-2 py-1 rounded bg-status-danger-bg text-status-danger font-bold text-sm">
                        {student.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {student.isDetained ? (
                        <span className="text-xs font-bold px-2 py-1 bg-status-danger text-white rounded-full uppercase tracking-wider">Detained</span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-1 bg-status-warning-bg text-status-warning-text border border-status-warning rounded-full uppercase tracking-wider">At Risk</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!student.isDetained && (
                        <button
                          onClick={() => detainMutation.mutate({ studentId: student.id, name: student.name })}
                          disabled={detainingId === student.id}
                          className="px-3 py-1.5 bg-status-danger hover:bg-status-danger/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {detainingId === student.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Detain Student"}
                        </button>
                      )}
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
