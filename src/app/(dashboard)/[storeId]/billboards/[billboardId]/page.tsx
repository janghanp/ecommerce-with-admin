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
        <div className="flex items-center justify-center p-4 pt-10 md:p-8">
            <BillboardForm initialData={billboard} />
        </div>
    );
};

export default BillboardPage;
