use rusqlite::{Connection, Result};

use crate::constants::DB_FILE_NAME;
use crate::dtos::response_dtos::{ExpenseByCategoryResponseDto, MonthlyOverviewResponseDto, YearlyOverviewResponseDto};
use crate::dtos::request_dtos::{    MonthlyOverviewRequestDto, YearlyOverviewRequestDto};

/**
 * Get total expenses grouped by category
 * @return Result<Vec<ExpenseByCategoryResponseDto>, String> - Ok(Vec<ExpenseByCategoryResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_expense_by_category() -> Result<Vec<ExpenseByCategoryResponseDto>, String> {
    // Open database connection and query for total income and expenses
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query total expenses grouped by category
    let mut stmt = conn
        .prepare(
            "SELECT c.name, IFNULL(SUM(t.amount), 0) as total_expense
        FROM categories c
        LEFT JOIN transactions t ON c.id = t.category_id AND c.type = 'EXPENSE'
        GROUP BY c.id",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query and map the results to ExpenseByCategoryResponseDto structs
    let expense_by_category_iter = stmt
        .query_map([], |row| {
            Ok(ExpenseByCategoryResponseDto {
                category_name: row.get(0)?,
                total_expense: row.get(1)?,
            })
        })
        .map_err(|e| format!("Failed to query expenses by category: {}", e))?;

    // Collect the results into a vector, handling any mapping errors
    let expense_by_category: Vec<ExpenseByCategoryResponseDto> = expense_by_category_iter
        .collect::<Result<Vec<ExpenseByCategoryResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to collect expenses by category: {}", e))?;

    // Return the total expenses by category
    Ok(expense_by_category)
}

/**
 * Get Monthly Overview of total income, total expenses, for given month
 * @param MonthlyOverviewRequestDto - month (1-12) and year for which the overview is requested
 * @return Result<MonthlyOverviewResponseDto, String> - Ok(MonthlyOverviewResponseDto) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_monthly_overview(request: MonthlyOverviewRequestDto) -> Result<MonthlyOverviewResponseDto, String> {

    // Open database connection and query for total income and expenses
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query total income and expenses for the specified month and year
    let mut stmt = conn
        .prepare(
            "SELECT 
                IFNULL(SUM(CASE WHEN type = 'INCOME' THEN amount END), 0) as total_income,
                IFNULL(SUM(CASE WHEN type = 'EXPENSE' THEN amount END), 0) as total_expenses
            FROM transactions
            WHERE strftime('%m', date) = ?1 AND strftime('%Y', date) = ?2",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query with the provided month and year parameters
    let overview = stmt
        .query_row(
            [format!("{:02}", request.month), request.year.to_string()],
            |row| {
                Ok(MonthlyOverviewResponseDto {
                    month: request.month,
                    total_income: row.get(0)?,
                    total_expenses: row.get(1)?
                })
            },
        )
        .map_err(|e| format!("Failed to query monthly overview: {}", e))?;

    // Return the monthly overview data
    Ok(overview)
}

/**
 * Get the Overview of total income, total expenses, for every month in a given year
 * @param YearlyOverviewRequestDto - year for which the overview is requested
 * @return Result<Vec<YearlyOverviewResponseDto>, String> - Ok(Vec<YearlyOverviewResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_yearly_overview(request: YearlyOverviewRequestDto) -> Result<Vec<YearlyOverviewResponseDto>, String> {
    // Open database connection and query for total income and expenses
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query total income and expenses for each month in the specified year
    let mut stmt = conn
        .prepare(
            "SELECT 
                strftime('%m', date) as month,
                IFNULL(SUM(CASE WHEN type = 'INCOME' THEN amount END), 0) as total_income,
                IFNULL(SUM(CASE WHEN type = 'EXPENSE' THEN amount END), 0) as total_expenses
            FROM transactions
            WHERE strftime('%Y', date) = ?1
            GROUP BY month
            ORDER BY month",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query with the provided year parameter and map results to YearlyOverviewResponseDto structs
    let yearly_overview_iter = stmt
        .query_map([request.year.to_string()], |row| {
            Ok(YearlyOverviewResponseDto {
                month: row.get::<_, String>(0)?.parse::<u8>().unwrap_or(0),
                total_income: row.get(1)?,
                total_expenses: row.get(2)?
            })
        })
        .map_err(|e| format!("Failed to query yearly overview: {}", e))?;

    // Collect the results into a vector, handling any mapping errors
    let yearly_overview: Vec<YearlyOverviewResponseDto> = yearly_overview_iter
        .collect::<Result<Vec<YearlyOverviewResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to collect yearly overview: {}", e))?;

    // Return the yearly overview data
    Ok(yearly_overview)
}