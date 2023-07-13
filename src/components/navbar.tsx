"use client";

import { useParams, usePathname } from "next/navigation";
import { Home, Tag, AppWindow, Palette, ReceiptIcon, Package, Settings } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/src/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

const Navbar = () => {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: "Overview",
            isActive: pathname === `/${params.storeId}`,
            icon: <Home className="h-4 w-4" />,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: "Billboards",
            isActive: pathname === `/${params.storeId}/billboards`,
            icon: <AppWindow className="h-4 w-4" />,
        },
        {
            href: `/${params.storeId}/categories`,
            label: "Categories",
            isActive: pathname === `/${params.storeId}/categories`,
            icon: <Tag className="h-4 w-4" />,
        },
        {
            href: `/${params.storeId}/colors`,
            label: "Colors",
            isActive: pathname === `/${params.storeId}/colors`,
            icon: <Palette className="h-4 w-4" />,
        },
        {
            href: `/${params.storeId}/products`,
            label: "Products",
            isActive: pathname === `/${params.storeId}/products`,
            icon: <Package className="h-4 w-4" />,
        },
        {
            href: `/${params.storeId}/orders`,
            label: "Orders",
            isActive: pathname === `/${params.storeId}/orders`,
            icon: <ReceiptIcon className="h-4 w-4" />,
        },
        {
            href: `/${params.storeId}/settings`,
            label: "Settings",
            isActive: pathname === `/${params.storeId}/settings`,
            icon: <Settings className="h-4 w-4" />,
        },
    ];
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-y-8 py-6">
            {routes.map((route) => (
                <TooltipProvider key={route.label}>
                    <Tooltip>
                        <TooltipTrigger asChild={true}>
                            <Link
                                href={route.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    route.isActive
                                        ? "text-black dark:text-white"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Button variant="outline" size="icon">
                                    {route.icon}
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{route.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
};

export default Navbar;
