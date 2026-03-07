import { z } from "zod";

// pub struct ExpenseByCategoryResponseDto {
//     pub category_name: String,
//     pub total_expense: f64,
// }

export const ExpenseByCategoryZodSchema = z.object({
    category_name: z.string(),
    total_expense: z.number(),
});

export type ExpenseByCategoryType = z.infer<typeof ExpenseByCategoryZodSchema>;
