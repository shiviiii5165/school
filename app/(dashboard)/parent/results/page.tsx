"use client";

import { useState } from "react";
import {
  Award, TrendingUp, TrendingDown, BookOpen, ChevronDown,
  Download, Users, BarChart3, Star, GraduationCap
} from "lucide-react";

interface Child {
  id: string;
  name: string;
  class: string;
  rollNo: string;
  avatar: string;
}

interface SubjectResult {
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
  classAvg: number;
  teacher: string;
}

interface ExamResult {
  examType: string;
  date: string;
  subjects: SubjectResult[];
}

const children: Child[] = [
  { id: "1", name: "Rahul Kumar", class: "Class 10 - A", rollNo: "01", avatar: "" },
  { id: "2", name: "Neha Kumar", class: "Class 7 - B", rollNo: "15", avatar: "" },
];

const childResults: Record<string, ExamResult[]> = {
  "1": [
    {
      examType: "Mid Term Examination",
      date: "2026-03-15",
      subjects: [
        { subject: "Mathematics", marks: 45, maxMarks: 50, grade: "A+", classAvg: 35, teacher: "Rajesh Singh" },
        { subject: "English", marks: 38, maxMarks: 50, grade: "A", classAvg: 32, teacher: "Anita Desai" },
        { subject: "Chemistry", marks: 42, maxMarks: 50, grade: "A", classAvg: 30, teacher: "Vikram Malhotra" },
        { subject: "Computer Science", marks: 48, maxMarks: 50, grade: "A+", classAvg: 38, teacher: "Meera Nair" },
        { subject: "History", marks: 35, maxMarks: 50, grade: "B+", classAvg: 29, teacher: "Suresh Pillai" },
        { subject: "Physics", marks: 40, maxMarks: 50, grade: "A", classAvg: 33, teacher: "Ravi Sharma" },
      ],
    },
  ],
  "2": [
    {
      examType: "Mid Term Examination",
      date: "2026-03-15",
      subjects: [
        { subject: "Mathematics", marks: 40, maxMarks: 50, grade: "A", classAvg: 32, teacher: "Sunita Roy" },
        { subject: "English", marks: 43, maxMarks: 50, grade: "A+", classAvg: 35, teacher: "Anita Desai" },
        { subject: "Science", marks: 38, maxMarks: 50, grade: "A", classAvg: 28, teacher: "Prakash Iyer" },
        { subject: "Hindi", marks: 35, maxMarks: 50, grade: "B+", classAvg: 30, teacher: "Kamla Devi" },
        { subject: "Social Studies", marks: 42, maxMarks: 50, grade: "A", classAvg: 31, teacher: "Deepak Joshi" },
      ],
    },
  ],
};

const gradeColors: Record<string, { bg: string; text: string }> = {
  "A+": { bg: "bg-status-success", text: "text-white" },
  "A": { bg: "bg-status-success/80", text: "text-white" },
  "B+": { bg: "bg-primary", text: "text-white" },
  "B": { bg: "bg-primary/80", text: "text-white" },
  "C": { bg: "bg-status-warning", text: "text-white" },
  "D": { bg: "bg-status-warning/70", text: "text-white" },
  "F": { bg: "bg-status-danger", text: "text-white" },
};

