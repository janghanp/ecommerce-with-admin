import { prisma } from "@/src/lib/prisma";
import CategoryForm from "@/src/components/category-form";

const CategoryPage = async ({ params }: { params: { categoryId: string; storeId: string } }) => {
    const category = await prisma.category.findUnique({
        where: {
            id: params.categoryId,
        },
    });

    const billboards = await prisma.billboard.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm initialData={category} billboards={billboards} />
            </div>
        </div>
    );
};

export default CategoryPage;
