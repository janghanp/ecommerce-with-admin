"use client";

import { AlignJustify, X } from "lucide-react";

import { useMobileSidebar } from "../store";
import { Store } from "@prisma/client";
import Navbar from "@/src/components/navbar";
import { Button } from "@/src/components/ui/button";
import { PopoverTrigger } from "@/src/components/ui/popover";
import StoreSwitcher from "@/src/components/store-switcher";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface Props extends PopoverTriggerProps {
    stores: Store[];
}

const MobileSidebar = ({ stores }: Props) => {
    const { isOpen, toggle } = useMobileSidebar();

    return (
        <div className="block md:hidden">
            <div
                className="absolute left-5 top-4 block hover:cursor-pointer md:hidden"
                onClick={() => toggle(true)}
            >
                <AlignJustify />
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black z-30 bg-opacity-50"
                        onClick={() => toggle(false)}
                    />
                    <div className="fixed bottom-0 left-0 top-0 z-50 w-52 bg-white dark:bg-[#020816]">
                        <div className="mt-5">
                            <StoreSwitcher items={stores} />
                        </div>
                        <Navbar />
                        <div className="absolute -right-10 top-0 z-30">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-none rounded-e-md bg-white dark:bg-[#020816]"
                                onClick={() => toggle(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MobileSidebar;
