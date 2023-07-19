"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";

import Heading from "@/src/components/heading";
import { Separator } from "@/src/components/ui/separator";
import { OrderColumn, orderColumns } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";
import { formatter } from "@/src/lib/utils";

type OrderWithOrderItemsAndProduct = Prisma.OrderGetPayload<{
    include: {
        orderItems: {
            include: {
                product: true;
            };
        };
    };
}>;

interface Props {
    orders: OrderWithOrderItemsAndProduct[];
}

const OrderClient = ({ orders }: Props) => {
    const router = useRouter();
    const { storeId } = useParams();

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

    const updateHandler = async (orderId: string) => {
        router.push(`/${storeId}/orders/${orderId}`);
    };

    return (
        <>
            <Heading
                title={`Orders (${orders.length})`}
                description="Manage orders for your store"
            />
            <Separator />
            <DataTable
                columns={orderColumns}
                data={formattedOrders}
                searchKey="id"
                updateHandler={updateHandler}
            />
        </>
    );
};

export default OrderClient;
