import { z } from "zod";
import { typeZodSchema } from ".";

export const categoryZodSchema = z.object({
    id: z.string().min(1, "Category ID is required"),
    name: z.string().min(1, "Category name is required"),
    type: typeZodSchema,
    created_at: z.string().min(1, "Creation date is required"),
});

export type CategoryType = z.infer<typeof categoryZodSchema>;

export const createCategoryZodSchema = z.object({
    name: z.string().min(1, "Category name is required"),
    type: typeZodSchema,
});

export type CreateCategoryInputType = z.infer<typeof createCategoryZodSchema>;
