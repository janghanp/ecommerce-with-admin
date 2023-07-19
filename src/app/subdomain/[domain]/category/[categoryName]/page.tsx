import { notFound } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import { getSubdomain } from "@/src/lib/utils";
import ProductList from "@/src/components/subdomain/product-list";
import Billboard from "@/src/components/subdomain/billboard";
import Filters from "@/src/components/subdomain/filters";
import MobileFilters from "@/src/components/subdomain/mobile-filter";

interface Props {
    params: { categoryName: string; domain: string };
    searchParams: {
        colorName: string;
        minPrice: string;
        maxPrice: string;
    };
}

const CategoryPage = async ({ params, searchParams }: Props) => {
    const { domain, categoryName } = params;
    const { colorName, minPrice, maxPrice } = searchParams;

    const subdomain = getSubdomain(domain);

    const category = await prisma.category.findFirst({
        where: {
            name: categoryName,
        },
        include: {
            billboard: true,
        },
    });

    const products = await prisma.product.findMany({
        where: {
            store: {
                name: subdomain as string,
            },
            category: {
                name: categoryName,
            },
            price: {
                gte: Number(minPrice) || undefined,
                lte: Number(maxPrice) || undefined,
            },
            color: {
                name: colorName,
            },
            isArchived: false,
        },
        include: {
            images: true,
            category: true,
        },
    });

    const colors = await prisma.color.findMany({
        where: {
            store: {
                name: subdomain as string,
            },
        },
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-y-5 p-2 md:gap-y-10 md:p-10">
            <Billboard billboard={category.billboard} />
            <MobileFilters colors={colors} />
            <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                <Filters colors={colors} />
                <div className="mt-6 lg:col-span-4 lg:mt-0">
                    <ProductList products={products} />
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
