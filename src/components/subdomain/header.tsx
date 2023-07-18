import Link from "next/link";

import MainNav from "@/src/components/subdomain/main-nav";
import { Category } from "@prisma/client";

interface Props {
    categories: Category[];
}

const Header = ({ categories }: Props) => {
    return (
        <div className="border-b">
            <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <Link href={`/`} className="ml-4 flex gap-x-2 lg:ml-0">
                    <p className="text-xl font-bold">STORE</p>
                </Link>
                <MainNav data={categories} />
                {/*<NavbarActions />*/}
            </div>
        </div>
    );
};

export default Header;
