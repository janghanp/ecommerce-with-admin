import { Prisma } from "@prisma/client";

import NoResults from "@/src/components/subdomain/no-results";
import ProductCard from "@/src/components/subdomain/ProductCard";

type ProductWithImagesAndCategory = Prisma.ProductGetPayload<{
    include: {
        images: true;
        category: true;
    };
}>;

interface Props {
    title: string;
    products: ProductWithImagesAndCategory[];
}

const ProductList = ({ title, products }: Props) => {
    return (
        <div className="space-y-4">
            <h3 className="text-3xl font-bold">{title}</h3>
            {products.length === 0 && <NoResults />}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
