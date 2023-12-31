"use client";

import { useEffect } from "react";

import { useModalState } from "@/src/store";

import { useSession } from "next-auth/react";

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
