"use client";

import { useState } from "react";
import DataTable from "@/components/shared/DataTable";
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Search, Calendar, Lock } from "lucide-react";

interface DisciplineReport {
  id: string;
  studentName: string;
  rollNo: string;
  className: string;
  reportedBy: string;
  category: string;
  date: string;
  status: "PENDING" | "REVIEWED" | "SUSPENDED";
  description: string;
}

const dummyReports: DisciplineReport[] = [
  {
    id: "1",
    studentName: "Aman Singh",
    rollNo: "03",
    className: "Class 10 - B",
    reportedBy: "Rajesh Singh",
    category: "Behavior",
    date: "2026-10-25T10:30:00",
    status: "PENDING",
    description: "Extremely disruptive during Mathematics lecture. Refused to follow instructions and argued with the teacher."
  },
  {
    id: "2",
    studentName: "Vikas Patel",
    rollNo: "12",
    className: "Class 9 - A",
    reportedBy: "Vikram Malhotra",
    category: "Device Use",
    date: "2026-10-24T14:15:00",
    status: "REVIEWED",
    description: "Caught using smartphone during Chemistry lab. Phone confiscated and handed over to reception."
  },
  {
    id: "3",
    studentName: "Rohit Verma",
    rollNo: "08",
    className: "Class 11 - Sci",
    reportedBy: "Prakash Iyer",
    category: "Safety",
    date: "2026-10-20T11:00:00",
    status: "SUSPENDED",
    description: "Involved in a physical altercation in the cafeteria. Broke school property."
  }
];

export default function AdminDisciplinePage() {
  const [selectedReport, setSelectedReport] = useState<DisciplineReport | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState<{show: boolean, type: "review" | "suspend"}>({show: false, type: "review"});

  const pendingCount = dummyReports.filter(r => r.status === "PENDING").length;

  const handleAction = (action: "review" | "suspend") => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedReport(null);
      setAdminNote("");
      setShowToast({ show: true, type: action });
      setTimeout(() => setShowToast({ show: false, type: "review" }), 4000);
    }, 1000);
  };

  const columns = [
    {
      header: "Student",
      accessorKey: "studentName",
      cell: (item: any) => (
        <div>
          <span className="font-medium text-text-primary block">{item.studentName}</span>
          <span className="text-xs text-text-muted">{item.className} • Roll: {item.rollNo}</span>
        </div>
      )
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item: any) => {
        const isUrgent = item.category === "Safety" || item.category === "Behavior";
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${
            isUrgent ? "bg-status-danger-bg text-status-danger-text border-status-danger/20" : "bg-status-warning-bg text-status-warning-text border-status-warning/20"
          }`}>
            {isUrgent && <AlertTriangle className="w-3 h-3" />}
            {item.category}
          </span>
        );
      }
    },
    {
      header: "Reported By",
      accessorKey: "reportedBy",
      cell: (item: any) => <span className="text-sm text-text-secondary">{item.reportedBy}</span>
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (item: any) => <span className="text-sm text-text-secondary">{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => {
        const styles = {
          PENDING: "bg-status-warning-bg text-status-warning-text",
          REVIEWED: "bg-status-success-bg text-status-success-text",
          SUSPENDED: "bg-status-danger text-white",
        }[item.status as string];
        return (
          <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${styles}`}>
            {item.status}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {showToast.show && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`border px-4 py-3 rounded-lg shadow-dropdown flex flex-col gap-1 ${
            showToast.type === "suspend" 
              ? "bg-status-danger border-status-danger-text text-white" 
              : "bg-status-success-bg border-status-success text-status-success-text"
          }`}>
            <div className="flex items-center gap-3">
              {showToast.type === "suspend" ? <Lock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              <p className="font-medium text-sm">
                {showToast.type === "suspend" ? "Student Suspended" : "Report Reviewed"}
              </p>
            </div>
            {showToast.type === "suspend" && (
              <p className="text-xs opacity-90 ml-8">Suspension chain activated. Attendance & portal access blocked.</p>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Discipline Center</h1>
          <p className="text-sm text-text-secondary mt-1">Review incident reports and manage suspensions</p>
        </div>
        
        {pendingCount > 0 && (
          <div className="bg-status-danger-bg border border-status-danger/20 text-status-danger-text px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">{pendingCount} Action{pendingCount !== 1 ? 's' : ''} Required</span>
          </div>
        )}
      </div>

      <DataTable
        data={dummyReports}
        columns={columns}
        searchPlaceholder="Search by student, teacher, or category..."
        emptyStateIcon={ShieldAlert}
        emptyStateTitle="No discipline records"
        emptyStateDesc="There are no incident reports to display."
        onView={(item) => setSelectedReport(item)}
      />

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className={`p-6 border-b flex items-center justify-between ${
              selectedReport.status === "SUSPENDED" ? "bg-status-danger/5 border-status-danger/20" : "border-border"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedReport.status === "SUSPENDED" ? "bg-status-danger/10 text-status-danger" : "bg-status-warning-bg text-status-warning-text"
                }`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-text-primary">Incident Review</h2>
                  <p className="text-sm text-text-secondary">Reported on {new Date(selectedReport.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-background rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-text-muted" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              {/* Student Info */}
              <div className="flex items-center justify-between bg-background p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-lg border border-primary/20">
                    {selectedReport.studentName.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-base">{selectedReport.studentName}</h3>
                    <p className="text-sm text-text-secondary">{selectedReport.className} • Roll {selectedReport.rollNo}</p>
                  </div>
                </div>
                {selectedReport.status === "SUSPENDED" && (
                  <div className="bg-status-danger text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Suspended
                  </div>
                )}
              </div>

              {/* Incident Details */}
              <div>
                <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Incident Details</h4>
                <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="grid grid-cols-2 divide-x divide-y divide-border">
                    <div className="p-3">
                      <p className="text-xs text-text-muted mb-1">Category</p>
                      <p className="text-sm font-medium text-text-primary">{selectedReport.category}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-text-muted mb-1">Reported By</p>
                      <p className="text-sm font-medium text-text-primary">{selectedReport.reportedBy}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-background/50 border-t border-border">
                    <p className="text-sm text-text-primary leading-relaxed">{selectedReport.description}</p>
                  </div>
                </div>
              </div>

              {/* Admin Action Form (only if pending) */}
              {selectedReport.status === "PENDING" && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Admin Action</h4>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter official remarks or action taken..."
                    rows={4}
                    className="w-full p-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none bg-surface"
                  />
                  
                  {/* Suspension Warning */}
                  <div className="mt-4 bg-status-danger-bg border border-status-danger/20 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-status-danger shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-status-danger-text">Suspension Action</h5>
                      <p className="text-xs text-status-danger-text/80 mt-1 leading-relaxed">
                        Issuing a suspension will automatically activate the <strong>Suspension Chain</strong>. The student will be blocked from the attendance system and their portal access will be restricted.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {selectedReport.status === "PENDING" && (
              <div className="p-6 border-t border-border bg-background flex items-center justify-between">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-6 py-2.5 text-text-secondary font-medium hover:bg-border/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAction("review")}
                    disabled={!adminNote || isProcessing}
                    className="flex items-center gap-2 bg-surface border border-border hover:bg-background text-text-primary px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => handleAction("suspend")}
                    disabled={!adminNote || isProcessing}
                    className="flex items-center gap-2 bg-status-danger hover:bg-status-danger/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {isProcessing ? "Processing..." : "Issue Suspension"}
                    {!isProcessing && <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
