import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import SettingsForm from "@/src/components/settings-form";
import { Separator } from "@/src/components/ui/separator";
import ApiAlert from "@/src/components/api-alert";

interface Props {
    params: { storeId: string };
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
            <div className="flex-1 space-y-4 p-2 pt-10 md:p-8">
                <SettingsForm initialData={store} />
                <Separator />
                <ApiAlert
                    title={"STORE_URL"}
                    description={`http://${store.name}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                    variant="public"
                />
            </div>
        </div>
    );
};

export default SettingsPage;
