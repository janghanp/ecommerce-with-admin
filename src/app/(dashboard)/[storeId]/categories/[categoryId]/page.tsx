import { prisma } from "@/src/lib/prisma";
import CategoryForm from "@/src/components/category-form";

interface Props {
  params: { categoryId: string; storeId: string };
}

const CategoryPage = async ({ params }: Props) => {
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
    <div className="flex items-center justify-center p-4 pt-10 md:p-8">
      <CategoryForm initialData={category} billboards={billboards} />
    </div>
  );
};

export default CategoryPage;
