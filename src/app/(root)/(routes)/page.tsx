"use client";

import { useModalState } from "@/src/store";
import { useEffect } from "react";

const SetupPage = () => {
    const { isOpen, toggleModal } = useModalState();

    useEffect(() => {
        if (!isOpen) {
            toggleModal(true);
        }
    }, [isOpen, toggleModal]);

    return <></>;
};

export default SetupPage;
