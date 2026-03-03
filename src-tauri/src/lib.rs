use tauri::Manager;

use crate::{controllers::category_controller::{add_category, delete_category}, database::migrations::{connect_to_db, run_migrations}};

mod constants;
mod controllers;
mod database;
mod dtos;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // connect to the database when the application starts
    let connection = match connect_to_db() {
        Ok(conn) => conn,
        Err(e) => {
            eprintln!("Error connecting to the database: {}", e);
            panic!("Failed to connect to the database.");
        }
    };

    // run migrations to ensure the database schema is up to date
    match run_migrations(&connection) {
        Ok(_) => println!("Migrations ran successfully."),
        Err(e) => {
            eprintln!("Error running migrations: {}", e);
            panic!("Failed to run database migrations.");
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, add_category, delete_category])
        .setup(|app| {
            // Set minimum window size constraints
            if let Some(window) = app.get_webview_window("main") {
                use tauri::{PhysicalSize, Size};
                // Use physical pixels for more reliable constraints
                let min_size = Size::Physical(PhysicalSize {
                    width: 1000,
                    height: 700,
                });
                let _ = window.set_min_size(Some(min_size));
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
