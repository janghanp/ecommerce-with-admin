"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { CategoryColumn, categoryColumns } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";
import axios from "axios";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";

type CategoryWithBillboard = Prisma.CategoryGetPayload<{
    include: {
        billboard: true;
    };
}>;

interface Props {
    categories: CategoryWithBillboard[];
}

const CategoryClient = ({ categories }: Props) => {
    const router = useRouter();
    const { storeId } = useParams();
    const { getToken } = useAuth();

    const formattedCategories: CategoryColumn[] = categories.map((category) => ({
        id: category.id,
        name: category.name,
        billboardLabel: category.billboard.label,
        createdAt: format(category.createdAt, "MMMM do, yyyy"),
    }));

    const deleteHandler = async (categoryIds: string[]) => {
        await axios.delete(`/api/${storeId}/categories?ids=${categoryIds.join(",")}`, {
            headers: { Authorization: `Bearer ${await getToken()}` },
        });
    };

    const updateHandler = async (categoryId: string) => {
        router.push(`/${storeId}/categories/${categoryId}`);
    };

    return (
        <>
            <div className="flex flex-col items-start justify-between gap-y-5 md:flex-row md:items-center md:gap-y-0">
                <Heading
                    title={`Categories (${categories.length})`}
                    description="Manage categories for your store"
                />

                <Button onClick={() => router.push(`/${storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={categoryColumns}
                data={formattedCategories}
                searchKey="name"
                deleteHandler={deleteHandler}
                updateHandler={updateHandler}
            />
        </>
    );
};

export default CategoryClient;
