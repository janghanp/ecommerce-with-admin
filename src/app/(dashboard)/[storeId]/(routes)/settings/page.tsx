import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import SettingsForm from "@/src/components/settings-form";

interface Props {
    params: {
        storeId: string;
    };
}

const SettingsPage = async ({ params }: Props) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prisma.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        },
    });

    if (!store) {
        redirect("/");
    }

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
    );
};

export default SettingsPage;
