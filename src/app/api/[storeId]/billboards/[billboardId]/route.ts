import cloudinary from "cloudinary";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { prisma } from "@/src/lib/prisma";
import { getPublicIdFromUrl } from "@/src/lib/utils";

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
    try {
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const billboard = await prisma.billboard.findUnique({
            where: {
                id: params.billboardId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const billboard = await prisma.billboard.update({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
) {
    cloudinary.v2.config({
        secure: true,
    });

    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const billboard = await prisma.billboard.delete({
            where: {
                id: params.billboardId,
            },
        });

        const public_id = getPublicIdFromUrl(billboard.imageUrl);

        cloudinary.v2.uploader
            .destroy(public_id)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
