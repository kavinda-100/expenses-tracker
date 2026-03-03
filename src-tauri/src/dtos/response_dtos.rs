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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DashboardOverviewResponseDto {
    pub total_income: f64,
    pub total_expenses: f64,
    pub net_balance: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PastSevenDaysDataResponseDto {
    pub day: String,
    pub total_expense: f64,
    pub total_income: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecentTransactionsResponseDto {
    pub name: String,
    pub amount: f64,
    pub date: String,
    pub type_: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpenseByCategoryResponseDto {
    pub category_name: String,
    pub total_expense: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonthlyOverviewResponseDto {
    pub month: u8,
    pub total_income: f64,
    pub total_expenses: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YearlyOverviewResponseDto {
    pub month: u8,
    pub total_income: f64,
    pub total_expenses: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LastMonthHabitsResponseDto {
    pub category_name: String,
    pub total_amount: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LastYearHabitsResponseDto {
    pub category_name: String,
    pub total_amount: f64,
}
