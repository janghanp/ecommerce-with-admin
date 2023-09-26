import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { prisma } from "@/src/lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface Props {
  children: React.ReactNode;
}

export default async function SetupLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
      where: {
          userId: session.user.id,
      },
  });

  if (store) {
      redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
