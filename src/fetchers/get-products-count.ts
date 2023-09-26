import { prisma } from "@/src/lib/prisma";

export const getProductsCount = async (storeId: string) => {
  return prisma.product.count({
    where: {
      storeId,
    },
  });
};
