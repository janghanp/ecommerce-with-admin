"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { useCart } from "@/src/store";
import { Button } from "@/src/components/ui/button";
import { formatter } from "@/src/lib/utils";

const Summary = () => {
    const searchParams = useSearchParams();

    const cartItems = useCart((state) => state.items);
    const emptyCart = useCart((state) => state.emptyCart);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Payment completed.");
            emptyCart();
        }

        if (searchParams.get("canceled")) {
            toast.error("Something went wrong...");
        }
    }, [emptyCart, searchParams]);

    const checkoutHandler = async () => {
        try {
            setIsLoading(true);

            const host = window.location.host;
            const subdomain = host.split(".")[0];

            const response = await axios.post(
                `https://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/checkout`,
                {
                    cartItems,
                    subdomain,
                }
            );

            window.location = response.data.url;
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => {
        return total + Number(item.product.price) * item.quantity;
    }, 0);

    return (
        <div className="mt-16 rounded-lg px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="mt-6 space-y-4 ">
                <div className="flex items-center justify-between border-t pt-4">
                    <span className="font-medium">Order total :</span>
                    <span className="font-medium">{formatter.format(totalPrice)}</span>
                </div>
            </div>
            <Button
                variant="secondary"
                className="mt-5 w-full"
                disabled={cartItems.length === 0 || isLoading}
                onClick={checkoutHandler}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Checkout
            </Button>
        </div>
    );
};

export default Summary;
