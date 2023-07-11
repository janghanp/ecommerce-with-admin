"use client";

import { useParams, usePathname } from "next/navigation";
import {
    Home,
    Tag,
    AppWindow,
    Palette,
    ReceiptIcon,
    Package,
    Settings,
    Scaling,
} from "lucide-react";

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
            icon: <Home className="w-4 h-4" />,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: "Billboards",
            isActive: pathname === `/${params.storeId}/billboards`,
            icon: <AppWindow className="w-4 h-4" />,
        },
        {
            href: `/${params.storeId}/categories`,
            label: "Categories",
            isActive: pathname === `/${params.storeId}/categories`,
            icon: <Tag className="w-4 h-4" />,
        },
        {
            href: `/${params.storeId}/sizes`,
            label: "Sizes",
            isActive: pathname === `/${params.storeId}/sizes`,
            icon: <Scaling className="w-4 h-4" />,
        },
        {
            href: `/${params.storeId}/colors`,
            label: "Colors",
            isActive: pathname === `/${params.storeId}/colors`,
            icon: <Palette className="w-4 h-4" />,
        },
        {
            href: `/${params.storeId}/products`,
            label: "Products",
            isActive: pathname === `/${params.storeId}/products`,
            icon: <Package className="w-4 h-4" />,
        },
        {
            href: `/${params.storeId}/orders`,
            label: "Orders",
            isActive: pathname === `/${params.storeId}/orders`,
            icon: <ReceiptIcon className="w-4 h-4" />,
        },
        {
            href: `/${params.storeId}/settings`,
            label: "Settings",
            isActive: pathname === `/${params.storeId}/settings`,
            icon: <Settings className="w-4 h-4" />,
        },
    ];
    return (
        <div className="flex flex-col items-center justify-center py-6 h-full gap-y-8">
            {routes.map((route) => (
                <TooltipProvider key={route.href}>
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
