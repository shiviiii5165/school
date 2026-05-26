import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.teacher.findFirst({
    include: { user: true }
  });
  
  if (!teacher) {
    console.log("No teacher found");
    return;
  }
  
  console.log("Found teacher:", teacher.id);
  
  const student = await prisma.student.findFirst();
  
  if (!student) {
    console.log("No student found");
    return;
  }
  
  console.log("Found student:", student.id);
  
  try {
    const report = await prisma.disciplineReport.create({
      data: {
        studentId: student.id,
        reportedBy: teacher.id,
        category: "Safety",
        description: "Test report description",
        status: "PENDING",
      },
    });
    console.log("Created report:", report.id);
    
    // Notifications part
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    const notifications = admins.map((admin) => ({
      userId: admin.id,
      title: "New Discipline Report",
      message: `A new discipline report has been submitted for category: Safety.`,
      type: "DISCIPLINE",
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
      console.log("Created notifications");
    }
  } catch (err) {
    console.error("Error creating report:", err);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
