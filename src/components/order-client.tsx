"use client";

import Heading from "@/src/components/heading";
import { Separator } from "@/src/components/ui/separator";
import { OrderColumn, orderColumns } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";

interface Props {
    orders: OrderColumn[];
}

const OrderClient = ({ orders }: Props) => {
    return (
        <>
            <Heading
                title={`Orders (${orders.length})`}
                description="Manage orders for your store"
            />
            <Separator />
            <DataTable columns={orderColumns} data={orders} searchKey="products" />
        </>
    );
};

export default OrderClient;
