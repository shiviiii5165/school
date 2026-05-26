"use client";

import { useState } from "react";
import DataTable from "@/components/shared/DataTable";
import { Users, Plus, Filter, MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

// Dummy data for now
const dummyStudents = [
  {
    id: "1",
    name: "Rahul Kumar",
    avatar: "https://i.pravatar.cc/150?u=1",
    regId: "STU-2024-0042",
    classInfo: "10-A",
    rollNo: "15",
    attendance: 92,
    feeStatus: "PAID",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Priya Sharma",
    avatar: "",
    regId: "STU-2024-0043",
    classInfo: "10-A",
    rollNo: "16",
    attendance: 74,
    feeStatus: "PENDING",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Aman Singh",
    avatar: "https://i.pravatar.cc/150?u=3",
    regId: "STU-2024-0044",
    classInfo: "9-C",
    rollNo: "02",
    attendance: 45,
    feeStatus: "OVERDUE",
    status: "SUSPENDED",
  },
];

export default function StudentsPage() {
  const columns = [
    {
      header: "Student",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center overflow-hidden flex-shrink-0">
            {item.avatar ? (
              <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-medium text-text-secondary text-xs">{item.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="font-medium text-text-primary">{item.name}</div>
        </div>
      ),
    },
    {
      header: "Reg ID",
      accessorKey: "regId",
      cell: (item: any) => <span className="font-mono text-text-secondary text-xs">{item.regId}</span>
    },
    {
      header: "Class",
      accessorKey: "classInfo",
    },
    {
      header: "Roll No",
      accessorKey: "rollNo",
      cell: (item: any) => <span className="font-mono text-text-secondary">{item.rollNo}</span>
    },
    {
      header: "Attendance",
      accessorKey: "attendance",
      cell: (item: any) => {
        const val = item.attendance;
        let color = "bg-status-success-bg text-status-success-text";
        if (val < 75) color = "bg-status-danger-bg text-status-danger-text";
        else if (val < 90) color = "bg-status-warning-bg text-status-warning-text";
        
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
            {val}%
          </span>
        );
      }
    },
    {
      header: "Fee Status",
      accessorKey: "feeStatus",
      cell: (item: any) => {
        let color = "bg-background text-text-secondary border border-border";
        if (item.feeStatus === "PAID") color = "bg-status-success-bg text-status-success-text border border-status-success/20";
        if (item.feeStatus === "PENDING") color = "bg-status-warning-bg text-status-warning-text border border-status-warning/20";
        if (item.feeStatus === "OVERDUE") color = "bg-status-danger-bg text-status-danger-text border border-status-danger/20";
        
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wide ${color}`}>
            {item.feeStatus}
          </span>
        );
      }
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => {
        const isSuspended = item.status === "SUSPENDED";
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wide ${
            isSuspended ? "bg-status-danger-bg text-status-danger-text" : "bg-status-success-bg text-status-success-text"
          }`}>
            {item.status}
          </span>
        );
      }
    },
  ];

  const renderCustomRow = (item: any, rowContent: React.ReactNode) => {
    // We would need to pass a custom row renderer to DataTable, but for now we can't easily 
    // inject the red border without modifying DataTable. Wait, DataTable maps through columns.
    // I will just use the standard DataTable for now. 
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-text-primary">Students</h1>
          <span className="bg-primary-light text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {dummyStudents.length} total
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-border bg-surface hover:bg-background text-text-primary px-4 py-2 rounded-md font-medium text-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={dummyStudents}
        columns={columns}
        searchPlaceholder="Search students by name, reg ID..."
        emptyStateIcon={Users}
        emptyStateTitle="No students found"
        emptyStateDesc="Add your first student or try adjusting your search filters."
        onEdit={(item) => console.log("Edit", item)}
        onView={(item) => console.log("View", item)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
