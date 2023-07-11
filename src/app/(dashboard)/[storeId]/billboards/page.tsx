import { format } from "date-fns";
import { prisma } from "@/src/lib/prisma";
import BillboardClient from "@/src/components/billboard-client";
import { BillboardColumn } from "@/src/components/columns";

interface Props {
    params: { storeId: string };
}

const BillboardsPage = async ({ params }: Props) => {
    const billboards = await prisma.billboard.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
        id: billboard.id,
        label: billboard.label,
        createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient billboards={formattedBillboards} />
            </div>
        </div>
    );
};

export default BillboardsPage;
