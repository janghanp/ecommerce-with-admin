"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { BillboardColumn, billboardColumns } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";
import axios from "axios";

interface Props {
    billboards: BillboardColumn[];
}

const BillboardClient = ({ billboards }: Props) => {
    const router = useRouter();
    const { storeId } = useParams();

    const deleteHandler = async (billboardIds: string[]) => {
        await axios.delete(`/api/${storeId}/billboards?ids=${billboardIds.join(",")}`);
    };

    const updateHandler = async (billboardId: string) => {
        router.push(`/${storeId}/billboards/${billboardId}`);
    };

    return (
        <>
            <div className="flex flex-col items-start justify-between gap-y-5 md:flex-row md:items-center md:gap-y-0">
                <Heading
                    title={`Billboards (${billboards.length})`}
                    description="Manage billboards for your store"
                />

                <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={billboardColumns}
                data={billboards}
                searchKey="label"
                deleteHandler={deleteHandler}
                updateHandler={updateHandler}
            />
        </>
    );
};

export default BillboardClient;
