import { prisma } from "@/src/lib/prisma";

export const getStockCount = async (storeId: string) => {
    return prisma.product.count({
        where: {
            storeId,
            isArchived: false,
        },
    });
};
