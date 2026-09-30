"use client";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export default function LogoutPage() { const router = useRouter(); return <main className="grid min-h-[70vh] place-items-center p-4"><div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100"><h1 className="text-xl font-semibold">Sign out?</h1><p className="my-3 text-sm text-gray-500">You can sign in again anytime.</p><SignOutButton redirectUrl="/sign-in"><button className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700">Logout</button></SignOutButton><button onClick={() => router.back()} className="ml-2 rounded-lg border px-5 py-2 text-sm">Cancel</button></div></main>; }
