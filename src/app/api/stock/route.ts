import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { productId, sizeId, quantity } = body;

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                sizes: {
                    where: {
                        id: sizeId,
                    },
                },
            },
        });

        if (product!.sizes![0].quantity < Number(quantity)) {
            return NextResponse.json({ result: false }, { headers: corsHeaders });
        }

        return NextResponse.json({ result: true }, { headers: corsHeaders });
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
    }
}
