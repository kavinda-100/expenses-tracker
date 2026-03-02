use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
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
