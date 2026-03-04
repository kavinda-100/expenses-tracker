use rusqlite::{params, Connection};

use crate::{
    constants::DB_FILE_NAME,
    dtos::{
        request_dtos::{GetAllTransactionsWithCategoryRequestDto, TransactionRequestDto}, response_dtos::TransactionWithCategoryResponseDto,
    },
};

/**
 * Add a new transaction to the database
 * @param new_transaction - The transaction data to be added, represented as a TransactionRequestDto
 * @return Result<String, String> - Ok(String) if the transaction was added successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn add_transaction(new_transaction: TransactionRequestDto) -> Result<String, String> {
    // Destructure the TransactionRequestDto to get the individual fields
    let TransactionRequestDto {
        amount,
        description,
        date,
        type_,
        category_id,
    } = new_transaction;

    // Validate input
    if amount <= 0.0 {
        return Err("Transaction amount must be greater than zero".to_string());
    }
    if type_ != "INCOME" && type_ != "EXPENSE" {
        return Err("Transaction type must be either 'INCOME' or 'EXPENSE'".to_string());
    }
    if date.trim().is_empty() {
        return Err("Transaction date cannot be empty".to_string());
    }

    // Open database connection and insert transaction
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    // Example of inserting a transaction (you would replace this with actual transaction data)
    conn.execute(
        "INSERT INTO transactions (amount, description, date, type, category_id) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![amount, description, date, type_, category_id],
    )
    .map_err(|e| format!("Failed to add transaction: {}", e))?;

    // Get the ID of the newly inserted transaction
    let last_id = conn.last_insert_rowid();

    // Return a success message with the new transaction ID
    Ok(format!(
        "Transaction added successfully with id: {}",
        last_id
    ))
}

/**
 * Delete a transaction from the database by its ID
 * @param transaction_id - The ID of the transaction to be deleted
 * @return Result<String, String> - Ok(String) if the transaction was deleted successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn delete_transaction(transaction_id: i64) -> Result<String, String> {
    // Open database connection and delete transaction
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    // Execute the delete statement and check how many rows were affected
    let rows_affected = conn
        .execute(
            "DELETE FROM transactions WHERE id = ?1",
            params![transaction_id],
        )
        .map_err(|e| format!("Failed to delete transaction: {}", e))?;

    // If no rows were affected, it means the transaction with the given ID was not found
    if rows_affected == 0 {
        Err(format!("No transaction found with id: {}", transaction_id))
    } else {
        Ok(format!(
            "Transaction with id {} deleted successfully",
            transaction_id
        ))
    }
}

/**
 * Get all transactions from the database in a specific date range with category information
 * @param params - The request parameters containing the start and end dates for filtering transactions, represented as a GetAllTransactionsWithCategoryRequestDto (ISO 8601 format)
 * @return Result<Vec<TransactionWithCategory>, String> - Ok(Vec<TransactionWithCategory>) if the transactions were retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_all_transactions_with_category(
    params: GetAllTransactionsWithCategoryRequestDto
) -> Result<Vec<TransactionWithCategoryResponseDto>, String> {
    // Destructure the GetAllTransactionsWithCategoryRequestDto to get the start and end dates
    let GetAllTransactionsWithCategoryRequestDto { start_date, end_date } = params;

    // Validate input
    if start_date.trim().is_empty() || end_date.trim().is_empty() {
        return Err("Start date and end date cannot be empty".to_string());
    }

    // Open database connection
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    // Query to get transactions with category information in the specified date range
    let mut stmt = conn
        .prepare(
            "SELECT t.id, t.amount, t.description, t.date, t.type, c.id AS category_id, c.name AS category_name, t.created_at
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE date(t.date) BETWEEN date(?1) AND date(?2)
             ORDER BY date(t.date) DESC;",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query and map the results to TransactionWithCategoryResponseDto structs
    let transaction_iter = stmt
        .query_map(params![start_date, end_date], |row| {
            Ok(TransactionWithCategoryResponseDto {
                id: row.get(0)?,
                amount: row.get(1)?,
                description: row.get(2)?,
                date: row.get(3)?,
                type_: row.get(4)?,
                category_id: row.get(5)?,
                category_name: row.get(6)?,
                created_at: row.get(7)?,
            })
        })
        .map_err(|e| format!("Failed to query transactions: {}", e))?;

    // Collect the results into a vector, handling any mapping errors
    let transactions_with_category: Vec<TransactionWithCategoryResponseDto> = transaction_iter
        .collect::<Result<Vec<TransactionWithCategoryResponseDto>, rusqlite::Error>>()
        .map_err(|e| format!("Failed to collect transactions: {}", e))?;

    Ok(transactions_with_category)
}
