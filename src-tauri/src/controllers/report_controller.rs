use rusqlite::{Connection, Result};

use crate::dtos::request_dtos::{
    LastMonthHabitsRequestDto, LastYearHabitsRequestDto, MonthlyOverviewRequestDto,
    YearlyOverviewRequestDto,
};
use crate::dtos::response_dtos::{
    ExpenseByCategoryResponseDto, IncomeByCategoryResponseDto, LastMonthHabitsResponseDto, LastYearHabitsResponseDto, MonthlyOverviewResponseDto, YearlyOverviewResponseDto
};
use crate::helpers::helper::get_db_file_path;

/**
 * Get total expenses grouped by category for
 * @return Result<Vec<ExpenseByCategoryResponseDto>, String> - Ok(Vec<ExpenseByCategoryResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_expense_by_category() -> Result<Vec<ExpenseByCategoryResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection and query for total income and expenses
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

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
 * Get total income grouped by category for
 * @return Result<Vec<IncomeByCategoryResponseDto>, String> - Ok(Vec<IncomeByCategoryResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_income_by_category() -> Result<Vec<IncomeByCategoryResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection and query for total income and expenses
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query total income grouped by category
    let mut stmt = conn
        .prepare(
            "SELECT c.name, IFNULL(SUM(t.amount), 0) as total_income
        FROM categories c
        LEFT JOIN transactions t ON c.id = t.category_id AND c.type = 'INCOME'
        GROUP BY c.id",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query and map the results to IncomeByCategoryResponseDto structs
    let income_by_category_iter = stmt
        .query_map([], |row| {
            Ok(IncomeByCategoryResponseDto {
                category_name: row.get(0)?,
                total_income: row.get(1)?,
            })
        })
        .map_err(|e| format!("Failed to query income by category: {}", e))?;

    // Collect the results into a vector, handling any mapping errors
    let income_by_category: Vec<IncomeByCategoryResponseDto> = income_by_category_iter
        .collect::<Result<Vec<IncomeByCategoryResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to collect income by category: {}", e))?;

    // Return the total income by category
    Ok(income_by_category)
}

/**
 * Get Monthly Overview of total income, total expenses, for each day in a given month
 * @param MonthlyOverviewRequestDto - month (1-12) and year for which the overview is requested
 * @return Result<Vec<MonthlyOverviewResponseDto>, String> - Ok(Vec<MonthlyOverviewResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_monthly_overview(
    request: MonthlyOverviewRequestDto,
) -> Result<Vec<MonthlyOverviewResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection and query for total income and expenses
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query total income and expenses for each day in the specified month and year
    let mut stmt = conn
        .prepare(
            "SELECT 
                strftime('%d', date) as day,
                IFNULL(SUM(CASE WHEN type = 'INCOME' THEN amount END), 0) as total_income,
                IFNULL(SUM(CASE WHEN type = 'EXPENSE' THEN amount END), 0) as total_expenses
            FROM transactions
            WHERE strftime('%m', date) = ?1 AND strftime('%Y', date) = ?2
            GROUP BY day
            ORDER BY day",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query with the provided month and year parameters
    let overview_iter = stmt
        .query_map(
            [format!("{:02}", request.month), request.year.to_string()],
            |row| {
                Ok(MonthlyOverviewResponseDto {
                    day: row.get::<_, String>(0)?.parse::<u8>().unwrap_or(0),
                    total_income: row.get(1)?,
                    total_expenses: row.get(2)?,
                })
            },
        )
        .map_err(|e| format!("Failed to query monthly overview: {}", e))?;

    // Collect the results into a vector, handling any mapping errors
    let overview: Vec<MonthlyOverviewResponseDto> = overview_iter
        .collect::<Result<Vec<MonthlyOverviewResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to collect monthly overview: {}", e))?;

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
pub fn get_yearly_overview(
    request: YearlyOverviewRequestDto,
) -> Result<Vec<YearlyOverviewResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection and query for total income and expenses
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

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
                total_expenses: row.get(2)?,
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

/**
 * Get spending habits for a specific month - returns top expense categories
 * @param LastMonthHabitsRequestDto - month (1-12) and year for which spending habits are requested
 * @return Result<Vec<LastMonthHabitsResponseDto>, String> - Ok(Vec<LastMonthHabitsResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_last_month_habits(
    request: LastMonthHabitsRequestDto,
) -> Result<Vec<LastMonthHabitsResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query to get total expenses grouped by category for the specified month
    let mut stmt = conn
        .prepare(
            "SELECT c.name, IFNULL(SUM(t.amount), 0) as total_amount
            FROM categories c
            LEFT JOIN transactions t ON c.id = t.category_id 
                AND t.type = 'EXPENSE'
                AND strftime('%m', t.date) = ?1 
                AND strftime('%Y', t.date) = ?2
            WHERE c.type = 'EXPENSE'
            GROUP BY c.id, c.name
            HAVING total_amount > 0
            ORDER BY total_amount DESC",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query with the provided month and year parameters
    let habits_iter = stmt
        .query_map(
            [format!("{:02}", request.month), request.year.to_string()],
            |row| {
                Ok(LastMonthHabitsResponseDto {
                    category_name: row.get(0)?,
                    total_amount: row.get(1)?,
                })
            },
        )
        .map_err(|e| format!("Failed to query last month habits: {}", e))?;

    // Collect the results into a vector, handling any mapping errors
    let habits: Vec<LastMonthHabitsResponseDto> = habits_iter
        .collect::<Result<Vec<LastMonthHabitsResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to collect last month habits: {}", e))?;

    // Return the spending habits data
    Ok(habits)
}

/**
 * Get spending habits for an entire year - returns top expense categories
 * @param LastYearHabitsRequestDto - year for which spending habits are requested
 * @return Result<Vec<LastYearHabitsResponseDto>, String> - Ok(Vec<LastYearHabitsResponseDto>) if the data was retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_last_year_habits(
    request: LastYearHabitsRequestDto,
) -> Result<Vec<LastYearHabitsResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query to get total expenses grouped by category for the specified year
    let mut stmt = conn
        .prepare(
            "SELECT c.name, IFNULL(SUM(t.amount), 0) as total_amount
            FROM categories c
            LEFT JOIN transactions t ON c.id = t.category_id 
                AND t.type = 'EXPENSE'
                AND strftime('%Y', t.date) = ?1
            WHERE c.type = 'EXPENSE'
            GROUP BY c.id, c.name
            HAVING total_amount > 0
            ORDER BY total_amount DESC",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query with the provided year parameter
    let habits_iter = stmt
        .query_map([request.year.to_string()], |row| {
            Ok(LastYearHabitsResponseDto {
                category_name: row.get(0)?,
                total_amount: row.get(1)?,
            })
        })
        .map_err(|e| format!("Failed to query last year habits: {}", e))?;

    // Collect the results into a vector, handling any mapping errors
    let habits: Vec<LastYearHabitsResponseDto> = habits_iter
        .collect::<Result<Vec<LastYearHabitsResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to collect last year habits: {}", e))?;

    // Return the spending habits data
    Ok(habits)
}
