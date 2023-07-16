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
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
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
            include: {
                orderItems: true,
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}
