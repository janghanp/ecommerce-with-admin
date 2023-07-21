import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Category } from "@prisma/client";
import { AlignJustify } from "lucide-react";
import Link from "next/link";

interface Props {
    categories: Category[];
}

const MobileSidebar = ({ categories }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="block hover:cursor-pointer md:hidden">
                    <AlignJustify />
                </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                    <SheetTitle className="self-start">Category</SheetTitle>
                    <Separator />
                    <SheetDescription className="flex flex-col">
                        {categories.map((category) => {
                            return (
                                <SheetClose key={category.id} asChild>
                                    <Link href={`/category/${category.name}`}>
                                        <Button
                                            variant="ghost"
                                            className="w-full items-center justify-start text-left"
                                        >
                                            {category.name}
                                        </Button>
                                    </Link>
                                </SheetClose>
                            );
                        })}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
