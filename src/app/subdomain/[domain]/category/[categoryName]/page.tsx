import { prisma } from "@/src/lib/prisma";
import { getSubdomain } from "@/src/lib/utils";
import ProductList from "@/src/components/subdomain/ProductList";
import Billboard from "@/src/components/subdomain/billboard";
import { notFound } from "next/navigation";

interface Props {
    params: { categoryName: string; domain: string };
    // searchParams: {
    //   colorName: string;
    //   minPrice: string;
    //   maxPrice: string;
    // };
}

const CategoryPage = async ({ params }: Props) => {
    const { domain, categoryName } = params;

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
        },
        include: {
            images: true,
            category: true,
        },
    });

    if (!category || !products) {
        notFound();
    }

    return (
        <div>
            <Billboard billboard={category.billboard} />
            <ProductList title={categoryName} products={products} />
        </div>
    );
};

export default CategoryPage;
