use crate::dtos::request_dtos::CategoryRequestDto;

#[tauri::command]
pub async fn add_category(new_category: CategoryRequestDto) -> Result<String, String> {
    let CategoryRequestDto { name, type_ } = new_category;

    // Validate input
    if name.trim().is_empty() {
        return Err("Category name cannot be empty".to_string());
    }
    if type_ != "INCOME" && type_ != "EXPENSE" {
        return Err("Category type must be either 'INCOME' or 'EXPENSE'".to_string());
    }

    // code soon.

    Ok(format!("Category added successfully with id:"))
}
