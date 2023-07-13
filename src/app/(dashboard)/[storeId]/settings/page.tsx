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
            <div className="flex-1 space-y-4 p-2 pt-6 md:p-8">
                <SettingsForm initialData={store} />
                <Separator />
                <ApiAlert
                    title={"API_URL"}
                    description={`${process.env.NEXT_PUBLIC_URL}/api/${params.storeId}`}
                    variant="public"
                />
                <ApiAlert
                    title={"STORE_URL"}
                    description={`${process.env.STORE_URL}/${params.storeId}`}
                    variant="public"
                />
            </div>
        </div>
    );
};

export default SettingsPage;
