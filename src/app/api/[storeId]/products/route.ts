import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import cloudinary from "cloudinary";
import { getPublicIdFromUrl } from "@/src/lib/utils";

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorName = searchParams.get("colorName") || undefined;
        const minPrice = searchParams.get("minPrice") || undefined;
        const maxPrice = searchParams.get("maxPrice") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: {
                storeId: params.storeId,
                price: {
                    gte: minPrice,
                    lte: maxPrice,
                },
                categoryId,
                color: {
                    name: colorName,
                },
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                sizes: true,
                images: true,
                category: true,
                color: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
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

        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        if (!sizes) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        if (!quantities) {
            return new NextResponse("Quantity id is required", { status: 400 });
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

        const product = await prisma.product.create({
            data: {
                name,
                price: new Prisma.Decimal(price),
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                storeId: params.storeId,
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
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
    cloudinary.v2.config({
        secure: true,
    });

    // @ts-ignore
    const ids = req.nextUrl.searchParams.get("ids").split(",");

    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        if (!ids) {
            return new NextResponse("Ids are required", { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: {
                storeId: params.storeId,
                id: {
                    in: ids,
                },
            },
            include: {
                images: true,
            },
        });

        const public_ids_with_depth = products.map((product) => {
            return product.images.map((image) => {
                return getPublicIdFromUrl(image.url);
            });
        });

        const public_ids = public_ids_with_depth.flat();

        const count = await prisma.product.deleteMany({
            where: {
                storeId: params.storeId,
                id: {
                    in: ids,
                },
            },
        });

        cloudinary.v2.api
            .delete_resources(public_ids)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));

        return NextResponse.json(count);
    } catch (error) {
        console.log("[PRODUCTS_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
