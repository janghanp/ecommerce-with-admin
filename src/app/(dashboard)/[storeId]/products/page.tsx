import { prisma } from "@/src/lib/prisma";
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

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-2 pt-10 md:p-8">
        <ProductClient products={products} />
      </div>
    </div>
  );
};

export default ProductsPage;
