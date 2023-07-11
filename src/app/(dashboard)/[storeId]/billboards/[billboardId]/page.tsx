import { prisma } from "@/src/lib/prisma";
import BillboardForm from "@/src/components/billboard-form";

interface Props {
    params: { billboardId: string };
}

const BillboardPage = async ({ params }: Props) => {
    const billboard = await prisma.billboard.findUnique({
        where: {
            id: params.billboardId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
};

export default BillboardPage;
