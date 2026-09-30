import DashboardLayout from "@/app/(dashboard)/layout";
import UserCard from "@/components/UserCard";
import QuickActions from "@/components/QuickActions";
import Announcements from "@/components/Announcements";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import Link from "next/link";

export default function CoordinatorPage() {
  return <DashboardLayout>
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        <div className="flex gap-4 flex-wrap">
          <UserCard type="teacher" />
          <UserCard type="student" />
          <UserCard type="parent" />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-100">
          <h1 className="text-xl font-semibold mb-2">Coordinator Dashboard</h1>
          <p className="text-sm text-gray-500 mb-5">Manage academic operations, classes, subjects, staff, students and school communication.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Teachers", "/list/teachers"], ["Students", "/list/students"], ["Parents", "/list/parents"], ["Subjects", "/list/subjects"],
              ["Classes", "/list/classes"], ["Lessons", "/list/lessons"], ["Exams", "/list/exams"], ["Assignments", "/list/assignments"],
              ["Results", "/list/results"], ["Attendance", "/list/attendance"], ["Events", "/list/events"], ["Announcements", "/list/announcements"]
            ].map(([label, href]) => <Link key={href} href={href} className="rounded-lg bg-slate-50 p-3 text-sm font-medium hover:bg-blue-50">{label}</Link>)}
          </div>
        </div>
        <QuickActions />
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <EventCalendarContainer searchParams={{}} />
        <Announcements />
      </div>
    </div>
  </DashboardLayout>;
}
