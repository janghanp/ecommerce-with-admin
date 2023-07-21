"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/src/lib/utils";
import { Category } from "@prisma/client";

interface Props {
    data: Category[];
}

const MainNav = ({ data }: Props) => {
    const pathname = usePathname();

    const routes = data.map((route) => ({
        href: `/category/${route.name}`,
        label: route.name,
        isActive: pathname === `/category/${route.name}`,
    }));

    return (
        <nav className="mx-6 hidden items-center space-x-4 md:flex lg:space-x-6">
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors",
                        route.isActive ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    );
};

export default MainNav;
