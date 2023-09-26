"use client";

import { AlignJustify, X } from "lucide-react";
import { motion } from "framer-motion";

import { useMobileSidebar } from "../store";
import { Store } from "@prisma/client";
import { Button } from "@/src/components/ui/button";
import { PopoverTrigger } from "@/src/components/ui/popover";
import NavList from "@/src/components/nav-list";
import StoreSwitcher from "@/src/components/store-switcher";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { Separator } from "@/src/components/ui/separator";
import UserInfo from "@/src/components/user-info";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface Props extends PopoverTriggerProps {
  stores: Store[];
}

const MobileSidebar = ({ stores }: Props) => {
  const { isOpen, toggle } = useMobileSidebar();

  return (
    <div className="block md:hidden">
      <div
        className="absolute left-1.5 top-1.5 block p-1 hover:cursor-pointer md:hidden"
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
            <div className="flex h-full w-full flex-col justify-between px-2 py-5">
              <div className="flex flex-col gap-y-3">
                <div className="mb-5">
                  <StoreSwitcher stores={stores} />
                </div>
                <NavList />
              </div>
              <div className="flex w-full flex-col items-center justify-center">
                <ThemeToggle />
                <Separator className="my-3" />
                <UserInfo />
              </div>
            </div>
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
