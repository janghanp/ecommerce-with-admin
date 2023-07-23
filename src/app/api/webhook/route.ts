import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/src/lib/stripe";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        return new NextResponse(`webhook error: ${error.message()}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(", ");

    if (event.type === "checkout.session.completed") {
        const productsData: { product_id: string; size_id: string; quantity: number }[] =
            JSON.parse(session.metadata!.info);

        await prisma.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || "",
                payment_intent_id: session.payment_intent as string,
            },
        });

        const updateProduct = async (info: {
            product_id: string;
            size_id: string;
            quantity: number;
        }) => {
            await prisma.product.update({
                where: {
                    id: info.product_id,
                },
                data: {
                    sizes: {
                        update: {
                            where: {
                                id: info.size_id,
                            },
                            data: {
                                quantity: { decrement: info.quantity },
                            },
                        },
                    },
                },
            });
        };

        await Promise.all(productsData.map((info) => updateProduct(info)));
    }

    return new NextResponse(null, { status: 200 });
}
