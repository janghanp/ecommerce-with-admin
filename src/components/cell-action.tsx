"use client";

import { useParams, useRouter } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";

import { BillboardColumn, CategoryColumn } from "./columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import axios from "axios";
import AlertModal from "./alert-modal";

interface Props {
    data: BillboardColumn | CategoryColumn;
    type: "billboard" | "category";
}

const CellAction = ({ data, type }: Props) => {
    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const copyHandler = (id: string) => {
        if (type === "billboard") {
            navigator.clipboard.writeText(id);
            toast.success("Billboard id copied to the clipboard");
        }

        if (type === "category") {
            navigator.clipboard.writeText(id);
            toast.success("Category id copied to the clipboard");
        }
    };

    const updateHandler = () => {
        if (type === "billboard") {
            router.push(`/${params.storeId}/billboards/${data.id}`);
        }

        if (type === "category") {
            router.push(`/${params.storeId}/categories/${data.id}`);
        }
    };

    const deleteHandler = async () => {
        try {
            setIsLoading(true);

            if (type === "billboard") {
                await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            }

            if (type === "category") {
                await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
            }

            router.refresh();
            router.push("");

            if (type === "billboard") {
                toast.success("Billboard deleted.");
            }

            if (type === "category") {
                toast.success("Category deleted.");
            }
        } catch (error) {
            if (type === "billboard") {
                toast.error("Make sure you removed all categories using this billboard first.");
            }

            if (type === "category") {
                toast.error("Make sure you removed all products using this category first.");
            }
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isLoading={isLoading}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={deleteHandler}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="hover:cursor-pointer" onClick={updateHandler}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => copyHandler(data.id)}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default CellAction;
