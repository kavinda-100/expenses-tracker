use rusqlite::{params, Connection};

use crate::constants::DB_FILE_NAME;
use crate::dtos::request_dtos::CategoryRequestDto;

#[tauri::command]
pub fn add_category(new_category: CategoryRequestDto) -> Result<String, String> {
    let CategoryRequestDto { name, type_ } = new_category;

    // Validate input
    if name.trim().is_empty() {
        return Err("Category name cannot be empty".to_string());
    }
    if type_ != "INCOME" && type_ != "EXPENSE" {
        return Err("Category type must be either 'INCOME' or 'EXPENSE'".to_string());
    }

    // Open database connection and insert category
    let conn = Connection::open(DB_FILE_NAME)
        .map_err(|e| format!("Failed to open database: {}", e))?;

    conn.execute(
        "INSERT INTO categories (name, type) VALUES (?1, ?2)",
        params![name, type_],
    )
    .map_err(|e| format!("Failed to add category: {}", e))?;

    let last_id = conn.last_insert_rowid();

    Ok(format!("Category added successfully with id: {}", last_id))
}
