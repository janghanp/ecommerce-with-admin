"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

// import { Product, Size } from "@/types";
// import Button from "@/src/components/button";
// import { useCart } from "@/store";
// import SizeSelectBox from "@/components/size-select-box";
// import { SingleValue } from "react-select";
import { useCart } from "@/src/store";
import { Product, Prisma } from "@prisma/client";
import { Size } from "@/src/type";

type ProductWithSizes = Prisma.ProductGetPayload<{
    include: {
        sizes: true;
    };
}>;

interface Props {
    product: ProductWithSizes;
}

const Info = ({ product }: Props) => {
    const addItemToCart = useCart((state) => state.addItem);

    // const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]);

    // const changeHandler = (e: SingleValue<{ value: Size; label: string }>) => {
    //     setSelectedSize(e!.value);
    // };

    const options = product.sizes.map((size) => {
        return {
            value: size,
            label: size.name,
        };
    });

    return (
        <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-3 flex items-end justify-between">
                <span className="text-2xl">{/*<Currency value={product?.price} />*/}</span>
            </div>
            <hr className="my-4" />
            <div className="flex flex-col gap-y-6">
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold">Size:</h3>
                    {/*<SizeSelectBox*/}
                    {/*    options={options}*/}
                    {/*    selectedSize={selectedSize}*/}
                    {/*    changeHandler={changeHandler}*/}
                    {/*/>*/}
                </div>
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold">Color:</h3>
                    {/*<div*/}
                    {/*    className="h-6 w-6 rounded-full border border-gray-600"*/}
                    {/*    style={{ backgroundColor: product?.color.value }}*/}
                    {/*/>*/}
                </div>
            </div>
            <div className="mt-10 flex items-center gap-x-3">
                {/*<Button*/}
                {/*    className="flex items-center gap-x-2"*/}
                {/*    onClick={() => {*/}
                {/*        addItemToCart(product, selectedSize!);*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Add To Cart*/}
                {/*    <ShoppingCart />*/}
                {/*</Button>*/}
            </div>
        </div>
    );
};

export default Info;
