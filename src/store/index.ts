import { create } from "zustand";

interface useModalState {
    isOpen: boolean;
    toggleModal: (value: boolean) => void;
}

interface useMobileSidebar {
    isOpen: boolean;
    toggle: (value: boolean) => void;
}

export const useModalState = create<useModalState>((set) => ({
    isOpen: false,
    toggleModal: (value: boolean) => set({ isOpen: value }),
}));

export const useMobileSidebar = create<useMobileSidebar>((set) => ({
    isOpen: false,
    toggle: (value: boolean) => set({ isOpen: value }),
}));
