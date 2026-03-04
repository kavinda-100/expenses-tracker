use rusqlite::Connection;

use crate::helpers::helper::get_db_file_path;

/**
 * Connect to the SQLite database
 * @return Result<Connection, String> - Ok(Connection) if the connection was successful,
 * otherwise an error message is returned as a String
 */
pub fn connect_to_db() -> Result<Connection, String> {
    // Get the path to the database file
    let db_file = get_db_file_path();
    // Attempt to open a connection to the SQLite database file

    // one way to handle the error is using the map_err method to convert the rusqlite::Error into a String
    // let conn = Connection::open(db_file);
    // .map_err(|e| format!("Failed to connect to database: {}", e))?;

    let conn = Connection::open(db_file);

    match conn {
        Ok(conn) => Ok(conn),
        Err(e) => Err(format!("Failed to connect to database: {}", e)),
    }
}

/**
 * Create all migrations for the database schema
 * @param conn - The database connection
 * @return Result<(), String> - Ok(()) if the migrations ran successfully,
 * otherwise an error message is returned as a String
 */
pub fn run_migrations(conn: &Connection) -> Result<(), String> {
    // Enable foreign key constraints
    conn.execute("PRAGMA foreign_keys = ON;", [])
        .map_err(|e| format!("Failed to enable foreign keys: {}", e))?;

    // Migration 1: Create categories table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            type TEXT NOT NULL CHECK(type IN ('INCOME', 'EXPENSE')),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );",
        [],
    )
    .map_err(|e| format!("Failed to create categories table: {}", e))?;

    // Create indexes for categories table
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);",
        [],
    )
    .map_err(|e| format!("Failed to create categories type index: {}", e))?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);",
        [],
    )
    .map_err(|e| format!("Failed to create categories name index: {}", e))?;

    // Migration 2: Create transactions table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            description TEXT,
            date DATETIME NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('INCOME', 'EXPENSE')),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            category_id INTEGER NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );",
        [],
    )
    .map_err(|e| format!("Failed to create transactions table: {}", e))?;

    // Create indexes for transactions table
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);",
        [],
    )
    .map_err(|e| format!("Failed to create transactions category_id index: {}", e))?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);",
        [],
    )
    .map_err(|e| format!("Failed to create transactions date index: {}", e))?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);",
        [],
    )
    .map_err(|e| format!("Failed to create transactions type index: {}", e))?;

    // Migration 3: Create budgets table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            month INTEGER NOT NULL CHECK(month >= 1 AND month <= 12),
            year INTEGER NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            category_id INTEGER NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
            UNIQUE(category_id, month, year)
        );",
        [],
    )
    .map_err(|e| format!("Failed to create budgets table: {}", e))?;

    // Create indexes for budgets table
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);",
        [],
    )
    .map_err(|e| format!("Failed to create budgets category_id index: {}", e))?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_budgets_month_year ON budgets(month, year);",
        [],
    )
    .map_err(|e| format!("Failed to create budgets month_year index: {}", e))?;

    println!("✅ All database migrations completed successfully!");
    Ok(())
}
