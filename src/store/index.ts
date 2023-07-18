import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@prisma/client";
import { Size } from "@/src/type";

interface useModalState {
    isOpen: boolean;
    toggleModal: (value: boolean) => void;
}

interface useMobileSidebar {
    isOpen: boolean;
    toggle: (value: boolean) => void;
}

interface CartState {
    items: { product: Product; selectedSize: Size; quantity: number }[];
    addItem: (data: Product, selectedSize: Size) => void;
    updateItem: (productId: string, selectedSize: Size, quantity: number) => void;
    removeItem: (id: string) => void;
    emptyCart: () => void;
}

export const useModalState = create<useModalState>((set) => ({
    isOpen: false,
    toggleModal: (value: boolean) => set({ isOpen: value }),
}));

export const useMobileSidebar = create<useMobileSidebar>((set) => ({
    isOpen: false,
    toggle: (value: boolean) => set({ isOpen: value }),
}));

export const useCart = create(
    persist<CartState>(
        (set, get) => ({
            items: [],
            addItem: (product: Product, selectedSize: Size) => {
                const isExisting = get().items.find((item) => item.product.id === product.id);

                if (isExisting) {
                    return toast("Item already in cart.");
                }

                set({ items: [...get().items, { product, selectedSize, quantity: 1 }] });
                toast.success("Item added in cart.");
            },
            updateItem: (productId: string, selectedSize: Size, quantity: number) => {
                const updatedItems = get().items.map((item) => {
                    if (item.product.id === productId) {
                        item.selectedSize = selectedSize;
                        item.quantity = quantity;

                        return item;
                    }

                    return item;
                });

                set({ items: updatedItems });
            },
            removeItem: (id: string) => {
                set({ items: [...get().items.filter((item) => item.product.id !== id)] });
                toast.success("Item removed in cart.");
            },
            emptyCart: () => {
                set({ items: [] });
            },
        }),
        {
            name: "cart-storage", // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);
