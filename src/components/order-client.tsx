"use client";

import { useParams, useRouter } from "next/navigation";

import Heading from "@/src/components/heading";
import { Separator } from "@/src/components/ui/separator";
import { OrderColumn, orderColumns } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";

interface Props {
    orders: OrderColumn[];
}

const OrderClient = ({ orders }: Props) => {
    const router = useRouter();
    const { storeId } = useParams();

    const updateHandler = async (orderId: string) => {
        router.push(`/${storeId}/orders/${orderId}`);
    };

    return (
        <>
            <Heading
                title={`Orders (${orders.length})`}
                description="Manage orders for your store"
            />
            <Separator />
            <DataTable
                columns={orderColumns}
                data={orders}
                searchKey="id"
                updateHandler={updateHandler}
            />
        </>
    );
};

export default OrderClient;
