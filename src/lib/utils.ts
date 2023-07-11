import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export const getPublicIdFromUrl = (url: string) => {
    const urlArr = url.split("/");

    const filename = urlArr[urlArr.length - 1].split(".")[0];
    const directory = urlArr[urlArr.length - 2];

    return `${directory}/${filename}`;
};
