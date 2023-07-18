"use client";

import { AlignJustify, X } from "lucide-react";
import { motion } from "framer-motion";

import { useMobileSidebar } from "../store";
import { Store } from "@prisma/client";
import Navbar from "@/src/components/navbar";
import { Button } from "@/src/components/ui/button";
import { PopoverTrigger } from "@/src/components/ui/popover";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface Props extends PopoverTriggerProps {
    stores: Store[];
}

const MobileSidebar = ({ stores }: Props) => {
    const { isOpen, toggle } = useMobileSidebar();

    return (
        <div className="block md:hidden">
            <div
                className="absolute left-2 top-2 block p-1 hover:cursor-pointer md:hidden"
                onClick={() => toggle(true)}
            >
                <AlignJustify />
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30 bg-black bg-opacity-50"
                        onClick={() => toggle(false)}
                    />
                    <motion.div
                        initial={{ x: -50 }}
                        animate={{ x: 0 }}
                        className="fixed bottom-0 left-0 top-0 z-50 w-52 bg-white dark:bg-[#020816]"
                    >
                        <Navbar stores={stores} />
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
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default MobileSidebar;
