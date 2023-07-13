"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { CategoryColumn, categoryColumns } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";
import ApiList from "./api-list";
import axios from "axios";

interface Props {
    categories: CategoryColumn[];
}

const CategoryClient = ({ categories }: Props) => {
    const router = useRouter();
    const { storeId } = useParams();

    const deleteHandler = async (categoryIds: string[]) => {
        await axios.delete(`/api/${storeId}/categories?ids=${categoryIds.join(",")}`);
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
                data={categories}
                searchKey="name"
                deleteHandler={deleteHandler}
            />
            <Heading title="API" description="API calls for Categories" />
            <Separator />
            <ApiList entityName="categories" entityId="categoryId" />
        </>
    );
};

export default CategoryClient;
