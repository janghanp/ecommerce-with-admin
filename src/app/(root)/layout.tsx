import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";

interface Props {
    children: React.ReactNode;
}

export default async function SetupLayout({ children }: Props) {
    const { userId } = auth();

    console.log(userId);

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prisma.store.findFirst({
        where: {
            userId,
        },
    });

    if (store) {
        redirect(`/${store.id}`);
    }

    return <>{children}</>;
}
