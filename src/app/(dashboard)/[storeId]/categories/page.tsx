import { format } from "date-fns";

import { prisma } from "@/src/lib/prisma";
import { CategoryColumn } from "@/src/components/columns";
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

    const formattedCategories: CategoryColumn[] = categories.map((category) => ({
        id: category.id,
        name: category.name,
        billboardLabel: category.billboard.label,
        createdAt: format(category.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient categories={formattedCategories} />
            </div>
        </div>
    );
};

export default CategoriesPage;
