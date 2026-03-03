use rusqlite::{Connection, Result};

use crate::constants::DB_FILE_NAME;
use crate::dtos::response_dtos::ExpenseByCategoryResponseDto;

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
