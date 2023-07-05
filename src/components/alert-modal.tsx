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
            <div className="pt-6 flex space-x-2 items-center justify-end w-full">
                <Button disabled={isLoading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={isLoading} variant="destructive" onClick={onConfirm}>
                    Continue
                </Button>
            </div>
        </Modal>
    );
};

export default AlertModal;
