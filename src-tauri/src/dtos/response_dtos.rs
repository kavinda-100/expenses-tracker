use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryResponseDto {
    pub id: i64,
    pub name: String,
    pub type_: String,      // "INCOME" or "EXPENSE"
    pub created_at: String, // ISO 8601 format
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BudgetResponseDto {
    pub id: i64,
    pub amount: f64,
    pub month: u8, // 1-12
    pub year: i32,
    pub category_id: i64,
    pub created_at: String, // ISO 8601 format
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransactionWithCategoryResponseDto {
    pub id: i64,
    pub amount: f64,
    pub description: Option<String>,
    pub date: String,  // ISO 8601 format
    pub type_: String, // "INCOME" or "EXPENSE"
    pub category_id: i64,
    pub category_name: String,
    pub created_at: String, // ISO 8601 format
}
