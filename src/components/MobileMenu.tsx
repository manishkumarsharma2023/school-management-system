"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const items = [
  ["/home.png", "Home", "/"],
  ["/teacher.png", "Coordinators", "/list/coordinators"],
  ["/teacher.png", "Teachers", "/list/teachers"],
  ["/student.png", "Students", "/list/students"],
  ["/parent.png", "Parents", "/list/parents"],
  ["/subject.png", "Subjects", "/list/subjects"],
  ["/class.png", "Classes", "/list/classes"],
  ["/lesson.png", "Lessons", "/list/lessons"],
  ["/exam.png", "Exams", "/list/exams"],
  ["/assignment.png", "Assignments", "/list/assignments"],
  ["/result.png", "Results", "/list/results"],
  ["/attendance.png", "Attendance", "/list/attendance"],
  ["/calendar.png", "Events", "/list/events"],
  ["/message.png", "Messages", "/messages"],
  ["/announcement.png", "Announcements", "/list/announcements"],
];

export default function MobileMenu({ role }: { role?: string }) {
  const [open, setOpen] = useState(false);
  const visible = new Set(
    role === "admin"
      ? items.map((item) => item[1])
      : role === "coordinator"
      ? ["Home", "Teachers", "Students", "Parents", "Subjects", "Classes", "Lessons", "Exams", "Assignments", "Results", "Attendance", "Events", "Messages", "Announcements"]
      : role === "teacher"
      ? ["Home", "Teachers", "Students", "Parents", "Classes", "Lessons", "Exams", "Assignments", "Results", "Attendance", "Events", "Messages", "Announcements"]
      : ["Home", "Exams", "Assignments", "Results", "Attendance", "Events", "Messages", "Announcements"]
  );

  return (
    <div className="lg:hidden">
      <button
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-200"
      >
        <span className="flex w-5 flex-col gap-1"><i className="block border-t-2 border-gray-600" /><i className="block border-t-2 border-gray-600" /><i className="block border-t-2 border-gray-600" /></span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="h-full w-[82%] max-w-[320px] overflow-y-auto bg-white p-5 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-bold">
                <Image src="/logo.png" alt="SchooLama" width={30} height={30} />
                SchooLama
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close navigation" className="text-2xl text-gray-500">×</button>
            </div>
            <nav className="flex flex-col gap-1">
              {items.filter((item) => visible.has(item[1])).map(([icon, label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-lamaSkyLight"
                >
                  <Image src={icon} alt="" width={20} height={20} />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="my-5 border-t" />
            <div className="flex flex-col gap-1">
              <Link href="/profile" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-50">Profile</Link>
              <Link href="/settings" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-50">Settings</Link>
              <Link href="/logout" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-red-500 hover:bg-red-50">Logout</Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
