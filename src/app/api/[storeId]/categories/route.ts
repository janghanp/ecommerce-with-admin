import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { prisma } from "@/src/lib/prisma";
import { Prisma } from ".prisma/client";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prisma.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    const body = await req.json();

    const { name, billboardId } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  // @ts-ignore
  const ids = req.nextUrl.searchParams.get("ids").split(",");

  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!ids) {
      return new NextResponse("Ids are required", { status: 400 });
    }

    const categories = await prisma.category.deleteMany({
      where: {
        storeId: params.storeId,
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_DELETE]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new NextResponse("Make sure you removed all products first.", { status: 400 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}
