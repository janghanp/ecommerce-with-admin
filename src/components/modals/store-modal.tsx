"use client";

import { useModalState } from "@/src/store";
import Modal from "@/src/components/ui/modal";

const storeModal = () => {
    const storeModal = useModalState();

    return (
        <Modal
            title={"Create Store"}
            description={"Add a new store to manage products and categories"}
            isOpen={storeModal.isOpen}
            onClose={() => {
                storeModal.toggleModal(false);
            }}
        ></Modal>
    );
};

export default storeModal;