export default function ParentResultsPage() {
  const [selectedChild, setSelectedChild] = useState(children[0]);
  const [selectedExam, setSelectedExam] = useState(0);

  const results = childResults[selectedChild.id] || [];
  const exam = results[selectedExam];

  const totalMarks = exam ? exam.subjects.reduce((a, s) => a + s.marks, 0) : 0;
  const totalMaxMarks = exam ? exam.subjects.reduce((a, s) => a + s.maxMarks, 0) : 0;
  const overallPercent = totalMaxMarks > 0 ? Math.round((totalMarks / totalMaxMarks) * 100) : 0;
  const overallGrade = overallPercent >= 90 ? "A+" : overallPercent >= 80 ? "A" : overallPercent >= 70 ? "B+" : overallPercent >= 60 ? "B" : overallPercent >= 50 ? "C" : overallPercent >= 40 ? "D" : "F";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Report Cards</h1>
        <p className="text-sm text-text-secondary mt-1">Track your children&apos;s academic performance</p>
      </div>

      {/* Child Selector */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => { setSelectedChild(child); setSelectedExam(0); }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all whitespace-nowrap min-w-fit ${
              selectedChild.id === child.id
                ? "border-role-parent bg-role-parent/5 shadow-card"
                : "border-border bg-surface hover:border-border-strong"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
              selectedChild.id === child.id
                ? "bg-role-parent text-white"
                : "bg-background text-text-secondary"
            }`}>
              {child.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-left">
              <p className={`text-sm font-semibold ${
                selectedChild.id === child.id ? "text-role-parent" : "text-text-primary"
              }`}>{child.name}</p>
              <p className="text-xs text-text-muted">{child.class} • Roll {child.rollNo}</p>
            </div>
          </button>
        ))}
      </div>

      {exam ? (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(Number(e.target.value))}
                className="border border-border rounded-md px-4 py-2 bg-surface text-text-primary text-sm focus:outline-none focus:border-primary font-medium"
              >
                {results.map((ex, i) => (
                  <option key={i} value={i}>{ex.examType}</option>
                ))}
              </select>
              <span className="text-sm text-text-muted">
                {new Date(exam.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <button className="flex items-center gap-2 border border-border bg-surface hover:bg-background text-text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>

          {/* Score Overview */}
          <div className="bg-gradient-to-br from-role-parent to-emerald-700 rounded-2xl p-6 text-white shadow-dropdown relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-white/70" />
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                    {selectedChild.name}&apos;s {exam.examType}
                  </p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-display font-bold">{overallPercent}%</span>
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/20">
                    Grade {overallGrade}
                  </span>
                </div>
                <p className="text-white/80 text-sm mt-2">
                  {totalMarks} out of {totalMaxMarks} marks • {exam.subjects.length} subjects
                </p>
              </div>

              {/* Overall Grade Circle */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-3xl font-display font-bold">{overallGrade}</p>
                    <p className="text-xs text-white/70 font-medium">Overall</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exam.subjects.map((subject, idx) => {
              const pct = Math.round((subject.marks / subject.maxMarks) * 100);
              const classAvgPct = Math.round((subject.classAvg / subject.maxMarks) * 100);
              const diff = pct - classAvgPct;
              const gc = gradeColors[subject.grade] || gradeColors["F"];

              return (
                <div
                  key={idx}
                  className="bg-surface border border-border rounded-xl shadow-card p-5 hover:shadow-dropdown transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-text-primary">{subject.subject}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{subject.teacher}</p>
                    </div>
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold ${gc.bg} ${gc.text}`}>
                      {subject.grade}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold text-text-primary font-mono">{subject.marks}</span>
                    <span className="text-text-muted text-sm">/ {subject.maxMarks}</span>
                    <span className="ml-auto text-sm font-semibold text-text-primary">{pct}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-background rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct >= 80 ? "bg-status-success" : pct >= 60 ? "bg-primary" : pct >= 40 ? "bg-status-warning" : "bg-status-danger"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* vs Class Average */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Class Avg: {subject.classAvg}/{subject.maxMarks}</span>
                    <span className={`flex items-center gap-1 font-semibold ${
                      diff > 0 ? "text-status-success-text" : diff < 0 ? "text-status-danger-text" : "text-text-muted"
                    }`}>
                      {diff > 0 ? <TrendingUp className="w-3 h-3" /> : diff < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                      {diff > 0 ? "+" : ""}{diff}% vs class
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <Award className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-1">No results available</h3>
          <p className="text-sm text-text-secondary">Results for this child haven&apos;t been published yet.</p>
        </div>
      )}
    </div>
  );
}
