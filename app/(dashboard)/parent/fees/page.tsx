"use client";

import { useState } from "react";
import { IndianRupee, Download, CreditCard, Receipt, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface FeeRecord {
  id: string;
  studentName: string;
  amount: number;
  feeType: string;
  dueDate: string;
  status: "PAID" | "PENDING" | "OVERDUE";
  paidDate?: string;
  receiptNo?: string;
}

const dummyFees: FeeRecord[] = [
  {
    id: "1",
    studentName: "Rahul Kumar",
    amount: 4500,
    feeType: "Tuition Fee - Term 1",
    dueDate: "2026-06-10",
    status: "PENDING",
  },
  {
    id: "2",
    studentName: "Rahul Kumar",
    amount: 1500,
    feeType: "Transport Fee - May",
    dueDate: "2026-05-15",
    status: "OVERDUE",
  },
  {
    id: "3",
    studentName: "Neha Kumar",
    amount: 4500,
    feeType: "Tuition Fee - Term 1",
    dueDate: "2026-06-10",
    status: "PAID",
    paidDate: "2026-05-20",
    receiptNo: "RCPT-2026-089",
  },
];

export default function ParentFeesPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "paid">("pending");
  
  const pendingFees = dummyFees.filter(f => f.status !== "PAID");
  const paidFees = dummyFees.filter(f => f.status === "PAID");
  
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Fee Details</h1>
          <p className="text-sm text-text-secondary mt-1">View dues, make payments, and download receipts</p>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-role-parent to-emerald-700 rounded-2xl p-6 text-white shadow-dropdown flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Total Outstanding</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold">₹{totalPending.toLocaleString('en-IN')}</span>
            <span className="text-sm text-white/80">{pendingFees.length} invoices pending</span>
          </div>
        </div>
        <div className="relative z-10 shrink-0">
          <button 
            disabled={totalPending === 0}
            className="w-full md:w-auto bg-white text-role-parent hover:bg-background px-6 py-3 rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Pay Full Amount
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1.5 shadow-card w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "pending"
              ? "bg-role-parent text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-background"
          }`}
        >
          Pending & Overdue
          <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "pending" ? "bg-white/20" : "bg-status-warning-bg text-status-warning-text"}`}>
            {pendingFees.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("paid")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "paid"
              ? "bg-role-parent text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-background"
          }`}
        >
          Payment History
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {(activeTab === "pending" ? pendingFees : paidFees).map((fee) => (
          <div key={fee.id} className="bg-surface border border-border rounded-xl shadow-card p-5 hover:shadow-dropdown transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                fee.status === "PAID" ? "bg-status-success-bg text-status-success" :
                fee.status === "OVERDUE" ? "bg-status-danger-bg text-status-danger" :
                "bg-status-warning-bg text-status-warning"
              }`}>
                {fee.status === "PAID" ? <CheckCircle2 className="w-6 h-6" /> :
                 fee.status === "OVERDUE" ? <AlertCircle className="w-6 h-6" /> :
                 <Clock className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-text-primary text-base">{fee.feeType}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    fee.status === "PAID" ? "bg-status-success-bg text-status-success-text" :
                    fee.status === "OVERDUE" ? "bg-status-danger-bg text-status-danger-text" :
                    "bg-status-warning-bg text-status-warning-text"
                  }`}>
                    {fee.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-2">For: <span className="font-medium text-text-primary">{fee.studentName}</span></p>
                
                {fee.status === "PAID" ? (
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Paid on {new Date(fee.paidDate!).toLocaleDateString('en-IN')}</span>
                    <span className="flex items-center gap-1"><Receipt className="w-3.5 h-3.5" /> Ref: {fee.receiptNo}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="text-text-muted">Due Date:</span>
                    <span className={fee.status === "OVERDUE" ? "text-status-danger-text" : "text-text-primary"}>
                      {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:gap-2 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-border">
              <span className="text-xl font-bold font-mono text-text-primary">₹{fee.amount.toLocaleString('en-IN')}</span>
              {fee.status === "PAID" ? (
                <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  <Download className="w-4 h-4" /> Receipt
                </button>
              ) : (
                <button className="flex items-center gap-2 bg-text-primary hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
        
        {(activeTab === "pending" ? pendingFees : paidFees).length === 0 && (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-status-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {activeTab === "pending" ? "All caught up!" : "No payment history"}
            </h3>
            <p className="text-sm text-text-secondary">
              {activeTab === "pending" ? "There are no pending fee dues for your children." : "No paid invoices found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
