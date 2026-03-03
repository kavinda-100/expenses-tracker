use rusqlite::{params, Connection};

use crate::{constants::DB_FILE_NAME, dtos::request_dtos::TransactionRequestDto};

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

    let last_id = conn.last_insert_rowid();

    Ok(format!(
        "Transaction added successfully with id: {}",
        last_id
    ))
}

#[tauri::command]
pub fn delete_transaction(transaction_id: i64) -> Result<String, String> {
    // Open database connection and delete transaction
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    let rows_affected = conn
        .execute(
            "DELETE FROM transactions WHERE id = ?1",
            params![transaction_id],
        )
        .map_err(|e| format!("Failed to delete transaction: {}", e))?;

    if rows_affected == 0 {
        Err(format!("No transaction found with id: {}", transaction_id))
    } else {
        Ok(format!(
            "Transaction with id {} deleted successfully",
            transaction_id
        ))
    }
}
