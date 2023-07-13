import { format } from "date-fns";
import { prisma } from "@/src/lib/prisma";
import { ProductColumn } from "@/src/components/columns";
import { formatter } from "@/src/lib/utils";
import ProductClient from "@/src/components/product-client";

interface Props {
    params: { storeId: string };
}

const ProductsPage = async ({ params }: Props) => {
    const products = await prisma.product.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            sizes: true,
            category: true,
            color: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    products.forEach((product) => {
        console.log(product.sizes);
    });

    const formattedProducts: ProductColumn[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        price: formatter.format(product.price.toNumber()),
        category: product.category.name,
        sizes: product.sizes.map((size) => size.name),
        quantities: product.sizes.map((size) => size.quantity),
        color: product.color.value,
        createdAt: format(product.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient products={formattedProducts} />
            </div>
        </div>
    );
};

export default ProductsPage;
