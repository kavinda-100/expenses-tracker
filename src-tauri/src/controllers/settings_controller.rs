use rusqlite::{params, Connection};

use crate::{helpers::helper::get_db_file_path};

/**
 * Clear all data from the database, including transactions, categories, and budgets
 * @return Result<String, String> - Ok(String) if the data was cleared successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn clear_all_data_from_database() -> Result<String, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();
    
    // Open database connection
    let mut conn =
        Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Begin a transaction so that all deletes are atomic
    let tx = conn
        .transaction()
        .map_err(|e| format!("Failed to begin transaction: {}", e))?;

    // Clear all data from the transactions, categories, and budgets tables
    tx.execute("DELETE FROM transactions", params![])
        .map_err(|e| format!("Failed to clear transactions: {}", e))?;
    tx.execute("DELETE FROM categories", params![])
        .map_err(|e| format!("Failed to clear categories: {}", e))?;
    tx.execute("DELETE FROM budgets", params![])
        .map_err(|e| format!("Failed to clear budgets: {}", e))?;

    // Commit the transaction
    tx.commit()
        .map_err(|e| format!("Failed to commit transaction: {}", e))?;

    Ok("All data cleared successfully".to_string())
}
