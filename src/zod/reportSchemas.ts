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

// pub struct MonthlyOverviewResponseDto {
//     pub day: u8,
//     pub total_income: f64,
//     pub total_expenses: f64,
// }

export const MonthlyOverviewZodSchema = z.object({
    day: z.number(),
    total_income: z.number(),
    total_expenses: z.number(),
});

export type MonthlyOverviewType = z.infer<typeof MonthlyOverviewZodSchema>;
