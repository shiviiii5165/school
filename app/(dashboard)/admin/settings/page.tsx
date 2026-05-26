"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Building2, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  IndianRupee, 
  Bell, 
  Lock, 
  Globe,
  Save,
  Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";

// Define the tabs for the settings page
const SETTINGS_TABS = [
  { id: "profile", label: "School Profile", icon: Building2 },
  { id: "academic", label: "Academic Settings", icon: GraduationCap },
  { id: "attendance", label: "Attendance Policies", icon: Clock },
  { id: "roles", label: "User Roles & Permissions", icon: ShieldCheck },
  { id: "fees", label: "Fee Configuration", icon: IndianRupee },
  { id: "notifications", label: "Notification Settings", icon: Bell },
  { id: "security", label: "Security Settings", icon: Lock },
  { id: "preferences", label: "System Preferences", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    }
  });

  // Setup form with fetched data
  const { register, handleSubmit, formState: { isDirty, isSubmitting } } = useForm({
    values: settings || {},
  });

  // Update mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  });

  const onSubmit = (data: any) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">System Settings</h1>
          <p className="text-sm text-text-secondary mt-1">Manage global configuration for the ERP system</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty || isSubmitting || updateSettingsMutation.isPending}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(isSubmitting || updateSettingsMutation.isPending) ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-status-success-bg border border-status-success text-status-success-text px-4 py-3 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span>Settings saved successfully! System behavior updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 bg-surface border border-border rounded-xl p-2 space-y-1 h-fit">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-background hover:text-text-primary"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-primary" : "text-text-muted"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-xl p-6 shadow-sm">
          <form id="settings-form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* School Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">School Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">School Name</label>
                    <input
                      {...register("schoolName")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g. EduCore International School"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Official Email</label>
                    <input
                      {...register("schoolEmail")}
                      type="email"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Contact Phone</label>
                    <input
                      {...register("schoolPhone")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Academic Settings Tab */}
            {activeTab === "academic" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Academic Settings</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Grading System</label>
                    <select
                      {...register("gradingSystem")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="GPA">GPA (4.0 Scale)</option>
                      <option value="LETTER">Letter Grades (A, B, C)</option>
                    </select>
                    <p className="text-xs text-text-muted mt-1">This setting affects how report cards are generated.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Policies Tab */}
            {activeTab === "attendance" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Attendance Policies</h2>
                
                <div className="p-4 bg-status-warning-bg border border-status-warning rounded-lg mb-6">
                  <p className="text-sm text-status-warning-text font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Changes here strictly enforce student exam eligibility and system warnings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Global Attendance Tracking</label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        {...register("attendanceEnabled")}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text-secondary">Enable daily attendance module</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Target Attendance (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      {...register("minimumAttendance")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-text-muted mt-1">Used for general warnings.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-status-danger">Detention Threshold (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      {...register("detentionThreshold")}
                      className="w-full px-4 py-2 border border-status-danger/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-status-danger"
                    />
                    <p className="text-xs text-status-danger mt-1">Students below this % will be flagged for detention.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {["roles", "fees", "notifications", "security", "preferences"].includes(activeTab) && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2 capitalize">
                  {activeTab} Configuration
                </h2>
                <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                  <p className="text-text-secondary">This section is available in the extended enterprise license.</p>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
