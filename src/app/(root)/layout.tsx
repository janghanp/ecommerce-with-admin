import { redirect } from "next/navigation";

// import { prisma } from "@/src/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface Props {
  children: React.ReactNode;
}

export default async function SetupLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  // const store = await prisma.store.findFirst({
  //     where: {
  //         userId,
  //     },
  // });
  //
  // if (store) {
  //     redirect(`/${store.id}`);
  // }

  return <>{children}</>;
}
