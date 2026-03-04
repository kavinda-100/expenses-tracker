use rusqlite::{Connection, Result};

use crate::{dtos::response_dtos::{
    DashboardOverviewResponseDto, PastSevenDaysDataResponseDto, RecentTransactionsResponseDto,
}, helpers::helper::get_db_file_path};

/**
 * Get an overview of the dashboard, including total income, total expenses, and net balance
 * @return Result<DashboardOverviewResponseDto, String> - Ok(DashboardOverviewResponseDto) if the overview was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_dashboard_overview() -> Result<DashboardOverviewResponseDto, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();
    
    // Open database connection and query for total income and expenses
    let conn =
        Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query total income
    let total_income: f64 = conn
        .query_row(
            "SELECT IFNULL(SUM(amount), 0) FROM transactions t JOIN categories c ON t.category_id = c.id WHERE c.type = 'INCOME'",
            [],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to query total income: {}", e))?;

    // Query total expenses
    let total_expenses: f64 = conn
        .query_row(
            "SELECT IFNULL(SUM(amount), 0) FROM transactions t JOIN categories c ON t.category_id = c.id WHERE c.type = 'EXPENSE'",
            [],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to query total expenses: {}", e))?;

    // Calculate net balance
    let net_balance = total_income - total_expenses;

    Ok(DashboardOverviewResponseDto {
        total_income,
        total_expenses,
        net_balance,
    })
}

/**
 * Get total income and expenses for the past 7 days, grouped by day
 * @return Result<Vec<PastSevenDaysDataResponseDto>, String> - Ok(Vec<PastSevenDaysDataResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_past_seven_days_data() -> Result<Vec<PastSevenDaysDataResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection and query for total income and expenses for the past 7 days
    let conn =
        Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query total income and expenses for the past 7 days, grouped by day
    let mut stmt = conn
        .prepare(
            "SELECT
                DATE(date) as day,
                IFNULL(SUM(CASE WHEN c.type = 'EXPENSE' THEN amount END), 0) as total_expense,
                IFNULL(SUM(CASE WHEN c.type = 'INCOME' THEN amount END), 0) as total_income
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE date >= DATE('now', '-6 days')
            GROUP BY day
            ORDER BY day ASC;",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query and map the results to PastSevenDaysDataResponseDto structs
    let data_iter = stmt
        .query_map([], |row| {
            Ok(PastSevenDaysDataResponseDto {
                day: row.get(0)?,
                total_expense: row.get(1)?,
                total_income: row.get(2)?,
            })
        })
        .map_err(|e| format!("Failed to query past seven days data: {}", e))?;

    // Collect the results into a vector
    let data: Vec<PastSevenDaysDataResponseDto> = data_iter
        .collect::<Result<Vec<PastSevenDaysDataResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to map past seven days data: {}", e))?;

    // Return the vector of past seven days data
    Ok(data)
}

/**
 * Get recent transactions for the dashboard, with optional filters for type and category
 * @param amount - The maximum number of transactions to retrieve (default is 5)
 * @return Result<Vec<RecentTransactionsResponseDto>, String> - Ok(Vec<RecentTransactionsResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_recent_transactions(
    limit: Option<u8>,
) -> Result<Vec<RecentTransactionsResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();
    
    // Default to 5 transactions if no limit is provided
    let limit = match limit {
        Some(v) => v,
        None => 5,
    };

    // Open database connection and query for recent transactions
    let conn =
        Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query recent transactions, joining with categories to get the category name
    let mut stmt = conn
        .prepare(
            "SELECT t.description, t.amount, t.date, t.type, c.name
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            ORDER BY t.date DESC
            LIMIT ?1;",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query and map the results to RecentTransactionsResponseDto structs
    let transaction_iter = stmt
        .query_map([limit], |row| {
            Ok(RecentTransactionsResponseDto {
                name: row.get(0)?,
                amount: row.get(1)?,
                date: row.get(2)?,
                type_: row.get(3)?,
            })
        })
        .map_err(|e| format!("Failed to query recent transactions: {}", e))?;

    // Collect the results into a vector
    let transactions: Vec<RecentTransactionsResponseDto> = transaction_iter
        .collect::<Result<Vec<RecentTransactionsResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to map recent transactions: {}", e))?;

    // Return the vector of recent transactions
    Ok(transactions)
}
