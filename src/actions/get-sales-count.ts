import { prisma } from "@/src/lib/prisma";

export const getSalesCount = async (storeId: string) => {
    return prisma.order.count({
        where: {
            storeId,
            isPaid: true,
        },
    });
};
