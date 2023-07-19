"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

interface Props {
    firstName: string;
}

const UserInfo = ({ firstName }: Props) => {
    const auth = useAuth();

    return (
        <div className="ml-auto flex w-full items-center space-x-4">
            <div className="flex w-full items-center justify-between gap-x-2 p-2 py-1">
                <UserButton afterSignOutUrl="/" />
                <span className="text-sm font-medium">{firstName}</span>
                <div
                    className="rounded-md p-2 transition duration-200 hover:cursor-pointer hover:bg-gray-200"
                    onClick={() => auth.signOut()}
                >
                    <LogOut className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
