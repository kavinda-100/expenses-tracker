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
