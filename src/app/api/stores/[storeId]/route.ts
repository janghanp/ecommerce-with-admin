import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { prisma } from "@/src/lib/prisma";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    const body = await req.json();

    const { name } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: {
        name,
      },
    });

    if (store) {
      return new NextResponse("This store name is already in use.", { status: 400 });
    }

    const updatedStore = await prisma.store.update({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.log("[STORES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prisma.store.delete({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
