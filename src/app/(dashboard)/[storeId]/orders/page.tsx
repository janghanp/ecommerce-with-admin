import { format } from "date-fns";
import { prisma } from "@/src/lib/prisma";
import { OrderColumn } from "@/src/components/columns";
import { formatter } from "@/src/lib/utils";
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

    const formattedOrders: OrderColumn[] = orders.map((order) => ({
        id: order.id,
        isPaid: order.isPaid,
        totalPrice: formatter.format(
            order.orderItems.reduce((total, orderItem) => {
                return total + Number(orderItem.product.price) * orderItem.quantity;
            }, 0)
        ),
        createdAt: format(order.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-2 pt-6 md:p-8">
                <OrderClient orders={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;
