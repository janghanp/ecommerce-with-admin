import { prisma } from "@/src/lib/prisma";
import CategoryClient from "@/src/components/category-client";

interface Props {
    params: { storeId: string };
}

const CategoriesPage = async ({ params }: Props) => {
    const categories = await prisma.category.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            billboard: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-2 pt-10 md:p-8">
                <CategoryClient categories={categories} />
            </div>
        </div>
    );
};

export default CategoriesPage;
