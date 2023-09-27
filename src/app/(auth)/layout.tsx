import { getServerSession } from "next-auth/next";

import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  console.log(session);

  if (session) {
    redirect("/");
  }

  return <div className={"flex h-full items-center justify-center"}>{children}</div>;
};

export default AuthLayout;
