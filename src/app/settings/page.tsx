"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [compact, setCompact] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => setCompact(localStorage.getItem("schoolama-compact") === "1"), []);
  const toggle = () => {
    const next = !compact;
    setCompact(next);
    localStorage.setItem("schoolama-compact", next ? "1" : "0");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  return <main className="p-4 md:p-6"><div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"><h1 className="text-2xl font-semibold">Settings</h1><p className="mt-1 text-sm text-gray-400">Personalize your dashboard experience.</p><div className="mt-8 flex items-center justify-between gap-4 rounded-xl border p-4"><div><p className="font-medium">Compact dashboard spacing</p><p className="text-xs text-gray-400">Reduce spacing on cards and lists for smaller screens.</p></div><button onClick={toggle} className={`h-7 w-12 rounded-full p-1 transition ${compact ? "bg-blue-500" : "bg-gray-300"}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${compact ? "translate-x-5" : "translate-x-0"}`} /></button></div>{saved && <p className="mt-3 text-xs text-green-600">Settings saved on this device.</p>}</div></main>;
}
