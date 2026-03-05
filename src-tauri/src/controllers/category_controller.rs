use crate::dtos::response_dtos::CategoryResponseDto;
use crate::dtos::{request_dtos::CategoryRequestDto, response_dtos::GetCategoryNamesResponseDto};
use crate::helpers::helper::get_db_file_path;
use rusqlite::{params, Connection};

/**
 * Add a new category to the database
 * @param new_category - The category data to be added
 * @return Result<String, String> - Ok(String) if the category was added successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn add_category(new_category: CategoryRequestDto) -> Result<String, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    let CategoryRequestDto { name, type_ } = new_category;

    // Validate input
    if name.trim().is_empty() {
        return Err("Category name cannot be empty".to_string());
    }
    if type_ != "INCOME" && type_ != "EXPENSE" {
        return Err("Category type must be either 'INCOME' or 'EXPENSE'".to_string());
    }

    // Open database connection and insert category
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Execute the insert statement and handle any errors
    conn.execute(
        "INSERT INTO categories (name, type) VALUES (?1, ?2)",
        params![name, type_],
    )
    .map_err(|e| format!("Failed to add category: {}", e))?;

    // Get the ID of the newly inserted category
    let last_id = conn.last_insert_rowid();

    // Return a success message with the new category ID
    Ok(format!("Category added successfully with id: {}", last_id))
}

/**
 * Delete a category from the database
 * @param category_id - The ID of the category to be deleted
 * @return Result<String, String> - Ok(String) if the category was deleted successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn delete_category(category_id: i64) -> Result<String, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection and delete category
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Execute the delete statement and check how many rows were affected
    let rows_affected = conn
        .execute("DELETE FROM categories WHERE id = ?1", params![category_id])
        .map_err(|e| format!("Failed to delete category: {}", e))?;

    // If no rows were affected, it means the category with the given ID was not found
    if rows_affected == 0 {
        Err(format!("No category found with id: {}", category_id))
    } else {
        Ok(format!(
            "Category with id {} deleted successfully",
            category_id
        ))
    }
}

/**
 * Get all categories from the database
 * @return Result<Vec<CategoryResponseDto>, String> - Ok(Vec<CategoryResponseDto>) if the categories were retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_all_categories() -> Result<Vec<CategoryResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection and query categories
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Prepare the SQL statement to select all categories
    let mut stmt = conn
        .prepare("SELECT id, name, type, created_at FROM categories")
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query and map the results to CategoryResponseDto structs
    let category_iter = stmt
        .query_map([], |row| {
            Ok(CategoryResponseDto {
                id: row.get(0)?,
                name: row.get(1)?,
                type_: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .map_err(|e| format!("Failed to query categories: {}", e))?;

    // Collect the results into a vector
    let categories: Vec<CategoryResponseDto> =
        category_iter // Filter out any errors while mapping
            .collect::<Result<Vec<CategoryResponseDto>, rusqlite::Error>>()
            .map_err(|e| format!("Failed to map categories: {}", e))?;

    // Return the vector of categories
    Ok(categories)
}

/**
 * Get all category names from the database
 * @return Result<Vec<GetCategoryNamesResponseDto>, String> - Ok(Vec<GetCategoryNamesResponseDto>) if the category names were retrieved successfully,
 * otherwise an error message is returned as a String
 */
#[tauri::command]
pub fn get_categories_names() -> Result<Vec<GetCategoryNamesResponseDto>, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();

    // Open database connection and query category names
    let conn = Connection::open(db_file).map_err(|e| format!("Failed to open database: {}", e))?;

    // Prepare the SQL statement to select category names
    let mut stmt = conn
        .prepare("SELECT id, name FROM categories")
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    // Execute the query and map the results to a vector of strings
    let category_iter = stmt
        .query_map([], |row| {
            Ok(GetCategoryNamesResponseDto {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .map_err(|e| format!("Failed to query category names: {}", e))?;

    // Collect the results into a vector
    let category_names: Vec<GetCategoryNamesResponseDto> =
        category_iter // Filter out any errors while mapping
            .collect::<Result<Vec<GetCategoryNamesResponseDto>, rusqlite::Error>>()
            .map_err(|e| format!("Failed to map category names: {}", e))?;

    // Return the vector of category names
    Ok(category_names)
}
