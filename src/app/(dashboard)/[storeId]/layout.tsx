import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import Header from "@/src/components/header";
import Navbar from "@/src/components/navbar";
import MobileSidebar from "@/src/components/mobile-sidebar";

interface Props {
    children: React.ReactNode;
    params: { storeId: string };
}

export default async function DashboardLayout({ children, params }: Props) {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prisma.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        },
    });

    if (!store) {
        redirect("/");
    }

    return (
        <>
            <div className="flex">
                <div className="sticky top-0 hidden h-screen w-52 border-r md:block">
                    <Navbar />
                </div>
                <div className="flex w-full flex-1 flex-col overflow-x-hidden">
                    <Header />
                    {children}
                </div>
            </div>
        </>
    );
}
