import { prisma } from "@/src/lib/prisma";

export const getTotalRevenue = async (storeId: string) => {
    const paidOrders = await prisma.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    return paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + item.product.price * item.quantity;
        }, 0);

        return total + orderTotal;
    }, 0);
};
