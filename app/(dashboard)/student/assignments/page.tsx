import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StudentAssignmentsClient, { StudentAssignment } from "./StudentAssignmentsClient";

export default async function StudentAssignmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let studentId = session.user.id;
  let student = await prisma.student.findUnique({ where: { userId: studentId } });
  
  if (!student) {
    student = await prisma.student.findFirst();
  }

  if (!student) {
    return <div>No student profile found.</div>;
  }

  const assignments = await prisma.assignment.findMany({
    where: { classId: student.classId },
    include: {
      subject: {
        include: {
          teacher: {
            include: { user: true }
          }
        }
      },
      submissions: {
        where: { studentId: student.id }
      }
    },
    orderBy: { dueDate: 'asc' }
  });

  const formattedAssignments: StudentAssignment[] = assignments.map(a => {
    const submission = a.submissions[0];
    
    return {
      id: a.id,
      title: a.title,
      subject: a.subject.name,
      teacher: a.subject.teacher?.user?.name || "Unknown Teacher",
      dueDate: a.dueDate.toISOString(),
      maxMarks: a.maxMarks,
      description: a.description || "",
      submission: submission ? {
        submittedAt: submission.submittedAt.toISOString(),
        marks: submission.marks ?? undefined,
        feedback: submission.feedback ?? undefined,
        gradedAt: submission.gradedAt?.toISOString()
      } : undefined
    };
  });

  return <StudentAssignmentsClient initialAssignments={formattedAssignments} />;
}
