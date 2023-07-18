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
        <div className="flex items-center justify-center p-4 md:p-8 pt-10">
            <ColorForm initialData={color} />
        </div>
    );
};

export default ColorPage;
