import cloudinary from "cloudinary";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { prisma } from "@/src/lib/prisma";
import { getPublicIdFromUrl } from "@/src/lib/utils";

export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {
        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                sizes: true,
                color: true,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            colorId,
            images,
            isFeatured,
            isArchived,
            sizes,
            quantities,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        if (!sizes) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        if (!quantities) {
            return new NextResponse("Quantity id is required", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
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

        let sizesAndQuantities: { size: string; quantity: number }[] = [];

        sizes.forEach((size: { value: string }) => {
            sizesAndQuantities.push({ size: size.value!, quantity: 0 });
        });

        quantities.forEach((quantity: { value: string }, index: number) => {
            sizesAndQuantities[index] = {
                ...sizesAndQuantities[index],
                quantity: Number(quantity.value),
            };
        });

        await prisma.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price: Number(price),
                categoryId,
                colorId,
                images: {
                    deleteMany: {},
                },
                sizes: {
                    deleteMany: {},
                },
                isFeatured,
                isArchived,
            },
        });

        const product = await prisma.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [...images.map((image: { url: string }) => image)],
                    },
                },
                sizes: {
                    createMany: {
                        data: [
                            ...sizesAndQuantities.map((item) => {
                                return { name: item.size, quantity: item.quantity };
                            }),
                        ],
                    },
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    cloudinary.v2.config({
        secure: true,
    });

    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
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

        const product = await prisma.product.delete({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
            },
        });

        const public_ids = product.images.map((image) => {
            return getPublicIdFromUrl(image.url);
        });

        cloudinary.v2.api
            .delete_resources(public_ids)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
