import { z } from "zod";
import { typeZodSchema } from ".";

// pub struct TransactionRequestDto {
//     pub amount: f64,
//     pub description: Option<String>,
//     pub date: String, // ISO 8601 format
//     #[serde(rename = "type")]
//     pub type_: String, // "INCOME" or "EXPENSE"
//     pub category_id: i64,
// }

export const TransactionZodSchema = z.object({
    amount: z
        .number({ error: "Amount must is required" })
        .positive({ error: "Amount must be a positive number" })
        .min(0.01, { message: "Amount must be at least 0.01" }),
    description: z.string().optional(),
    date: z.string(), // ISO 8601 format
    type: typeZodSchema,
    category_id: z.number().int(),
});

export type TransactionType = z.infer<typeof TransactionZodSchema>;

// pub struct TransactionWithCategoryResponseDto {
//     pub id: i64,
//     pub amount: f64,
//     pub description: Option<String>,
//     pub date: String, // ISO 8601 format
//     #[serde(rename = "type")]
//     pub type_: String, // "INCOME" or "EXPENSE"
//     pub category_id: i64,
//     pub category_name: String,
//     pub created_at: String, // ISO 8601 format
// }

export const TransactionWithCategoryZodSchema = z.object({
    id: z.number().int(),
    amount: z
        .number({ error: "Amount must is required" })
        .positive({ error: "Amount must be a positive number" })
        .min(0.01, { message: "Amount must be at least 0.01" }),
    description: z.string().optional(),
    date: z.string(), // ISO 8601 format
    type: typeZodSchema,
    category_id: z.number().int(),
    category_name: z.string(),
    created_at: z.string(), // ISO 8601 format
});

export type TransactionWithCategoryType = z.infer<
    typeof TransactionWithCategoryZodSchema
>;
