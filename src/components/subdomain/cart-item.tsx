"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash } from "lucide-react";

import { Prisma, Size } from "@prisma/client";
import { useCart } from "@/src/store";
import { Button } from "@/src/components/ui/button";
import { formatter } from "@/src/lib/utils";

type ProductWithImagesAndSizes = Prisma.ProductGetPayload<{
    include: {
        images: true;
        sizes: true;
    };
}>;

interface Props {
    item: { product: ProductWithImagesAndSizes; selectedSize: Size; quantity: number };
}

const CartItem = ({ item }: Props) => {
    const removeItemInCart = useCart((state) => state.removeItem);
    const updateItemInCart = useCart((state) => state.updateItem);

    const [selectedSize, _setSelectedSize] = useState<Size>(item.selectedSize);
    const [quantity, setQuantity] = useState(item.quantity);

    useEffect(() => {
        if (selectedSize) {
            updateItemInCart(item.product.id, selectedSize!, quantity);
        }
    }, [selectedSize, quantity, updateItemInCart, item.product.id]);

    return (
        <li className="flex border-b py-6">
            <div className="relative h-[100px] w-[100px] overflow-hidden rounded-md">
                <Image
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={item.product.images[0].url}
                    alt="image"
                    className="object-cover object-center"
                />
            </div>
            <div className="flex flex-1 flex-col items-start justify-between px-5">
                <span className="text-xl font-semibold">{item.product.name}</span>
                <div className="flex items-center">
                    <span>size:&nbsp;</span>
                    <span>{item.selectedSize.name}</span>
                </div>
                <div className="flex items-center gap-x-5">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                            if (quantity > 1) {
                                setQuantity((prev) => prev - 1);
                            }
                        }}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <div className="font-semibold">{quantity}</div>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setQuantity((prev) => prev + 1)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-center justify-between">
                <Button
                    onClick={() => removeItemInCart(item.product.id)}
                    variant="outline"
                    size="icon"
                >
                    <Trash size={15} className="text-red-500" />
                </Button>
                <span className="font-medium">
                    {formatter.format(item.product.price * quantity)}
                </span>
            </div>
        </li>
    );
};

export default CartItem;
