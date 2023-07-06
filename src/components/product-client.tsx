"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

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
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Products (${products.length})`}
                    description="Manage products for your store"
                />

                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={productsColumns} data={products} searchKey="name" />
            <Heading title="API" description="API calls for Products" />
            <Separator />
            <ApiList entityName="products" entityId="productId" />
        </>
    );
};

export default ProductClient;