import { prisma } from "@/src/lib/prisma";
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

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-2 pt-10 md:p-8">
        <ColorClient colors={colors} />
      </div>
    </div>
  );
};

export default ColorsPage;
