import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import StoreSwitcher from "@/src/components/store-switcher";
import { ThemeToggle } from "@/src/components/theme-toggle";

const Header = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in;");
    }

    const stores = await prisma.store.findMany({
        where: {
            userId,
        },
    });

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores} />
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
};

export default Header;
