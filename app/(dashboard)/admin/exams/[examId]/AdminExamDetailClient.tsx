"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, CalendarDays, ShieldCheck, 
  FileEdit, BarChart3, Save, Send, Upload, CheckCircle2, Lock, Unlock, Loader2 
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import DataTable from "@/components/shared/DataTable";

export default function AdminExamDetailClient({ examId }: { examId: string }) {
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("TIMETABLE");

  // Timetable State
  const [timetableForm, setTimetableForm] = useState<any[]>([]);
  const [timetableSaving, setTimetableSaving] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Eligibility State
  const [eligibilityData, setEligibilityData] = useState<any[]>([]);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  // Marks Status State
  const [marksStatus, setMarksStatus] = useState<any[]>([]);
  const [allComplete, setAllComplete] = useState(false);
  const [marksStatusLoading, setMarksStatusLoading] = useState(false);
  const [openingMarks, setOpeningMarks] = useState(false);
  const [calculating, setCalculating] = useState(false);

  // Results State
  const [resultsLoading, setResultsLoading] = useState(false);
  const [publishingResults, setPublishingResults] = useState(false);

  useEffect(() => {
    fetchExam();
    fetch("/api/subjects").then(res => res.json()).then(data => {
      if (data.subjects) setSubjects(data.subjects);
    });
  }, [examId]);

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/exams/${examId}`);
      const data = await res.json();
      if (data.exam) {
        setExam(data.exam);
        // Init timetable form from slots if they exist
        if (data.exam.slots?.length > 0) {
          setTimetableForm(data.exam.slots);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load exam details");
    } finally {
      setLoading(false);
    }
  };

  const addTimetableRow = () => {
    setTimetableForm([...timetableForm, {
      id: `new_${Date.now()}`,
      classId: "",
      subjectId: "",
      date: "",
      startTime: "09:00",
      endTime: "12:00",
      room: "",
      maxMarks: 100,
      passMarks: exam?.defaultPassPct || 33,
    }]);
  };

  const updateTimetableRow = (index: number, field: string, value: any) => {
    const newForm = [...timetableForm];
    newForm[index] = { ...newForm[index], [field]: value };
    setTimetableForm(newForm);
  };

  const removeTimetableRow = (index: number) => {
    setTimetableForm(timetableForm.filter((_, i) => i !== index));
  };

  const saveTimetable = async () => {
    if (timetableForm.length === 0) return toast.error("No slots to save");
    
    // Validate
    for (const slot of timetableForm) {
      if (!slot.classId || !slot.subjectId || !slot.date || !slot.room) {
        return toast.error("Please fill all required fields in the timetable");
      }
    }

    setTimetableSaving(true);
    try {
      const res = await fetch(`/api/exams/${examId}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: timetableForm }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Timetable saved successfully");
      fetchExam();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setTimetableSaving(false);
    }
  };

  const publishTimetable = async () => {
    if (!confirm("This will publish the timetable and notify all students/parents. Continue?")) return;
    setPublishLoading(true);
    try {
      const res = await fetch(`/api/exams/${examId}/publish`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Timetable published & Hall Tickets generated!");
      fetchExam();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPublishLoading(false);
    }
  };

  const fetchEligibility = async () => {
    setEligibilityLoading(true);
    try {
      const res = await fetch(`/api/exams/${examId}/eligibility`);
      const data = await res.json();
      if (data.eligibility) setEligibilityData(data.eligibility);
    } catch (err) {
      toast.error("Failed to load eligibility");
    } finally {
      setEligibilityLoading(false);
    }
  };

  const toggleStudentBlock = async (studentId: string, isBlocked: boolean) => {
    const reason = isBlocked ? prompt("Reason for blocking admit card:") : null;
    if (isBlocked && reason === null) return; // Cancelled prompt

    try {
      const res = await fetch(`/api/exams/${examId}/eligibility/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, isBlocked, blockReason: reason }),
      });
      if (!res.ok) throw new Error("Failed to override");
      toast.success(isBlocked ? "Student blocked" : "Student unblocked");
      fetchEligibility();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const fetchMarksStatus = async () => {
    setMarksStatusLoading(true);
    try {
      const res = await fetch(`/api/exams/${examId}/marks-status`);
      const data = await res.json();
      if (data.statuses) {
        setMarksStatus(data.statuses);
        setAllComplete(data.allComplete);
      }
    } catch (err) {
      toast.error("Failed to load marks status");
    } finally {
      setMarksStatusLoading(false);
    }
  };

  const openMarksEntry = async () => {
    if (!confirm("This will notify teachers to start entering marks. Continue?")) return;
    setOpeningMarks(true);
    try {
      const res = await fetch(`/api/exams/${examId}/open-marks`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to open marks entry");
      toast.success("Marks entry opened and teachers notified!");
      fetchExam();
    } catch (err) {
      toast.error("Failed to open marks");
    } finally {
      setOpeningMarks(false);
    }
  };

  const unlockSlot = async (slotId: string) => {
    if (!confirm("This will allow the teacher to edit marks again. Continue?")) return;
    try {
      const res = await fetch(`/api/exams/${examId}/slots/${slotId}/unlock`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to unlock");
      toast.success("Slot unlocked!");
      fetchMarksStatus();
    } catch (err) {
      toast.error("Failed to unlock");
    }
  };

  const calculateResults = async () => {
    if (!confirm("This will compute final grades and ranks for all students. Continue?")) return;
    setCalculating(true);
    try {
      const res = await fetch(`/api/exams/${examId}/calculate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to calculate results");
      toast.success("Results calculated successfully!");
      fetchExam();
    } catch (err) {
      toast.error("Calculation failed");
    } finally {
      setCalculating(false);
    }
  };

  const publishResults = async () => {
    if (!confirm("WARNING: This will publish final results and notify ALL students and parents. This action cannot be undone. Publish?")) return;
    setPublishingResults(true);
    try {
      const res = await fetch(`/api/exams/${examId}/publish-results`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to publish");
      toast.success("Results published globally!");
      fetchExam();
    } catch (err) {
      toast.error("Failed to publish results");
    } finally {
      setPublishingResults(false);
    }
  };

  // Tab switching effect
  useEffect(() => {
    if (activeTab === "ELIGIBILITY") fetchEligibility();
    if (activeTab === "MARKS") fetchMarksStatus();
  }, [activeTab]);


  if (loading) return <div className="p-8 text-center text-text-secondary"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (!exam) return <div className="p-8 text-center text-text-secondary">Exam not found</div>;

  const tabs = [
    { id: "TIMETABLE", label: "Timetable Builder", icon: CalendarDays },
    { id: "ELIGIBILITY", label: "Eligibility & Admit Cards", icon: ShieldCheck, disabled: exam.status === "DRAFT" },
    { id: "MARKS", label: "Marks Entry Status", icon: FileEdit, disabled: exam.status === "DRAFT" || exam.status === "SCHEDULED" },
    { id: "RESULTS", label: "Results & Publishing", icon: BarChart3, disabled: exam.status === "DRAFT" || exam.status === "SCHEDULED" || exam.status === "ONGOING" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/exams" className="p-2 bg-surface border border-border rounded-lg hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">{exam.name}</h1>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                exam.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                exam.status === "MARKS_ENTRY" ? "bg-purple-100 text-purple-700" :
                exam.status === "ONGOING" ? "bg-amber-100 text-amber-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {exam.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-sm text-text-secondary">{exam.academicYear} • {exam.type.replace(/_/g, ' ')} • {new Date(exam.startDate).toLocaleDateString()} to {new Date(exam.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === tab.id 
                ? "border-primary text-primary bg-primary/5" 
                : "border-transparent text-text-secondary hover:text-text-primary hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-card min-h-[500px]">
        
        {/* TIMETABLE TAB */}
        {activeTab === "TIMETABLE" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Timetable Builder</h3>
                <p className="text-sm text-text-secondary">Define slots, rooms, and max marks for each subject.</p>
              </div>
              <div className="flex items-center gap-3">
                {exam.status === "DRAFT" && (
                  <>
                    <button 
                      onClick={saveTimetable}
                      disabled={timetableSaving}
                      className="px-4 py-2 bg-surface border border-border text-text-primary font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      {timetableSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Draft
                    </button>
                    <button 
                      onClick={publishTimetable}
                      disabled={publishLoading || timetableForm.length === 0}
                      className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {publishLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Publish Timetable
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background text-text-muted text-xs uppercase">
                  <tr>
                    <th className="px-3 py-3 rounded-tl-lg">Date</th>
                    <th className="px-3 py-3">Time</th>
                    <th className="px-3 py-3">Class</th>
                    <th className="px-3 py-3">Subject</th>
                    <th className="px-3 py-3">Room</th>
                    <th className="px-3 py-3">Max Marks</th>
                    <th className="px-3 py-3 rounded-tr-lg"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {timetableForm.map((slot, index) => (
                    <tr key={slot.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-3">
                        <input type="date" value={slot.date.split('T')[0]} onChange={e => updateTimetableRow(index, 'date', e.target.value)} disabled={exam.status !== "DRAFT"} className="w-full p-2 border border-border rounded outline-none focus:border-primary disabled:bg-slate-100" />
                      </td>
                      <td className="px-3 py-3 flex gap-2">
                        <input type="time" value={slot.startTime} onChange={e => updateTimetableRow(index, 'startTime', e.target.value)} disabled={exam.status !== "DRAFT"} className="w-24 p-2 border border-border rounded outline-none focus:border-primary disabled:bg-slate-100" />
                        <span className="self-center text-text-muted">-</span>
                        <input type="time" value={slot.endTime} onChange={e => updateTimetableRow(index, 'endTime', e.target.value)} disabled={exam.status !== "DRAFT"} className="w-24 p-2 border border-border rounded outline-none focus:border-primary disabled:bg-slate-100" />
                      </td>
                      <td className="px-3 py-3">
                        {exam.status === "DRAFT" ? (
                          <select value={slot.classId} onChange={e => updateTimetableRow(index, 'classId', e.target.value)} className="w-full p-2 border border-border rounded outline-none focus:border-primary">
                            <option value="">Select...</option>
                            {/* In a real app we'd load classes assigned to the exam here. Assuming all subjects list has classes. */}
                          </select>
                        ) : (
                          <span className="font-medium">{slot.class?.name} {slot.class?.section}</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {exam.status === "DRAFT" ? (
                          <select value={slot.subjectId} onChange={e => updateTimetableRow(index, 'subjectId', e.target.value)} className="w-full p-2 border border-border rounded outline-none focus:border-primary">
                            <option value="">Select...</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                          </select>
                        ) : (
                          <span className="font-medium">{slot.subject?.name}</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <input type="text" value={slot.room} onChange={e => updateTimetableRow(index, 'room', e.target.value)} disabled={exam.status !== "DRAFT"} placeholder="e.g. Hall A" className="w-24 p-2 border border-border rounded outline-none focus:border-primary disabled:bg-slate-100" />
                      </td>
                      <td className="px-3 py-3">
                        <input type="number" value={slot.maxMarks} onChange={e => updateTimetableRow(index, 'maxMarks', Number(e.target.value))} disabled={exam.status !== "DRAFT"} className="w-20 p-2 border border-border rounded outline-none focus:border-primary disabled:bg-slate-100" />
                      </td>
                      <td className="px-3 py-3 text-right">
                        {exam.status === "DRAFT" && (
                          <button onClick={() => removeTimetableRow(index)} className="text-red-500 hover:text-red-700 p-1">Remove</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {exam.status === "DRAFT" && (
                <button onClick={addTimetableRow} className="mt-4 text-sm text-primary font-medium hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              )}
            </div>
          </div>
        )}

        {/* ELIGIBILITY TAB */}
        {activeTab === "ELIGIBILITY" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Eligibility & Admit Cards</h3>
              <p className="text-sm text-text-secondary">Review student eligibility and manually block/unblock admit cards.</p>
            </div>
            
            {eligibilityLoading ? (
              <div className="py-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
            ) : (
              <DataTable
                data={eligibilityData}
                columns={[
                  { header: "Roll No", accessorKey: "rollNo" },
                  { header: "Student Name", accessorKey: "name" },
                  { header: "Class", accessorKey: "className" },
                  { 
                    header: "Attendance", 
                    accessorKey: "attendancePercentage",
                    cell: (s) => (
                      <span className={`font-medium ${s.attendanceLow ? "text-red-600" : "text-green-600"}`}>
                        {s.attendancePercentage.toFixed(1)}%
                      </span>
                    )
                  },
                  { 
                    header: "Admit Card Status", 
                    accessorKey: "isBlocked",
                    cell: (s) => (
                      s.isBlocked 
                        ? <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold" title={s.blockReason}>BLOCKED</span>
                        : <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">ISSUED</span>
                    )
                  },
                  { 
                    header: "Action", 
                    accessorKey: "id",
                    cell: (s) => (
                      <button 
                        onClick={() => toggleStudentBlock(s.studentId, !s.isBlocked)}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                          s.isBlocked ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {s.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )
                  }
                ]}
              />
            )}
          </div>
        )}

        {/* MARKS TAB */}
        {activeTab === "MARKS" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Marks Entry Status</h3>
                <p className="text-sm text-text-secondary">Monitor teachers' progress in submitting marks.</p>
              </div>
              {exam.status === "SCHEDULED" && (
                <button 
                  onClick={openMarksEntry}
                  disabled={openingMarks}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {openingMarks ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                  Open Marks Entry
                </button>
              )}
              {exam.status === "MARKS_ENTRY" && allComplete && (
                <button 
                  onClick={() => setActiveTab("RESULTS")}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  Proceed to Results
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>

            {marksStatusLoading ? (
               <div className="py-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
            ) : (
              <DataTable
                data={marksStatus}
                columns={[
                  { header: "Class", accessorKey: "className" },
                  { header: "Subject", accessorKey: "subjectName" },
                  { header: "Teacher", accessorKey: "teacherName" },
                  { 
                    header: "Progress", 
                    accessorKey: "marksEntered",
                    cell: (s) => (
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden w-24">
                          <div 
                            className={`h-full ${s.isComplete ? 'bg-green-500' : 'bg-primary'}`} 
                            style={{ width: `${(s.marksEntered / s.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-secondary w-10 text-right">{s.marksEntered}/{s.totalStudents}</span>
                      </div>
                    )
                  },
                  { 
                    header: "Status", 
                    accessorKey: "isLocked",
                    cell: (s) => (
                      s.isLocked 
                        ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><Lock className="w-3 h-3"/> SUBMITTED</span>
                        : <span className="text-amber-600 text-xs font-bold">PENDING</span>
                    )
                  },
                  {
                    header: "Action",
                    accessorKey: "id",
                    cell: (s) => (
                      s.isLocked && exam.status === "MARKS_ENTRY" ? (
                        <button 
                          onClick={() => unlockSlot(s.slotId)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Unlock className="w-3 h-3" /> Reopen
                        </button>
                      ) : null
                    )
                  }
                ]}
              />
            )}
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === "RESULTS" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Results & Publishing</h3>
                <p className="text-sm text-text-secondary">Compute grades, ranks, and publish final results.</p>
              </div>
              <div className="flex items-center gap-3">
                {exam.status === "MARKS_ENTRY" && (
                  <button 
                    onClick={calculateResults}
                    disabled={calculating || !allComplete}
                    className="px-4 py-2 bg-surface border border-border text-text-primary font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                    title={!allComplete ? "All marks must be submitted first" : ""}
                  >
                    {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                    Calculate Ranks & Grades
                  </button>
                )}
                {exam.status === "MARKS_ENTRY" && (
                  <button 
                    onClick={publishResults}
                    disabled={publishingResults || exam._count?.summaries === 0}
                    className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {publishingResults ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Publish Final Results
                  </button>
                )}
              </div>
            </div>

            {exam.status === "COMPLETED" ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Results Published Successfully!</h3>
                <p className="text-green-700 max-w-md">The examination process is fully completed. All students and parents have been notified, and results are available on their dashboards.</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
                <p className="text-slate-600">Review the marks status. Once all marks are submitted, calculate the grades and publish.</p>
                {exam._count?.summaries > 0 && (
                  <p className="text-sm font-bold text-primary mt-4">✅ Grades have been calculated. Ready to publish.</p>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
