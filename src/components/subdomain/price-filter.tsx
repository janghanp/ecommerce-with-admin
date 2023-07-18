"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

const priceRange = [
    { minPrice: 0, maxPrice: 50, label: "$0 ~ $50" },
    { minPrice: 50, maxPrice: 100, label: "$50 ~ $100" },
    { minPrice: 100, maxPrice: 150, label: "$100 ~ $150" },
    { minPrice: 150, maxPrice: 200, label: "$150 ~ $200" },
];

const PriceFilter = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const clickHandler = (minPrice: number, maxPrice: number) => {
        const currentQueries = qs.parse(searchParams.toString());

        const newQuery = {
            ...currentQueries,
            minPrice,
            maxPrice,
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
            <h1 className="text-2xl font-bold">Price</h1>
            <hr className="my-5" />
            <div className="flex flex-col gap-y-3">
                {priceRange.map((range) => {
                    return (
                        <div
                            key={range.label}
                            className="rounded-md px-2 py-1 transition duration-200 hover:cursor-pointer hover:bg-gray-100"
                            onClick={() => clickHandler(range.minPrice, range.maxPrice)}
                        >
                            {range.label}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PriceFilter;
