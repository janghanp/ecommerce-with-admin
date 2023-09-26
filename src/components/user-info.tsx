"use client";

import { UserButton, SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";

const UserInfo = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <>
        <Skeleton className="h-10 w-full" />
      </>
    );
  }

  return (
    <div className="ml-auto flex w-full items-center space-x-4">
      <div className="flex w-full items-center justify-between gap-x-2 p-2 py-1">
        <UserButton afterSignOutUrl="/" />
        <span className="text-sm font-medium">{user?.firstName}</span>
        <SignOutButton>
          <div className="rounded-md p-2 transition duration-200 hover:cursor-pointer hover:bg-gray-200">
            <LogOut className="h-4 w-4" />
          </div>
        </SignOutButton>
      </div>
    </div>
  );
};

export default UserInfo;
