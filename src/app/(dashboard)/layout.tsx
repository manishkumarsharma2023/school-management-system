import Menu from "@/components/Menu";
import MobileMenu from "@/components/MobileMenu";
import { currentUser } from "@clerk/nextjs/server";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="hidden w-[14%] shrink-0 p-4 lg:block">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">SchooLama</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="min-w-0 flex-1 bg-[#F7F8FA] overflow-y-auto overflow-x-hidden flex flex-col">
        <Navbar mobileMenu={<MobileMenu role={role} />} />
        {children}
      </div>
    </div>
  );
}
