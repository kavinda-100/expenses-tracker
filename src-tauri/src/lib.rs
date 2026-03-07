use tauri::Manager;

use crate::{
    controllers::{
        budget_controller::{add_budget, delete_budget, get_budgets, update_budget},
        category_controller::{
            add_category, delete_category, get_all_categories, get_categories_names,
            update_category,
        },
        dashboard_controller::{
            get_dashboard_overview, get_past_seven_days_data, get_recent_transactions,
        },
        report_controller::{
            get_expense_by_category, get_income_by_category, get_last_month_habits, get_last_year_habits, get_monthly_overview, get_yearly_overview
        },
        settings_controller::clear_all_data_from_database,
        transaction_controller::{
            add_transaction, delete_transaction, get_all_transactions_with_category,
        },
    },
    database::migrations::{connect_to_db, run_migrations},
};

mod constants;
mod controllers;
mod database;
mod dtos;
mod helpers;
mod tests;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // connect to the database when the application starts
    let mut connection = match connect_to_db() {
        Ok(conn) => conn,
        Err(e) => {
            println!("Error connecting to the database: {}", e);
            panic!("Failed to connect to the database.");
        }
    };

    // run migrations to ensure the database schema is up to date
    match run_migrations(&mut connection) {
        Ok(_) => println!("Migrations ran successfully."),
        Err(e) => {
            eprintln!("Error running migrations: {}", e);
            // panic!("Failed to run database migrations.");
        }
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            add_category,
            delete_category,
            get_all_categories,
            get_categories_names,
            update_category,
            add_transaction,
            delete_transaction,
            get_all_transactions_with_category,
            add_budget,
            delete_budget,
            get_budgets,
            update_budget,
            get_dashboard_overview,
            get_past_seven_days_data,
            get_recent_transactions,
            get_expense_by_category,
            get_income_by_category,
            get_monthly_overview,
            get_yearly_overview,
            get_last_month_habits,
            get_last_year_habits,
            clear_all_data_from_database
        ])
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
