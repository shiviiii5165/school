"use client";

import { useState } from "react";
import {
  Award, TrendingUp, TrendingDown, BookOpen, ChevronDown,
  Download, Printer, Trophy, Star, Target, BarChart3
} from "lucide-react";

interface SubjectResult {
  id: string;
  subject: string;
  code: string;
  marks: number;
  maxMarks: number;
  grade: string;
  teacher: string;
  classAvg: number;
}

interface ExamResult {
  examType: string;
  date: string;
  subjects: SubjectResult[];
}

const examResults: ExamResult[] = [
  {
    examType: "Mid Term Examination",
    date: "2026-03-15",
    subjects: [
      { id: "1", subject: "Mathematics", code: "MAT", marks: 45, maxMarks: 50, grade: "A+", teacher: "Rajesh Singh", classAvg: 35 },
      { id: "2", subject: "English", code: "ENG", marks: 38, maxMarks: 50, grade: "A", teacher: "Anita Desai", classAvg: 32 },
      { id: "3", subject: "Chemistry", code: "CHE", marks: 42, maxMarks: 50, grade: "A", teacher: "Vikram Malhotra", classAvg: 30 },
      { id: "4", subject: "Computer Science", code: "CS", marks: 48, maxMarks: 50, grade: "A+", teacher: "Meera Nair", classAvg: 38 },
      { id: "5", subject: "History", code: "HIS", marks: 35, maxMarks: 50, grade: "B+", teacher: "Suresh Pillai", classAvg: 29 },
      { id: "6", subject: "Physics", code: "PHY", marks: 40, maxMarks: 50, grade: "A", teacher: "Ravi Sharma", classAvg: 33 },
    ],
  },
  {
    examType: "Unit Test 1",
    date: "2026-02-01",
    subjects: [
      { id: "7", subject: "Mathematics", code: "MAT", marks: 22, maxMarks: 25, grade: "A+", teacher: "Rajesh Singh", classAvg: 17 },
      { id: "8", subject: "English", code: "ENG", marks: 18, maxMarks: 25, grade: "B+", teacher: "Anita Desai", classAvg: 16 },
      { id: "9", subject: "Chemistry", code: "CHE", marks: 20, maxMarks: 25, grade: "A", teacher: "Vikram Malhotra", classAvg: 15 },
      { id: "10", subject: "Computer Science", code: "CS", marks: 24, maxMarks: 25, grade: "A+", teacher: "Meera Nair", classAvg: 19 },
      { id: "11", subject: "History", code: "HIS", marks: 15, maxMarks: 25, grade: "C", teacher: "Suresh Pillai", classAvg: 14 },
      { id: "12", subject: "Physics", code: "PHY", marks: 21, maxMarks: 25, grade: "A", teacher: "Ravi Sharma", classAvg: 16 },
    ],
  },
];

const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
  "A+": { bg: "bg-status-success", text: "text-white", border: "border-status-success" },
  "A": { bg: "bg-status-success/80", text: "text-white", border: "border-status-success/80" },
  "B+": { bg: "bg-primary", text: "text-white", border: "border-primary" },
  "B": { bg: "bg-primary/80", text: "text-white", border: "border-primary/80" },
  "C": { bg: "bg-status-warning", text: "text-white", border: "border-status-warning" },
  "D": { bg: "bg-status-warning/70", text: "text-white", border: "border-status-warning/70" },
  "F": { bg: "bg-status-danger", text: "text-white", border: "border-status-danger" },
};

