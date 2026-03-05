import { z } from "zod";

export const budgetZodSchema = z.object({
    id: z.number().int().positive("Budget ID must be positive"),
    amount: z.number().positive("Budget amount must be positive"),
    month: z
        .number()
        .int()
        .min(1, "Month must be between 1 and 12")
        .max(12, "Month must be between 1 and 12"),
    year: z
        .number()
        .int()
        .min(1900, "Year must be a valid year")
        .max(2100, "Year must be a valid year"),
    category_id: z.number().int().positive("Category ID must be positive"),
    category_name: z.string().min(1, "Category name is required"),
    spent_amount: z.number().nonnegative("Spent amount cannot be negative"),
    created_at: z.string().min(1, "Creation date is required"),
});

export type BudgetType = z.infer<typeof budgetZodSchema>;

export const createBudgetZodSchema = z.object({
    amount: z.number().positive("Budget amount must be positive"),
    month: z
        .number()
        .int()
        .min(1, "Month must be between 1 and 12")
        .max(12, "Month must be between 1 and 12"),
    year: z
        .number()
        .int()
        .min(1900, "Year must be a valid year")
        .max(2100, "Year must be a valid year"),
    category_id: z.number().int().positive("Category ID must be positive"),
});

export type CreateBudgetInputType = z.infer<typeof createBudgetZodSchema>;
