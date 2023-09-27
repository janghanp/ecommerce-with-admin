"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Skeleton } from "@/src/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

const UserInfo = () => {
  const { data, status } = useSession();

  if (status === "loading" || !data) {
    return (
      <>
        <Skeleton className="h-10 w-full" />
      </>
    );
  }

  return (
    <div className="ml-auto flex w-full items-center space-x-4">
      <div className="flex w-full items-center justify-between gap-x-2 p-2 py-1">
        <Avatar>
          <AvatarImage src={data.user.image} />
          <AvatarFallback>{data.user.name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{data.user.name.split(" ")[0]}</span>
        <div className="rounded-md p-2 transition duration-200 hover:cursor-pointer hover:bg-gray-200">
          <LogOut className="h-4 w-4" onClick={() => signOut()} />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
