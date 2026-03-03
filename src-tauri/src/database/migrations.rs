use rusqlite::Connection;


/**
 * Connect to the SQLite database
 * @return Result<Connection, String> - Ok(Connection) if the connection was successful,
 * otherwise an error message is returned as a String
 */
pub fn connect_to_db() -> Result<Connection, String> {
    // Attempt to open a connection to the SQLite database file "crab-ledger.db"
    let db_file = "crab-ledger.db";

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
 * @return Result<(), String> - Ok(()) if the table was created successfully,
 * otherwise an error message is returned as a String
 */
pub fn run_migrations(conn: &Connection) -> Result<(), String> {
    // Example migration: Create a "categories" table if it doesn't exist
    let migrations = "
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
    ";

    conn.execute(migrations, [])
        .map_err(|e| format!("Failed to run migrations: {}", e))?;

    Ok(())
}