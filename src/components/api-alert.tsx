"use client";

import { Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Badge, BadgeProps } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

interface Props {
    title: string;
    description: string;
    variant: "public" | "admin";
}

const textMap: Record<Props["variant"], string> = {
    public: "Public",
    admin: "admin",
};

const variantMap: Record<Props["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive",
};

const ApiAlert = ({ title, description, variant = "public" }: Props) => {
    const copyHandler = () => {
        navigator.clipboard.writeText(description);
        toast.success("Copied!");
    };

    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between overflow-x-auto">
                <div className="flex w-full items-center justify-between gap-x-5">
                    <span className="relative whitespace-nowrap font-mono text-sm font-bold">
                        {description}
                    </span>
                    <Button
                        className="absolute right-5"
                        variant="outline"
                        size="icon"
                        onClick={copyHandler}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
};

export default ApiAlert;
