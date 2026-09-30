import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function ProfilePage() {
  const user = await currentUser();
  return (
    <main className="p-4 md:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {user?.imageUrl ? <Image src={user.imageUrl} alt="Profile" width={80} height={80} className="rounded-full" /> : <div className="grid h-20 w-20 place-items-center rounded-full bg-lamaSkyLight text-2xl">👤</div>}
          <div><h1 className="text-2xl font-semibold">{user?.firstName || user?.username || "User"} {user?.lastName || ""}</h1><p className="text-sm text-gray-400">{String(user?.publicMetadata?.role || "User").toUpperCase()}</p></div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4"><p className="text-xs text-gray-400">Username</p><p className="mt-1 font-medium">{user?.username || "—"}</p></div>
          <div className="rounded-lg bg-gray-50 p-4"><p className="text-xs text-gray-400">Email</p><p className="mt-1 font-medium break-all">{user?.primaryEmailAddress?.emailAddress || "—"}</p></div>
        </div>
      </div>
    </main>
  );
}
