"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import axios from "axios";

import Heading from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { ProductColumn, productsColumns } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";
import ApiList from "./api-list";

interface Props {
    products: ProductColumn[];
}

const ProductClient = ({ products }: Props) => {
    const router = useRouter();
    const { storeId } = useParams();

    const deleteHandler = async (productIds: string[]) => {
        await axios.delete(`/api/${storeId}/products?ids=${productIds.join(",")}`);
    };

    const updateHandler = async (productId: string) => {
        router.push(`/${storeId}/products/${productId}`);
    };

    return (
        <>
            <div className="flex flex-col items-start justify-between gap-y-5 md:flex-row md:items-center md:gap-y-0">
                <Heading
                    title={`Products (${products.length})`}
                    description="Manage products for your store"
                />

                <Button onClick={() => router.push(`/${storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={productsColumns}
                data={products}
                searchKey="name"
                deleteHandler={deleteHandler}
                updateHandler={updateHandler}
            />
        </>
    );
};

export default ProductClient;
