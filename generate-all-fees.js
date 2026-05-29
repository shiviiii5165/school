const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Generating fee records for all students...");
  const students = await prisma.student.findMany();
  
  for (const student of students) {
    // Check if they already have fees
    const existing = await prisma.feeRecord.count({ where: { studentId: student.id } });
    if (existing > 0) continue;

    // Create Invoices
    const invoices = [
      { studentId: student.id, feeType: 'Tuition', amount: 18000, dueDate: new Date('2026-04-01'), status: 'OVERDUE' },
      { studentId: student.id, feeType: 'Tuition', amount: 18000, dueDate: new Date('2026-07-01'), status: 'PENDING' },
      { studentId: student.id, feeType: 'Computer', amount: 2000, dueDate: new Date('2026-04-01'), status: 'PENDING' },
      { studentId: student.id, feeType: 'Library', amount: 1000, dueDate: new Date('2026-04-01'), status: 'PENDING' }
    ];

    if (student.hasTransport) {
      invoices.push({ studentId: student.id, feeType: 'Transport', amount: 10500, dueDate: new Date('2026-04-01'), status: 'PENDING' });
    }

    await prisma.feeRecord.createMany({ data: invoices });
  }

  console.log("Done! Generated fees for " + students.length + " students.");
}

run().catch(console.error).finally(() => prisma.$disconnect());
