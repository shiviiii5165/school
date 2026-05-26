"use client";

import NoticeBoard, { Notice } from "@/components/shared/NoticeBoard";

const dummyNotices: Notice[] = [
  {
    id: "1",
    title: "Annual Sports Day 2026",
    content: "The Annual Sports Day will be held on 15th November. All students are requested to submit their participation forms to their respective class teachers by 5th November.",
    category: "Event",
    date: "2026-10-25",
    isPinned: true,
  },
  {
    id: "2",
    title: "Revision Classes Schedule",
    content: "Special revision classes for Class 10 will begin from next Monday. The schedule has been updated on the student portal.",
    category: "Academic",
    date: "2026-10-24",
    isNew: true,
  },
  {
    id: "3",
    title: "Change in School Timings",
    content: "Due to the onset of winter, school timings will change from 8:00 AM - 2:00 PM to 8:30 AM - 2:30 PM effective from 1st November.",
    category: "Urgent",
    date: "2026-10-20",
  },
  {
    id: "4",
    title: "Library Book Return",
    content: "All students are reminded to return any overdue library books before the term ends to avoid late fees.",
    category: "General",
    date: "2026-10-18",
  },
];

export default function StudentNoticesPage() {
  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="shrink-0">
        <h1 className="text-2xl font-display font-bold text-text-primary">Notice Board</h1>
        <p className="text-sm text-text-secondary mt-1">Stay updated with the latest school announcements</p>
      </div>

      <div className="flex-1 min-h-0">
        <NoticeBoard notices={dummyNotices} />
      </div>
    </div>
  );
}
