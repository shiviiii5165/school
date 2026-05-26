"use client";

import DataTable from "@/components/shared/DataTable";
import { UserCog, Plus, Filter } from "lucide-react";

// Dummy data for now
const dummyTeachers = [
  {
    id: "1",
    name: "Rajesh Singh",
    avatar: "https://i.pravatar.cc/150?u=4",
    regId: "TCH-2020-001",
    subjects: ["Mathematics", "Physics"],
    classes: ["10-A", "10-B", "11-Sci"],
    joinDate: "15 Jun 2020",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Anita Desai",
    avatar: "",
    regId: "TCH-2021-014",
    subjects: ["English", "History"],
    classes: ["9-C", "10-A"],
    joinDate: "02 Mar 2021",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Vikram Malhotra",
    avatar: "https://i.pravatar.cc/150?u=5",
    regId: "TCH-2019-042",
    subjects: ["Chemistry", "Biology"],
    classes: ["11-Sci", "12-Sci"],
    joinDate: "10 Aug 2019",
    status: "ON LEAVE",
  },
];

export default function TeachersPage() {
  const columns = [
    {
      header: "Teacher",
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
      header: "Employee ID",
      accessorKey: "regId",
      cell: (item: any) => <span className="font-mono text-text-secondary text-xs">{item.regId}</span>
    },
    {
      header: "Subjects",
      accessorKey: "subjects",
      cell: (item: any) => (
        <div className="flex flex-wrap gap-1">
          {item.subjects.map((sub: string, i: number) => (
            <span key={i} className="bg-background border border-border text-text-secondary text-[11px] px-2 py-0.5 rounded-full">
              {sub}
            </span>
          ))}
        </div>
      )
    },
    {
      header: "Classes",
      accessorKey: "classes",
      cell: (item: any) => (
        <span className="text-sm text-text-secondary">{item.classes.join(", ")}</span>
      )
    },
    {
      header: "Join Date",
      accessorKey: "joinDate",
      cell: (item: any) => <span className="text-text-secondary text-sm">{item.joinDate}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => {
        let color = "bg-status-success-bg text-status-success-text";
        if (item.status === "ON LEAVE") color = "bg-status-warning-bg text-status-warning-text";
        
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wide ${color}`}>
            {item.status}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-text-primary">Teachers</h1>
          <span className="bg-role-teacher/10 text-role-teacher text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {dummyTeachers.length} total
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-border bg-surface hover:bg-background text-text-primary px-4 py-2 rounded-md font-medium text-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>
      </div>

      <DataTable
        data={dummyTeachers}
        columns={columns}
        searchPlaceholder="Search teachers by name, ID, subject..."
        emptyStateIcon={UserCog}
        emptyStateTitle="No teachers found"
        emptyStateDesc="Add your first teacher or try adjusting your search filters."
        onEdit={(item) => console.log("Edit", item)}
        onView={(item) => console.log("View", item)}
      />
    </div>
  );
}
