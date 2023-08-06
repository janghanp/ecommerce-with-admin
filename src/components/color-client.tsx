"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { Color } from "@prisma/client";

import Heading from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { colorColumns, ColorColumn } from "@/src/components/columns";
import { DataTable } from "@/src/components/data-table";
import { useAuth } from "@clerk/nextjs";

interface Props {
    colors: Color[];
}

const ColorClient = ({ colors }: Props) => {
    const router = useRouter();
    const { storeId } = useParams();
    const { getToken } = useAuth();

    const formattedColors: ColorColumn[] = colors.map((size) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        createdAt: format(size.createdAt, "MMMM do, yyyy"),
    }));

    const deleteHandler = async (colorIds: string[]) => {
        await axios.delete(`/api/${storeId}/colors?ids=${colorIds.join(",")}`, {
            headers: { Authorization: `Bearer ${await getToken()}` },
        });
    };

    const updateHandler = async (colorId: string) => {
        router.push(`/${storeId}/colors/${colorId}`);
    };

    return (
        <>
            <div className="flex flex-col items-start justify-between gap-y-5 md:flex-row md:items-center md:gap-y-0">
                <Heading
                    title={`Colors (${colors.length})`}
                    description="Manage colors for your store"
                />

                <Button onClick={() => router.push(`/${storeId}/colors/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={colorColumns}
                data={formattedColors}
                searchKey="name"
                deleteHandler={deleteHandler}
                updateHandler={updateHandler}
            />
        </>
    );
};

export default ColorClient;
