import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import SettingsForm from "@/src/components/settings-form";
import { Separator } from "@/src/components/ui/separator";
import { Store, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";

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
                <div>
                    <Alert>
                        <Store className="h-4 w-4" />
                        <AlertTitle>STORE URL</AlertTitle>
                        <AlertDescription>
                            <a
                                href={`http://${store.name}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                                target="_blank"
                            >
                                <div className="flex max-w-min items-center gap-x-2 rounded-md p-1 px-2 font-medium transition duration-200 hover:cursor-pointer hover:bg-gray-100">
                                    {store.name}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                                    <ExternalLink className="mb-1" />
                                </div>
                            </a>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
