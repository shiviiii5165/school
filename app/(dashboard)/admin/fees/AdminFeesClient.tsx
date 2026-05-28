"use client";

import { useState } from "react";
import DataTable from "@/components/shared/DataTable";
import { IndianRupee, Plus, Filter, Download } from "lucide-react";

interface AdminFeesClientProps {
  data: any[];
  stats: {
    totalCollection: number;
    pendingDues: number;
    overdue: number;
  };
}

export default function AdminFeesClient({ data, stats }: AdminFeesClientProps) {
  const columns = [
    {
      header: "Student Name",
      accessorKey: "studentName",
      cell: (item: any) => (
        <div>
          <span className="font-medium text-text-primary block">{item.studentName}</span>
          <span className="text-xs text-text-muted">Roll: {item.rollNo}</span>
        </div>
      )
    },
    {
      header: "Class",
      accessorKey: "className",
      cell: (item: any) => <span className="text-sm text-text-secondary">{item.className}</span>
    },
    {
      header: "Fee Type",
      accessorKey: "feeType",
      cell: (item: any) => <span className="text-sm text-text-secondary">{item.feeType}</span>
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (item: any) => <span className="font-mono text-text-primary">₹{item.amount.toLocaleString('en-IN')}</span>
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: (item: any) => <span className="text-sm text-text-secondary">{new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => {
        const styles = {
          PAID: "bg-status-success-bg text-status-success-text border-status-success/20",
          PENDING: "bg-status-warning-bg text-status-warning-text border-status-warning/20",
          OVERDUE: "bg-status-danger-bg text-status-danger-text border-status-danger/20",
        }[item.status as string];
        return (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles}`}>
            {item.status}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Fee Management</h1>
          <p className="text-sm text-text-secondary mt-1">Track collections, dues, and payment history</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-border bg-surface hover:bg-background text-text-primary px-4 py-2 rounded-md font-medium text-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 border border-border bg-surface hover:bg-background text-text-primary px-4 py-2 rounded-md font-medium text-sm transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-border shadow-card">
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Total Collection</p>
          <p className="text-2xl font-bold text-text-primary mt-1">₹{stats.totalCollection.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-status-warning-bg p-4 rounded-xl border border-status-warning/20">
          <p className="text-xs text-status-warning-text font-medium uppercase tracking-wider">Pending Dues</p>
          <p className="text-2xl font-bold text-status-warning-text mt-1">₹{stats.pendingDues.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-status-danger-bg p-4 rounded-xl border border-status-danger/20">
          <p className="text-xs text-status-danger-text font-medium uppercase tracking-wider">Overdue</p>
          <p className="text-2xl font-bold text-status-danger-text mt-1">₹{stats.overdue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchPlaceholder="Search by student, roll no, or fee type..."
        emptyStateIcon={IndianRupee}
        emptyStateTitle="No fee records found"
        emptyStateDesc="Create a new invoice to start tracking fees."
        onEdit={(item) => console.log("Edit", item)}
        onView={(item) => console.log("View", item)}
      />
    </div>
  );
}
