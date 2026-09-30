const messages = [
  ["School Office", "Welcome to the new school management dashboard.", "Today"],
  ["Academic Team", "Please review the upcoming examination schedule.", "Yesterday"],
  ["Class Teacher", "Attendance has been updated for this week.", "2 days ago"],
];
export default function MessagesPage() { return <main className="p-4 md:p-6"><div className="mx-auto max-w-3xl"><h1 className="text-2xl font-semibold">Messages</h1><p className="mb-5 mt-1 text-sm text-gray-400">Your latest school communication.</p><div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">{messages.map(([from, body, time]) => <div key={from} className="border-b p-5 last:border-0 hover:bg-gray-50"><div className="flex items-center justify-between gap-3"><p className="font-medium">{from}</p><span className="text-xs text-gray-400">{time}</span></div><p className="mt-1 text-sm text-gray-500">{body}</p></div>)}</div></div></main>; }
