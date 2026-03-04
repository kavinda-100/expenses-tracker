import { z } from "zod";
import { ZodIssue } from "zod/v3";

export const formatZodError = (error: ZodIssue[]): string => {
    return error
        .map((err) => {
            const path = err.path.join(".");
            const message = err.message;
            return `${path}: ${message}`;
        })
        .join("; ");
};

export const typeZodSchema = z.enum(["INCOME", "EXPENSE"], {
    error: "Type must be either 'INCOME' or 'EXPENSE'",
});

export type Type = z.infer<typeof typeZodSchema>;
