"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Dialog } from "@headlessui/react";

import { Color } from "@prisma/client";
import { Button } from "@/src/components/ui/button";
import CurrentFilters from "@/src/components/subdomain/current-filters";
import ColorFilter from "@/src/components/subdomain/color-filter";
import PriceFilter from "@/src/components/subdomain/price-filter";

interface Props {
    colors: Color[];
}

const MobileFilters = ({ colors }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button
                variant="secondary"
                className="flex items-center gap-x-2 lg:hidden"
                onClick={() => setIsOpen(true)}
            >
                Filters
                <Plus size={20} />
            </Button>
            <Dialog
                open={isOpen}
                as="div"
                className="relative z-40 lg:hidden"
                onClose={() => setIsOpen(false)}
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />

                <div className="fixed inset-0 z-40 flex">
                    <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-5 py-4 pb-6 shadow-xl">
                        <div className="flex items-center justify-end px-4">
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={15} />
                            </Button>
                        </div>
                        <div className="flex flex-col gap-y-10">
                            <CurrentFilters />
                            <ColorFilter colors={colors} />
                            <PriceFilter />
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default MobileFilters;
