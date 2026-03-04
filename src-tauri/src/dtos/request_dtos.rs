use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryRequestDto {
    pub name: String,
    pub type_: String, // "INCOME" or "EXPENSE"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransactionRequestDto {
    pub amount: f64,
    pub description: Option<String>,
    pub date: String,  // ISO 8601 format
    pub type_: String, // "INCOME" or "EXPENSE"
    pub category_id: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GetAllTransactionsWithCategoryRequestDto {
    pub start_date: String, // ISO 8601 format
    pub end_date: String,   // ISO 8601 format
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AddBudRequestDto {
    pub amount: f64,
    pub month: u8, // 1-12
    pub year: i32,
    pub category_id: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GetAllBudgetRequestDto {
    pub month: u8, // 1-12
    pub year: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateBudgetRequestDto {
    pub id: i64,
    pub amount: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonthlyOverviewRequestDto {
    pub month: u8, // 1-12
    pub year: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YearlyOverviewRequestDto {
    pub year: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LastMonthHabitsRequestDto {
    pub month: u8, // 1-12
    pub year: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LastYearHabitsRequestDto {
    pub year: i32,
}
