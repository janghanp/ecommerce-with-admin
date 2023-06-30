"use client";

import { useModalState } from "@/src/store";
import { useEffect } from "react";

const Home = () => {
    const { isOpen, toggleModal } = useModalState();

    useEffect(() => {
        if (!isOpen) {
            toggleModal(true);
        }
    }, [isOpen, toggleModal]);

    return <div className={"p-4"}>hello world</div>;
};

export default Home;
