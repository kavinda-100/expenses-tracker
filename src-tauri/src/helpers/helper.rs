pub fn get_db_file_path() -> &'static str {
    // Load .env file (this is safe to call multiple times)
    dotenv::dotenv().ok();

    match std::env::var("APP_ENV") {
        Ok(env) if env == "test" => "test.db",
        _ => "crab-ledger.db",
    }
}
