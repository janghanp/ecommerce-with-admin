import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import StoreSwitcher from "@/src/components/store-switcher";
import { ThemeToggle } from "@/src/components/theme-toggle";
import MobileSidebar from "@/src/components/mobile-sidebar";

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
        <div className="relative border-b">
            <MobileSidebar stores={stores} />
            <div className="flex h-14 items-center px-4">
                <div className="hidden md:block">
                    <StoreSwitcher items={stores} />
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
};

export default Header;
