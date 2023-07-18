"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { X } from "lucide-react";

const CurrentFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);

    useEffect(() => {
        let temp: { key: string; value: string }[] = [];

        const currentQueries = qs.parse(searchParams.toString());

        if (currentQueries.colorName) {
            temp.push({ key: "colorName", value: currentQueries.colorName as string });
        }

        if (currentQueries.minPrice && currentQueries.maxPrice) {
            temp.push({
                key: "price",
                value: `$${currentQueries.minPrice} ~ $${currentQueries.maxPrice}`,
            });
        }

        setFilters(temp);
    }, [searchParams]);

    const clickHandler = (key: string) => {
        let newUrl;

        if (key === "price") {
            newUrl = qs.exclude(window.location.href, ["minPrice", "maxPrice"]);
        } else {
            newUrl = qs.exclude(window.location.href, [key]);
        }

        router.push(newUrl);
    };

    if (filters.length === 0) {
        return <></>;
    }

    return (
        <div className="mb-5 border-b pb-5">
            <div className="mb-3 text-2xl font-bold">Current filters</div>
            <div className="flex flex-wrap gap-3">
                {filters.map((filter) => {
                    return (
                        <div
                            className="flex items-center justify-between gap-x-3 rounded-md border px-3 py-1 shadow-md"
                            key={filter.key}
                        >
                            <span>{filter.value}</span>
                            <div
                                onClick={() => clickHandler(filter.key)}
                                className="hover:cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CurrentFilters;
