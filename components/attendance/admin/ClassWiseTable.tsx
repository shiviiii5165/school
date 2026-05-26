"use client";

interface ClassStat {
  id: string;
  name: string;
  section: string;
  teacherName: string;
  avgAttendance: number;
  todayMarked: boolean;
  studentCount: number;
}

interface ClassWiseTableProps {
  classes: ClassStat[];
}

export default function ClassWiseTable({ classes }: ClassWiseTableProps) {
  return (
    <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-text-primary">Class-Wise Attendance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="text-left font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Class</th>
              <th className="text-left font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Teacher</th>
              <th className="text-left font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Avg Att.</th>
              <th className="text-left font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Today Status</th>
              <th className="text-right font-semibold text-text-muted uppercase tracking-wider px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => {
              const isLow = cls.avgAttendance < 75;
              return (
                <tr key={cls.id} className={`border-b border-border last:border-0 hover:bg-background/50 transition-colors ${isLow ? "border-l-4 border-l-[#D97706]" : ""}`}>
                  <td className="px-6 py-4 font-semibold text-text-primary">{cls.name} - {cls.section}</td>
                  <td className="px-6 py-4 text-text-secondary">{cls.teacherName}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono font-medium ${isLow ? "text-[#D97706]" : "text-text-primary"}`}>
                      {cls.avgAttendance}%
                      {isLow && <span className="ml-1 text-[#D97706]">⚠</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {cls.todayMarked ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#16A34A]">
                        ✅ Marked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626]">
                        ❌ Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark font-medium transition-colors">
                      {cls.todayMarked ? "View" : "Remind"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {classes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-muted">No class records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
