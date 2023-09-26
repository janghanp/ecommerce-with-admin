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
      sizes: true,
    },
  });

  const categories = await prisma.category.findMany({
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
    <div className="flex items-center justify-center p-4 pt-10 md:p-8">
      <ProductForm
        initialData={JSON.parse(JSON.stringify(product))}
        categories={categories}
        colors={colors}
      />
    </div>
  );
};

export default ProductPage;
