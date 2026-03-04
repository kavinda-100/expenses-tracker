import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// get the currency format from the local storage or default to "USD"
export const getCurrencyFormat = () => {
    return localStorage.getItem("currency-format") || "USD";
};

// set the currency format in the local storage
export const setCurrencyFormat = (format: string) => {
    localStorage.setItem("currency-format", format);
};

// format a number as currency using the Intl.NumberFormat API and the currency format from the local storage
export const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: getCurrencyFormat(),
    }).format(val);
};
