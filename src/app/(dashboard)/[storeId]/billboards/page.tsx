import { prisma } from "@/src/lib/prisma";
import BillboardClient from "@/src/components/billboard-client";

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

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-2 pt-10 md:p-8">
                <BillboardClient billboards={billboards} />
            </div>
        </div>
    );
};

export default BillboardsPage;
