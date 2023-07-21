import Link from "next/link";

import MainNav from "@/src/components/subdomain/main-nav";
import { Category } from "@prisma/client";
import CartButton from "@/src/components/subdomain/cart-button";
import ThemeToggleButton from "@/src/components/subdomain/theme-toggle-button";
import MobileSidebar from "@/src/components/subdomain/mobile-sidebar";

interface Props {
    categories: Category[];
}

const Header = ({ categories }: Props) => {
    return (
        <div className="border-b">
            <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <MobileSidebar categories={categories} />
                <Link href={`/`} className="ml-4 flex gap-x-2 lg:ml-0">
                    <p className="text-xl font-bold">STORE</p>
                </Link>
                <div className="flex w-full items-center justify-end md:ml-5 md:justify-between">
                    <MainNav data={categories} />
                    <div className="flex items-center gap-x-4">
                        <ThemeToggleButton />
                        <CartButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
