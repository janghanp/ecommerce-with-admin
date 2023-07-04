import { prisma } from "@/src/lib/prisma";

interface Props {
    params: { storeId: string };
}

const DashboardPage = async ({ params }: Props) => {
    const store = await prisma.store.findFirst({
        where: {
            id: params.storeId,
        },
    });

    return <div>{store?.name}</div>;
};

export default DashboardPage;
