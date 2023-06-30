"use client";

import React from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";

interface Props {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const Modal = ({ title, description, isOpen, onClose, children }: Props) => {
    const onChange = (isOpen: boolean) => {
        if (!isOpen) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
