import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectGroup,
} from "@/src/components/ui/select";
import { Size } from "@prisma/client";

interface Props {
    sizes: Size[];
    changeHandler: (size: Size) => void;
    defaultValue?: string;
}

const SizeSelect = ({ sizes, changeHandler, defaultValue }: Props) => {
    const valueChangeHandler = (value: string) => {
        const selectedSize = sizes.find((size) => size.name === value);

        changeHandler(selectedSize!);
    };

    return (
        <Select onValueChange={valueChangeHandler} defaultValue={defaultValue}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sizes</SelectLabel>
                    {sizes.map((size) => {
                        return (
                            <SelectItem key={size.id} value={size.name}>
                                {size.name}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default SizeSelect;
