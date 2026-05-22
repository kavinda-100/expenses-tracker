use std::env;
use std::fs;
use std::path::PathBuf;

/**
 * Function to get the full path to the database file based on the environment variable APP_ENV
 * If APP_ENV is set to "test", it returns "test.db" for testing purposes
 * Otherwise, it returns the default path ".crabledger/crab-ledger.db"
 * for ".crabledger/crab-ledger.db", the .crabledger directory is created in the user's home directory and the crab-ledger.db file is stored there. if directory doesn't exist, it will be created when the application runs for the first time and tries to connect to the database. This approach ensures that the database file is stored in a consistent location across different operating systems and user environments.
 * @return &'static str - The full path to the database file as a string slice
 * @example - '/home/user/.crabledger/crab-ledger.db' on Linux/Unix/macOS or 'C:\Users\user\.crabledger\crab-ledger.db' on Windows
 */
pub fn get_db_file_path() -> &'static str {
    // Load .env file (this is safe to call multiple times)
    dotenv::dotenv().ok();

    let db_file_name = match env::var("APP_ENV") {
        Ok(env) if env == "test" => "test.db",
        _ => "crab-ledger.db",
    };

    let home_dir = env::var_os("HOME")
        .or_else(|| env::var_os("USERPROFILE"))
        .map(PathBuf::from)
        .unwrap_or_else(|| {
            eprintln!("Error: Could not determine the user's home directory.");
            panic!("Failed to determine home directory.");
        });

    let app_dir = home_dir.join(".crabledger");
    fs::create_dir_all(&app_dir).unwrap_or_else(|e| {
        eprintln!("Error: Could not create database directory: {}", e);
        panic!("Failed to create database directory.");
    });

    let db_path = app_dir.join(db_file_name);
    let db_path = db_path.to_string_lossy().into_owned();

    Box::leak(db_path.into_boxed_str())
}
