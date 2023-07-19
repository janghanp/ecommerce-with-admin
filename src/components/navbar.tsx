"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
    Home,
    Tag,
    AppWindow,
    Palette,
    ReceiptIcon,
    Package,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { Store } from "@prisma/client";

import { cn } from "@/src/lib/utils";
import { useMobileSidebar } from "../store";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { PopoverTrigger } from "@/src/components/ui/popover";
import StoreSwitcher from "@/src/components/store-switcher";
import { Separator } from "@/src/components/ui/separator";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface Props extends PopoverTriggerProps {
    stores: Store[];
}

const Navbar = ({ stores }: Props) => {
    const pathname = usePathname();
    const params = useParams();

    const user = useUser();
    const auth = useAuth();

    const { isOpen, toggle } = useMobileSidebar();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const routes = [
        {
            href: `/${params.storeId}`,
            label: "Overview",
            isActive: pathname === `/${params.storeId}`,
            icon: <Home className="h-5 w-5" />,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: "Billboards",
            isActive: pathname === `/${params.storeId}/billboards`,
            icon: <AppWindow className="h-5 w-5" />,
        },
        {
            href: `/${params.storeId}/categories`,
            label: "Categories",
            isActive: pathname === `/${params.storeId}/categories`,
            icon: <Tag className="h-5 w-5" />,
        },
        {
            href: `/${params.storeId}/colors`,
            label: "Colors",
            isActive: pathname === `/${params.storeId}/colors`,
            icon: <Palette className="h-5 w-5" />,
        },
        {
            href: `/${params.storeId}/products`,
            label: "Products",
            isActive: pathname === `/${params.storeId}/products`,
            icon: <Package className="h-5 w-5" />,
        },
        {
            href: `/${params.storeId}/orders`,
            label: "Orders",
            isActive: pathname === `/${params.storeId}/orders`,
            icon: <ReceiptIcon className="h-5 w-5" />,
        },
        {
            href: `/${params.storeId}/settings`,
            label: "Settings",
            isActive: pathname === `/${params.storeId}/settings`,
            icon: <Settings className="h-5 w-5" />,
        },
    ];

    if (!isClient) {
        return;
    }

    return (
        <div className="flex h-screen flex-col items-start justify-between px-2 py-5">
            <div className="flex w-full flex-col gap-y-3">
                <div className="mb-5">
                    <StoreSwitcher stores={stores} />
                </div>
                {routes.map((route) => (
                    <Link
                        key={route.label}
                        href={route.href}
                        onClick={() => {
                            if (isOpen) {
                                toggle(false);
                            }
                        }}
                        className={cn(
                            "w-full rounded-md p-2 text-sm font-medium transition duration-200 hover:bg-gray-200",
                            route.isActive ? "text-black dark:text-white" : "text-muted-foreground"
                        )}
                    >
                        <div className="flex items-center gap-x-4">
                            {route.icon}
                            <span>{route.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flex w-full flex-col items-center justify-center">
                <ThemeToggle />
                <Separator className="my-3" />
                <div className="ml-auto flex w-full items-center space-x-4">
                    <div className="flex w-full items-center justify-between gap-x-2 p-2 py-1">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm font-medium">{user.user?.firstName}</span>
                        <div
                            className="rounded-md p-2 transition duration-200 hover:cursor-pointer hover:bg-gray-200"
                            onClick={() => auth.signOut()}
                        >
                            <LogOut className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
