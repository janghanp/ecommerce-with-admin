"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import axios from "axios";

import Heading from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { sizeColumns, SizeColumn } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";
import ApiList from "./api-list";

interface Props {
    sizes: SizeColumn[];
}

const SizeClient = ({ sizes }: Props) => {
    const router = useRouter();
    const { storeId } = useParams();

    const deleteHandler = async (sizeIds: string[]) => {
        await axios.delete(`/api/${storeId}/sizes?ids=${sizeIds.join(",")}`);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${sizes.length})`}
                    description="Manage sizes for your store"
                />

                <Button onClick={() => router.push(`/${storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={sizeColumns}
                data={sizes}
                searchKey="name"
                deleteHandler={deleteHandler}
            />
            <Heading title="API" description="API calls for Sizes" />
            <Separator />
            <ApiList entityName="sizes" entityId="sizeId" />
        </>
    );
};

export default SizeClient;
