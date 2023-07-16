import { NextResponse } from "next/server";

import { stripe } from "@/src/lib/stripe";
import { prisma } from "@/src/lib/prisma";
import { Size } from "@prisma/client";
import { Prisma } from "@prisma/client";

type ProductWithImages = Prisma.ProductGetPayload<{
    include: { images: true };
}>;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    const {
        cartItems,
    }: { cartItems: { product: ProductWithImages; selectedSize: Size; quantity: number }[] } =
        await req.json();

    if (!cartItems || cartItems.length === 0) {
        return new NextResponse("Cart items are required", { status: 400 });
    }

    const order = await prisma.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                create: cartItems.map((cartItem) => ({
                    product: {
                        connect: {
                            id: cartItem.product.id,
                        },
                    },
                    size: cartItem.selectedSize.name,
                    quantity: cartItem.quantity,
                })),
            },
        },
    });

    const session = await stripe.checkout.sessions.create({
        line_items: cartItems.map((cartItem) => {
            return {
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: cartItem.product.name,
                        images: cartItem.product.images.map((image) => image.url),
                        metadata: {
                            id: cartItem.product.id,
                        },
                    },
                    unit_amount: Number(cartItem.product.price) * 100,
                },
                quantity: cartItem.quantity,
            };
        }),
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.STORE_URL}/${params.storeId}/cart?success=1`,
        cancel_url: `${process.env.STORE_URL}/${params.storeId}/cart?canceled=1`,
        metadata: {
            orderId: order.id,
        },
    });

    //Update order with session information?

    return NextResponse.json(
        { url: session.url },
        {
            headers: corsHeaders,
        }
    );
}
