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

// helper function to convert HSL to HEX color format
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);

    const f = (n: number) =>
        Math.round(
            255 *
                (l -
                    a *
                        Math.max(
                            -1,
                            Math.min(k(n) - 3, Math.min(9 - k(n), 1)),
                        )),
        );

    const r = f(0);
    const g = f(8);
    const b = f(4);

    return (
        "#" +
        [r, g, b]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase()
    );
}

// helper function to generate a palette of blue colors for charts
export function generateBlueChartPalette(count: number): string[] {
    const colors: string[] = [];

    const baseHue = 210; // blue
    const hueSpread = 40; // allow some variation for better distinction

    for (let i = 0; i < count; i++) {
        const ratio = i / count;

        const hue = baseHue - hueSpread / 2 + ratio * hueSpread;
        const saturation = 65 + (i % 3) * 10;
        const lightness = 40 + (i % 4) * 8;

        colors.push(hslToHex(hue, saturation, lightness));
    }

    return colors;
}
