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
        phone: order.phone,
        address: order.address,
        products: order.orderItems.map((orderItem) => orderItem.product.name).join(", "),
        totalPrice: formatter.format(
            order.orderItems.reduce((total, item) => {
                return total + Number(item.product.price);
            }, 0)
        ),
        isPaid: order.isPaid,
        createdAt: format(order.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient orders={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;