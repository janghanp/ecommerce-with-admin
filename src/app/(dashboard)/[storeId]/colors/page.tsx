import { format } from "date-fns";

import { prisma } from "@/src/lib/prisma";
import { ColorColumn } from "@/src/components/columns";
import ColorClient from "@/src/components/color-client";

interface Props {
    params: { storeId: string };
}

const ColorsPage = async ({ params }: Props) => {
    const colors = await prisma.color.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const formattedColors: ColorColumn[] = colors.map((size) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        createdAt: format(size.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-2 pt-10 md:p-8">
                <ColorClient colors={formattedColors} />
            </div>
        </div>
    );
};

export default ColorsPage;
