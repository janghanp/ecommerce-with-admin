import { Loader2 } from "lucide-react";

import Modal from "@/src/components/modal";
import { Button } from "@/src/components/ui/button";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

const AlertModal = ({ isOpen, onClose, onConfirm, isLoading }: Props) => {
    return (
        <Modal
            title={"Are you sure?"}
            description={"This action cannot be undone"}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex w-full items-center justify-end space-x-2 pt-6">
                <Button disabled={isLoading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={isLoading} variant="destructive" onClick={onConfirm}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                </Button>
            </div>
        </Modal>
    );
};

export default AlertModal;
