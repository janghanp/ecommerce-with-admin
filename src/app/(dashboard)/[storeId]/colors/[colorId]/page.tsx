import { prisma } from "@/src/lib/prisma";
import ColorForm from "@/src/components/color-form";

interface Props {
    params: { colorId: string };
}

const ColorPage = async ({ params }: Props) => {
    const color = await prisma.color.findUnique({
        where: {
            id: params.colorId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={color} />
            </div>
        </div>
    );
};

export default ColorPage;
