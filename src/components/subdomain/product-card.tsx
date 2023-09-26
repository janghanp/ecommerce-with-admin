"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Prisma } from "@prisma/client";
import { formatter } from "@/src/lib/utils";

type ProductWithImagesAndCategory = Prisma.ProductGetPayload<{
  include: {
    images: true;
    category: true;
  };
}>;

interface Props {
  product: ProductWithImagesAndCategory;
}

const ProductCard = ({ product }: Props) => {
  const router = useRouter();

  const clickHandler = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      className="group cursor-pointer space-y-4 rounded-xl border p-3 transition duration-200 hover:shadow-lg"
      onClick={clickHandler}
    >
      <div className="relative aspect-square rounded-xl bg-gray-100">
        <Image
          alt="image"
          src={product.images?.[0].url}
          fill
          className="aspect-square rounded-md object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div>
        <p className="text-lg font-semibold">{product.name}</p>
        <p className="text-sm text-gray-500">{product.category?.name}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-semibold">{formatter.format(Number(product.price))}</div>
      </div>
    </div>
  );
};

export default ProductCard;
