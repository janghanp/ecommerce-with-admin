"use client";

import qs from "query-string";
import { useSearchParams, useRouter } from "next/navigation";
import { Color } from "@prisma/client";

interface Props {
    colors: Color[];
}

const ColorFilter = ({ colors }: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const clickHandler = (colorName: string) => {
        const currentQueries = qs.parse(searchParams.toString());

        const newQuery = {
            ...currentQueries,
            colorName,
        };

        const url = qs.stringifyUrl(
            {
                url: window.location.href,
                query: newQuery,
            },
            { skipNull: true }
        );

        router.push(url);
    };

    return (
        <div>
            <h1 className="text-xl font-semibold">Colors</h1>
            <hr className="my-2" />
            <div className="flex flex-wrap gap-5">
                {colors.map((color) => {
                    return (
                        <div key={color.id} className="flex flex-col items-center">
                            <div
                                className="w-5 rounded-full border p-4 ring-gray-400 transition duration-200 hover:cursor-pointer hover:ring-2"
                                style={{ backgroundColor: color.value }}
                                onClick={() => clickHandler(color.name)}
                            />
                            <span className="text-sm font-medium">{color.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorFilter;
