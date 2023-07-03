import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import Navbar from "@/src/components/navbar";

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
            <Navbar />
            {children}
        </>
    );
}
