import { create } from "zustand";

interface useModalState {
    isOpen: boolean;
    toggleModal: (value: boolean) => void;
}

export const useModalState = create<useModalState>((set) => ({
    isOpen: false,
    toggleModal: (value: boolean) => set({ isOpen: value }),
}));
