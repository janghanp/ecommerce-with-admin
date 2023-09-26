import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Billboard } from "@prisma/client";

import { prisma } from "@/src/lib/prisma";
import { getPublicIdFromUrl } from "@/src/lib/utils";
import { Prisma } from ".prisma/client";

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
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
      return new NextResponse("ImageUrl is required", { status: 400 });
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

    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
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

    const billboards: Billboard[] = await prisma.billboard.findMany({
      where: {
        storeId: params.storeId,
        id: {
          in: ids,
        },
      },
    });

    const public_ids = billboards.map((billboard) => {
      return getPublicIdFromUrl(billboard.imageUrl);
    });

    const count = await prisma.billboard.deleteMany({
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
    console.log("[BILLBOARDS_DELETE]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new NextResponse("Make sure you removed all categories first.", { status: 400 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}
