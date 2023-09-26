import { notFound } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import Gallery from "@/src/components/subdomain/gallery";
import Info from "@/src/components/subdomain/info";
import ProductList from "@/src/components/subdomain/product-list";

interface Props {
  params: { productId: string };
}

const ProductPage = async ({ params }: Props) => {
  const { productId } = params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
      sizes: {
        where: {
          quantity: {
            gt: 0,
          },
        },
      },
      color: true,
    },
  });

  if (!product) {
    notFound();
  }

  const suggestedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
    },
    include: {
      images: true,
      category: true,
    },
  });

  return (
    <div className="">
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Gallery images={product.images} />
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <Info product={product} />
          </div>
        </div>
        <hr className="my-10" />
        <ProductList title="Related Items" products={suggestedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
