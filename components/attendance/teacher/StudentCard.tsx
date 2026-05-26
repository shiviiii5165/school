import React from "react";
import { useAttendanceStore } from "@/hooks/useAttendanceStore";
import { Lock } from "lucide-react";

interface StudentCardProps {
  id: string;
  name: string;
  rollNo: string;
  regId: string;
  avatar?: string | null;
  isSuspended?: boolean;
  suspensionReason?: string;
}

const StudentCard = React.memo(({ id, name, rollNo, regId, avatar, isSuspended, suspensionReason }: StudentCardProps) => {
  const status = useAttendanceStore((state) => state.attendanceMap[id]);
  const setStatus = useAttendanceStore((state) => state.setStatus);

  const isPresent = status === 'PRESENT';
  const isAbsent = status === 'ABSENT';

  if (isSuspended) {
    return (
      <div className="grid grid-cols-[120px_1fr_180px] md:grid-cols-[180px_1fr_240px] items-center px-4 md:px-6 py-2.5 min-h-[48px] border-b border-border bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors relative">
        <div className="text-xs font-mono text-text-muted">{regId}</div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center flex-shrink-0 overflow-hidden grayscale opacity-80">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-text-secondary">{name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <span className="text-sm font-medium text-text-primary truncate">{name}</span>
        </div>
        <div className="flex items-center justify-center md:justify-start">
           <button
            onClick={() => alert(`Attendance blocked — Suspended: ${suspensionReason || 'No reason provided'}`)}
            className="flex items-center gap-1.5 bg-[#FEF2F2] border border-dashed border-[#FECACA] text-[#EF4444] rounded px-3 py-1 text-xs font-semibold cursor-not-allowed hover:bg-red-50 transition-colors"
            title={`Attendance blocked — Suspended: ${suspensionReason || 'No reason provided'}`}
          >
            <Lock className="w-3 h-3" />
            BLOCKED
          </button>
        </div>
      </div>
    );
  }

  // Row styling based on status
  const rowBg = isPresent ? 'bg-[#F0FDF4] hover:bg-[#DCFCE7]' : isAbsent ? 'bg-[#FEF2F2] hover:bg-[#FEE2E2]' : 'bg-surface hover:bg-[#F8FAFC]';
  const rowBorder = isPresent ? 'border-[#BBF7D0]' : isAbsent ? 'border-[#FECACA]' : 'border-border';

  return (
    <div className={`grid grid-cols-[120px_1fr_180px] md:grid-cols-[180px_1fr_240px] items-center px-4 md:px-6 py-2.5 min-h-[48px] border-b ${rowBorder} ${rowBg} transition-colors group`}>
      <div className="text-xs font-mono text-text-muted">{regId}</div>
      <div className="flex items-center gap-3 pr-4">
        <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center flex-shrink-0 overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-text-secondary">{name.substring(0, 2).toUpperCase()}</span>
          )}
        </div>
        <span className="text-sm font-medium text-text-primary truncate">{name}</span>
      </div>

      <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6">
        <label className="flex items-center gap-2 cursor-pointer group/radio">
          <div className="relative flex items-center">
            <input 
              type="radio" 
              name={`status-${id}`} 
              checked={isPresent} 
              onChange={() => setStatus(id, 'PRESENT')}
              className="peer sr-only"
            />
            <div className={`w-4 h-4 rounded-full border border-border flex items-center justify-center transition-all ${isPresent ? 'border-[#16A34A]' : 'group-hover/radio:border-[#16A34A]'}`}>
              {isPresent && <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></div>}
            </div>
          </div>
          <span className={`text-xs md:text-sm font-medium transition-colors ${isPresent ? 'text-[#16A34A]' : 'text-text-secondary group-hover/radio:text-text-primary'}`}>
            Present
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group/radio">
          <div className="relative flex items-center">
            <input 
              type="radio" 
              name={`status-${id}`} 
              checked={isAbsent} 
              onChange={() => setStatus(id, 'ABSENT')}
              className="peer sr-only"
            />
            <div className={`w-4 h-4 rounded-full border border-border flex items-center justify-center transition-all ${isAbsent ? 'border-[#DC2626]' : 'group-hover/radio:border-[#DC2626]'}`}>
              {isAbsent && <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></div>}
            </div>
          </div>
          <span className={`text-xs md:text-sm font-medium transition-colors ${isAbsent ? 'text-[#DC2626]' : 'text-text-secondary group-hover/radio:text-text-primary'}`}>
            Absent
          </span>
        </label>
      </div>
    </div>
  );
});

StudentCard.displayName = "StudentCard";

export default StudentCard;
