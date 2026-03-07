import { z } from "zod";

// pub struct DashboardOverviewResponseDto {
//     pub total_income: f64,
//     pub total_expenses: f64,
//     pub net_balance: f64,
// }

export const DashboardOverviewZodSchema = z.object({
    total_income: z.number(),
    total_expenses: z.number(),
    net_balance: z.number(),
});

export type DashboardOverviewType = z.infer<typeof DashboardOverviewZodSchema>;

// pub struct PastSevenDaysDataResponseDto {
//     pub day: String,
//     pub total_expense: f64,
//     pub total_income: f64,
// }

export const PastSevenDaysDataZodSchema = z.object({
    day: z.string(),
    total_expense: z.number(),
    total_income: z.number(),
});

export type PastSevenDaysDataType = z.infer<typeof PastSevenDaysDataZodSchema>;
