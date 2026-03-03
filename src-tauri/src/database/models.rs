
#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct Category {
    pub name: String,
    pub type_: String, // "INCOME" or "EXPENSE"
}

#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct Transaction {
    pub amount: f64,
    pub description: Option<String>,
    pub date: String, // ISO 8601 format
    pub type_: String, // "INCOME" or "EXPENSE"
    pub category_id: i64,
}

#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct Budget {
    pub amount: f64,
    pub month: u8, // 1-12
    pub year: i32,
    pub category_id: i64,
}