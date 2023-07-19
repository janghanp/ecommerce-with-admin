import { notFound } from "next/navigation";

import Footer from "@/src/components/subdomain/footer";
import Header from "@/src/components/subdomain/header";
import { prisma } from "@/src/lib/prisma";
import { getSubdomain } from "@/src/lib/utils";

interface Props {
    children: React.ReactNode;
    params: { domain: string };
}

export async function generateMetadata({ params }: { params: { domain: string } }) {
    const subdomain = getSubdomain(params.domain);

    return {
        title: subdomain,
        description: "",
    };
}

const Layout = async ({ children, params }: Props) => {
    const subdomain = getSubdomain(params.domain);

    const store = await prisma.store.findUnique({
        where: {
            name: subdomain as string,
        },
    });

    if (!store) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        where: {
            store: {
                name: subdomain as string,
            },
        },
    });

    return (
        <>
            <Header categories={categories} />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
