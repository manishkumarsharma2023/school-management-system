import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function AttendancePage() {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const where = role === "student" ? { studentId: userId! } : role === "parent" ? { student: { parentId: userId! } } : {};
  const records = await prisma.attendance.findMany({
    where,
    take: 30,
    orderBy: { date: "desc" },
    include: { student: { select: { name: true, surname: true } }, lesson: { select: { name: true } } },
  });
  const present = records.filter((r) => r.present).length;
  const rate = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <main className="p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-2xl font-semibold">Attendance</h1><p className="mt-1 text-sm text-gray-400">Recent attendance records and overall rate.</p></div>
        <div className="rounded-xl bg-white px-5 py-3 shadow-sm ring-1 ring-gray-100"><span className="text-xs text-gray-400">Recent rate</span><div className="text-2xl font-bold">{rate}%</div></div>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-400"><tr><th className="p-4">Student</th><th>Lesson</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{records.length ? records.map((r) => <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50"><td className="p-4 font-medium">{r.student.name} {r.student.surname}</td><td>{r.lesson.name}</td><td>{new Intl.DateTimeFormat("en-US").format(r.date)}</td><td><span className={`rounded-full px-3 py-1 text-xs font-medium ${r.present ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{r.present ? "Present" : "Absent"}</span></td></tr>) : <tr><td colSpan={4} className="p-8 text-center text-gray-400">No attendance records found.</td></tr>}</tbody>
        </table>
      </div>
    </main>
  );
}
