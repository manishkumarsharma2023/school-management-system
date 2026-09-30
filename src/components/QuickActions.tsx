import Link from "next/link";

const actions = [
  { label: "Manage Students", href: "/list/students", icon: "👨‍🎓" },
  { label: "Manage Teachers", href: "/list/teachers", icon: "👩‍🏫" },
  { label: "View Classes", href: "/list/classes", icon: "🏫" },
  { label: "View Exams", href: "/list/exams", icon: "📝" },
];

export default function QuickActions() {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4">
        <h2 className="font-semibold text-gray-800">Quick Actions</h2>
        <p className="text-xs text-gray-400">Jump directly to the most-used sections</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="rounded-lg border p-3 transition hover:-translate-y-0.5 hover:bg-gray-50">
            <div className="text-xl">{action.icon}</div>
            <div className="mt-2 text-xs font-medium text-gray-600">{action.label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
