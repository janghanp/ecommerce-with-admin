import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { prisma } from "@/src/lib/prisma";
import SettingsForm from "@/src/components/settings-form";
import { Separator } from "@/src/components/ui/separator";
import SettingsInfo from "@/src/components/subdomain/settings-info";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

interface Props {
  params: { storeId: string };
}

const SettingsPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId: session.user.id,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 pt-10 md:p-8">
      <SettingsForm initialData={store} />
      <Separator className="my-5 max-w-2xl" />
      <SettingsInfo store={store} />
    </div>
  );
};

export default SettingsPage;
