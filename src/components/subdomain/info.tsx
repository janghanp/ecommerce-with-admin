"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/src/store";
import { Prisma, Size } from "@prisma/client";
import { formatter } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import SizeSelect from "@/src/components/subdomain/size-select";

type ProductWithSizesAndColorsAndImages = Prisma.ProductGetPayload<{
  include: {
    sizes: true;
    color: true;
    images: true;
  };
}>;

interface Props {
  product: ProductWithSizesAndColorsAndImages;
}

const Info = ({ product }: Props) => {
  const addItemToCart = useCart((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]);

  const changeHandler = (e: Size) => {
    setSelectedSize(e);
  };

  const stock = product.sizes.map((size) => size.quantity).reduce((acc, curr) => acc + curr, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl">{formatter.format(product.price)}</span>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          {stock > 0 ? (
            <>
              <h3 className="font-semibold">Size:</h3>
              <SizeSelect
                sizes={product.sizes}
                changeHandler={changeHandler}
                defaultValue={product.sizes[0]}
              />
            </>
          ) : (
            <div className="font-medium text-red-500">Out of stock</div>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold">Color:</h3>
          <div
            className="h-6 w-6 rounded-full border border-gray-600"
            style={{ backgroundColor: product.color.value }}
          />
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        {stock > 0 && (
          <Button variant="secondary" onClick={() => addItemToCart(product, selectedSize)}>
            <ShoppingCart className="mr-3" />
            <span>Add To Cart</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Info;
