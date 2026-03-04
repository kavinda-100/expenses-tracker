use rusqlite::{params, Connection};

use crate::{
    constants::DB_FILE_NAME,
    dtos::{
        request_dtos::{AddBudgetRequestDto, GetAllBudgetRequestDto, UpdateBudgetRequestDto},
        response_dtos::BudgetResponseDto,
    },
};

/**
 * Add a new budget to the database
 * @param new_budget - The budget data to be added
 * @return Result<String, String> - Ok(String) if the budget was added successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn add_budget(new_budget: AddBudgetRequestDto) -> Result<String, String> {
    let AddBudgetRequestDto {
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

/**
 * Delete a budget from the database
 * @param budget_id - The ID of the budget to be deleted
 * @return Result<String, String> - Ok(String) if the budget was deleted successfully,
 * otherwise an error message is returned as a String
 */
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

/**
 * Get all budgets from the database only for the current month and year
 * @param month - The month for which to retrieve budgets (1-12)
 * @param year - The year for which to retrieve budgets (e.g., 2024)
 * @return Result<Vec<BudgetResponseDto>, String> - Ok(Vec<BudgetResponseDto>) if the budgets were retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_budgets(params: GetAllBudgetRequestDto) -> Result<Vec<BudgetResponseDto>, String> {
    // Open database connection and retrieve budgets
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    // Prepare the SQL statement to select budgets and categories for the specified month and year
    let mut stmt = conn
        .prepare(
            "
            SELECT b.id, b.amount, b.month, b.year, b.category_id, c.name, b.created_at
            FROM budgets b
            JOIN categories c ON b.category_id = c.id
            WHERE b.month = ?1 AND b.year = ?2
        ",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query and map the results to BudgetResponseDto structs
    let budget_iter = stmt
        .query_map(params![params.month, params.year], |row| {
            Ok(BudgetResponseDto {
                id: row.get(0)?,
                amount: row.get(1)?,
                month: row.get(2)?,
                year: row.get(3)?,
                category_id: row.get(4)?,
                category_name: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| format!("Failed to query budgets: {}", e))?;

    // Collect the results into a vector, filtering out any errors
    let budgets: Vec<BudgetResponseDto> = budget_iter
        .collect::<Result<Vec<BudgetResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to map budget results: {}", e))?;

    Ok(budgets)
}

/**
 * Update an existing budget in the database
 * @param updated_budget - The updated budget data, including the ID of the budget to be updated
 * @return Result<String, String> - Ok(String) if the budget was updated successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn update_budget(updated_budget: UpdateBudgetRequestDto) -> Result<String, String> {
    let UpdateBudgetRequestDto { id, amount } = updated_budget;

    // Validate input
    if amount <= 0.0 {
        return Err("Budget amount must be greater than zero".to_string());
    }

    // Open database connection and update budget
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    // Execute the update statement and check how many rows were affected
    let rows_affected = conn
        .execute(
            "UPDATE budgets SET amount = ?1 WHERE id = ?2",
            params![amount, id],
        )
        .map_err(|e| format!("Failed to update budget: {}", e))?;

    // If no rows were affected, it means the budget with the given ID was not found
    if rows_affected == 0 {
        Err(format!("No budget found with id: {}", id))
    } else {
        Ok(format!("Budget with id {} updated successfully", id))
    }
}
