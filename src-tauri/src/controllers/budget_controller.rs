use rusqlite::{params, Connection};

use crate::{constants::DB_FILE_NAME, dtos::request_dtos::BudgetRequestDto};

#[tauri::command]
pub fn add_budget(new_budget: BudgetRequestDto) -> Result<String, String> {
    let BudgetRequestDto {
        amount,
        month,
        year,
        category_id,
    } = new_budget;

    // Validate input
    if amount <= 0.0 {
        return Err("Budget amount must be greater than zero".to_string());
    }
    if month < 1 || month > 12 {
        return Err("Month must be between 1 and 12".to_string());
    }
    if year < 1900 || year > 2100 {
        return Err("Year must be between 1900 and 2100".to_string());
    }

    // Open database connection and insert budget
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    conn.execute(
        "INSERT INTO budgets (amount, month, year, category_id) VALUES (?1, ?2, ?3, ?4)",
        params![amount, month, year, category_id],
    )
    .map_err(|e| format!("Failed to add budget: {}", e))?;

    let last_id = conn.last_insert_rowid();

    Ok(format!("Budget added successfully with id: {}", last_id))
}

#[tauri::command]
pub fn delete_budget(budget_id: i64) -> Result<String, String> {
    // Open database connection and delete budget
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    let rows_affected = conn
        .execute("DELETE FROM budgets WHERE id = ?1", params![budget_id])
        .map_err(|e| format!("Failed to delete budget: {}", e))?;

    if rows_affected == 0 {
        Err(format!("No budget found with id: {}", budget_id))
    } else {
        Ok(format!("Budget with id {} deleted successfully", budget_id))
    }
}
