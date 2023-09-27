import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { prisma } from "@/src/lib/prisma";
import Navbar from "@/src/components/navbar";
import MobileSidebar from "@/src/components/mobile-sidebar";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const stores = await prisma.store.findMany({
    where: {
      userId: session.user.id,
    },
  });

  if (stores.length === 0) {
    redirect("/");
  }

  return (
    <>
      <div className="flex">
        <MobileSidebar stores={stores} />
        <div className="sticky top-0 hidden h-screen w-52 border-r md:block">
          <Navbar stores={stores} />
        </div>
        <div className="flex w-full flex-1 flex-col overflow-x-hidden">{children}</div>
      </div>
    </>
  );
}
