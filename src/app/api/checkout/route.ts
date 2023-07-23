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

export async function POST(req: Request) {
    const {
        cartItems,
        subdomain,
    }: {
        cartItems: { product: ProductWithImages; selectedSize: Size; quantity: number }[];
        subdomain: string;
    } = await req.json();

    if (!cartItems || cartItems.length === 0) {
        return new NextResponse("Cart items are required", { status: 400 });
    }

    if (!subdomain) {
        return new NextResponse("Something went wrong...", { status: 400 });
    }

    const store = await prisma.store.findUnique({
        where: {
            name: subdomain,
        },
    });

    if (!store) {
        return new NextResponse("Something went wrong...", { status: 400 });
    }

    const order = await prisma.order.create({
        data: {
            storeId: store.id,
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

    const info = JSON.stringify(
        cartItems.map((item) => ({
            product_id: item.product.id,
            size_id: item.selectedSize.id,
            quantity: item.quantity,
        }))
    );

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
        success_url: `${req.headers.get("origin")}/cart?success=1`,
        cancel_url: `${req.headers.get("origin")}/cart?canceled=1`,
        metadata: {
            orderId: order.id,
            info,
        },
    });

    return NextResponse.json(
        { url: session.url },
        {
            headers: corsHeaders,
        }
    );
}
