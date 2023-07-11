import ProductForm from "@/src/components/product-form";
import { prisma } from "@/src/lib/prisma";

interface Props {
    params: { productId: string; storeId: string };
}

const ProductPage = async ({ params }: Props) => {
    const product = await prisma.product.findUnique({
        where: {
            id: params.productId,
        },
        include: {
            images: true,
        },
    });

    const categories = await prisma.category.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const sizes = await prisma.size.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const colors = await prisma.color.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    initialData={JSON.parse(JSON.stringify(product))}
                    categories={categories}
                    sizes={sizes}
                    colors={colors}
                />
            </div>
        </div>
    );
};

export default ProductPage;
