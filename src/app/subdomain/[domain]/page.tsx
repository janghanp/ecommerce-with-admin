import { prisma } from "@/src/lib/prisma";
import { getSubdomain } from "@/src/lib/utils";
import Billboard from "@/src/components/subdomain/billboard";
import ProductList from "@/src/components/subdomain/product-list";

interface Props {
    params: { domain: string };
}

const Page = async ({ params }: Props) => {
    const subdomain = getSubdomain(params.domain);

    const billboard = await prisma.billboard.findFirst({
        where: {
            store: {
                name: subdomain as string,
            },
        },
    });

    const products = await prisma.product.findMany({
        where: {
            store: {
                name: subdomain as string,
            },
        },
        include: {
            images: true,
            category: true,
        },
    });

    return (
        <div>
            <Billboard billboard={billboard!} />
            <ProductList title="Featured Products" products={products} />
        </div>
    );
};

export default Page;
