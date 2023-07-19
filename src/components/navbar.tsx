import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { Store } from "@prisma/client";

import { ThemeToggle } from "@/src/components/theme-toggle";
import { PopoverTrigger } from "@/src/components/ui/popover";
import StoreSwitcher from "@/src/components/store-switcher";
import { Separator } from "@/src/components/ui/separator";
import NavList from "@/src/components/nav-list";
import UserInfo from "@/src/components/user-info";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface Props extends PopoverTriggerProps {
    stores: Store[];
}

const Navbar = async ({ stores }: Props) => {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="flex h-screen flex-col items-start justify-between px-2 py-5">
            <div className="flex w-full flex-col gap-y-3">
                <div className="mb-5">
                    <StoreSwitcher stores={stores} />
                </div>
                <NavList />
            </div>
            <div className="flex w-full flex-col items-center justify-center">
                <ThemeToggle />
                <Separator className="my-3" />
                {/*<UserInfo firstName={user.firstName!} />*/}
            </div>
        </div>
    );
};

export default Navbar;
