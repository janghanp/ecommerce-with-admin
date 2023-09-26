"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Home, Tag, AppWindow, Palette, ReceiptIcon, Package, Settings } from "lucide-react";

import { useMobileSidebar } from "@/src/store";
import { cn } from "@/src/lib/utils";

const NavList = () => {
  const pathname = usePathname();
  const params = useParams();

  const { isOpen, toggle } = useMobileSidebar();

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

  return (
    <>
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
    </>
  );
};

export default NavList;
