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
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    conn.execute(
        "INSERT INTO categories (name, type) VALUES (?1, ?2)",
        params![name, type_],
    )
    .map_err(|e| format!("Failed to add category: {}", e))?;

    let last_id = conn.last_insert_rowid();

    Ok(format!("Category added successfully with id: {}", last_id))
}

#[tauri::command]
pub fn delete_category(category_id: i64) -> Result<String, String> {
    // Open database connection and delete category
    let conn =
        Connection::open(DB_FILE_NAME).map_err(|e| format!("Failed to open database: {}", e))?;

    let rows_affected = conn
        .execute("DELETE FROM categories WHERE id = ?1", params![category_id])
        .map_err(|e| format!("Failed to delete category: {}", e))?;

    if rows_affected == 0 {
        Err(format!("No category found with id: {}", category_id))
    } else {
        Ok(format!(
            "Category with id {} deleted successfully",
            category_id
        ))
    }
}
