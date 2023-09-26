import { prisma } from "@/src/lib/prisma";
import OrderClient from "@/src/components/order-client";

interface Props {
  params: { storeId: string };
}

const OrdersPage = async ({ params }: Props) => {
  const orders = await prisma.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-2 pt-10 md:p-8">
        <OrderClient orders={orders} />
      </div>
    </div>
  );
};

export default OrdersPage;