export default function StudentResultsPage() {
  const [selectedExam, setSelectedExam] = useState(0);
  const exam = examResults[selectedExam];

  const totalMarks = exam.subjects.reduce((acc, s) => acc + s.marks, 0);
  const totalMaxMarks = exam.subjects.reduce((acc, s) => acc + s.maxMarks, 0);
  const overallPercent = Math.round((totalMarks / totalMaxMarks) * 100);
  const highestSubject = exam.subjects.reduce((a, b) => (a.marks / a.maxMarks) > (b.marks / b.maxMarks) ? a : b);
  const lowestSubject = exam.subjects.reduce((a, b) => (a.marks / a.maxMarks) < (b.marks / b.maxMarks) ? a : b);

  const overallGrade = overallPercent >= 90 ? "A+" : overallPercent >= 80 ? "A" : overallPercent >= 70 ? "B+" : overallPercent >= 60 ? "B" : overallPercent >= 50 ? "C" : overallPercent >= 40 ? "D" : "F";
  const gc = gradeColors[overallGrade] || gradeColors["F"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">My Results</h1>
          <p className="text-sm text-text-secondary mt-1">View your grades, report cards, and performance trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(Number(e.target.value))}
            className="border border-border rounded-md px-4 py-2 bg-surface text-text-primary text-sm focus:outline-none focus:border-primary font-medium"
          >
            {examResults.map((ex, i) => (
              <option key={i} value={i}>{ex.examType}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 border border-border bg-surface hover:bg-background text-text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-dropdown relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">{exam.examType}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-display font-bold">{overallPercent}%</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${gc.bg === "bg-status-success" ? "bg-white/20" : "bg-white/20"}`}>
                  Grade {overallGrade}
                </span>
              </div>
              <p className="text-white/80 text-sm mt-2">
                {totalMarks} out of {totalMaxMarks} marks • {exam.subjects.length} subjects
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[130px]">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-white/70" />
                  <p className="text-xs text-white/70 font-medium">Best Subject</p>
                </div>
                <p className="font-bold text-lg">{highestSubject.subject}</p>
                <p className="text-sm text-white/70">{Math.round((highestSubject.marks / highestSubject.maxMarks) * 100)}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[130px]">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-white/70" />
                  <p className="text-xs text-white/70 font-medium">Needs Work</p>
                </div>
                <p className="font-bold text-lg">{lowestSubject.subject}</p>
                <p className="text-sm text-white/70">{Math.round((lowestSubject.marks / lowestSubject.maxMarks) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Results */}
      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Subject-wise Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-text-muted text-xs uppercase border-b border-border">
              <tr>
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium text-center">Marks</th>
                <th className="px-5 py-3 font-medium text-center">Grade</th>
                <th className="px-5 py-3 font-medium">Performance</th>
                <th className="px-5 py-3 font-medium text-center">Class Avg</th>
                <th className="px-5 py-3 font-medium text-center">vs Class</th>
              </tr>
            </thead>
            <tbody>
              {exam.subjects.map((subject, idx) => {
                const pct = Math.round((subject.marks / subject.maxMarks) * 100);
                const classAvgPct = Math.round((subject.classAvg / subject.maxMarks) * 100);
                const diff = pct - classAvgPct;
                const gc = gradeColors[subject.grade] || gradeColors["F"];

                return (
                  <tr
                    key={subject.id}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-background/60 ${
                      idx % 2 === 0 ? "" : "bg-background/30"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-medium text-text-primary">{subject.subject}</span>
                        <p className="text-xs text-text-muted mt-0.5">{subject.teacher}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-mono font-bold text-text-primary text-base">{subject.marks}</span>
                      <span className="text-text-muted text-xs">/{subject.maxMarks}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold ${gc.bg} ${gc.text}`}>
                        {subject.grade}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <div className="flex-1">
                          <div className="w-full bg-background rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                pct >= 80 ? "bg-status-success" : pct >= 60 ? "bg-primary" : pct >= 40 ? "bg-status-warning" : "bg-status-danger"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-text-primary w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-mono text-text-secondary">{subject.classAvg}/{subject.maxMarks}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                        diff > 0 ? "text-status-success-text" : diff < 0 ? "text-status-danger-text" : "text-text-muted"
                      }`}>
                        {diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : diff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                        {diff > 0 ? "+" : ""}{diff}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Total Row */}
        <div className="bg-background border-t-2 border-border px-5 py-4 flex items-center justify-between">
          <span className="font-semibold text-text-primary">Total</span>
          <div className="flex items-center gap-8">
            <span className="font-mono font-bold text-lg text-text-primary">{totalMarks}<span className="text-text-muted text-sm">/{totalMaxMarks}</span></span>
            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold ${gradeColors[overallGrade]?.bg} ${gradeColors[overallGrade]?.text}`}>
              {overallGrade}
            </span>
            <span className="font-bold text-text-primary text-lg">{overallPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
