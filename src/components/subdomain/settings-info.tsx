"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store as StoreIcon, ExternalLink } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Store } from "@prisma/client";
import AlertModal from "@/src/components/alert-modal";

interface Props {
    store: Store;
}

const SettingsInfo = ({ store }: Props) => {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/stores/${store.id}`);

            router.refresh();
            router.push("/");
        } catch (error) {
            toast.error("Make sure you removed all products and categories first.");
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };
    return (
        <>
            <AlertModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={onDelete}
                isLoading={isLoading}
            />
            <div className="flex w-full max-w-2xl flex-col gap-y-5">
                <Alert>
                    <StoreIcon className="h-4 w-4" />
                    <AlertTitle>STORE URL</AlertTitle>
                    <AlertDescription>
                        <a
                            href={`http://${store.name}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                            target="_blank"
                        >
                            <div className="-ml-2 flex max-w-max items-center gap-x-2 rounded-md p-1 px-2 font-medium transition duration-200 hover:cursor-pointer hover:bg-gray-100">
                                <span>
                                    {store.name}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                                </span>
                                <ExternalLink className="h-4 w-4" />
                            </div>
                        </a>
                    </AlertDescription>
                </Alert>
                <Alert className="border border-red-500">
                    <AlertTitle className="font-semibold">Delete this store</AlertTitle>
                    <AlertDescription className="flex items-center justify-between gap-x-5">
                        <span className="mt-3 font-medium">
                            Once you delete a store, there is no going back.
                        </span>
                        <Button
                            variant="outline"
                            className="flex-none text-red-500 hover:bg-red-700 hover:text-white"
                            onClick={() => setIsOpen(true)}
                        >
                            Delete this store
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        </>
    );
};

export default SettingsInfo;
