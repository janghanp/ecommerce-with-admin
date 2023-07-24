"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/src/store";
import CartItem from "@/src/components/subdomain/cart-item";
import Summary from "@/src/components/subdomain/summary";

const CartPage = () => {
    const cartItems = useCart((state) => state.items);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <></>;
    }

    return (
        <div className="h-screen">
            <div className="px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-7">
                        {cartItems.length === 0 && (
                            <p className="text-neutral-500">No items added to cart.</p>
                        )}
                        <ul>
                            {cartItems.map((item) => (
                                <CartItem key={item.product.id} item={item} />
                            ))}
                        </ul>
                    </div>
                    <Summary />
                </div>
            </div>
        </div>
    );
};

export default CartPage;
