import { format } from "date-fns";

import { prisma } from "@/src/lib/prisma";
import { SizeColumn } from "@/src/components/columns";
import SizeClient from "@/src/components/size-client";

interface Props {
    params: { storeId: string };
}

const SizesPage = async ({ params }: Props) => {
    const sizes = await prisma.size.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const formattedSizes: SizeColumn[] = sizes.map((size) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        createdAt: format(size.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient sizes={formattedSizes} />
            </div>
        </div>
    );
};

export default SizesPage;
