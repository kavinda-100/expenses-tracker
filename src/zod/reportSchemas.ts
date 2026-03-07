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

// pub struct IncomeByCategoryResponseDto {
//     pub category_name: String,
//     pub total_income: f64,
// }

export const IncomeByCategoryZodSchema = z.object({
    category_name: z.string(),
    total_income: z.number(),
});

export type IncomeByCategoryType = z.infer<typeof IncomeByCategoryZodSchema>;
