pub mod budget_test;
pub mod category_test;
pub mod report_test;
pub mod transaction_test;

use rusqlite::Connection;
use std::fs;

use crate::constants::DB_FILE_NAME;
use crate::database::migrations::run_migrations;

/// Helper function to set up a test database with schema and mock data
#[allow(dead_code)]
pub fn setup_test_db() -> Connection {
    // Remove existing test database if it exists
    let _ = fs::remove_file(DB_FILE_NAME);

    // Create new test database connection
    let conn = Connection::open(DB_FILE_NAME).expect("Failed to create test database");

    // Run migrations
    run_test_migrations(&conn).expect("Failed to run migrations");

    // Insert mock data
    insert_mock_data(&conn).expect("Failed to insert mock data");

    conn
}

/// Run database migrations for test database
#[allow(dead_code)]
pub fn run_test_migrations(conn: &Connection) -> Result<(), String> {
    // run migrations to ensure the database schema is up to date
    match run_migrations(&conn) {
        Ok(_) => println!("Migrations ran successfully."),
        Err(e) => {
            eprintln!("Error running migrations: {}", e);
            panic!("Failed to run database migrations.");
        }
    };

    Ok(())
}

/// Insert mock test data into the database
#[allow(dead_code)]
fn insert_mock_data(conn: &Connection) -> Result<(), String> {
    // Insert expense categories
    conn.execute(
        "INSERT INTO categories (name, type) VALUES 
                ('Groceries', 'EXPENSE'),
                ('Transportation', 'EXPENSE'),
                ('Entertainment', 'EXPENSE'),
                ('Utilities', 'EXPENSE'),
                ('Healthcare', 'EXPENSE'),
                ('Salary', 'INCOME'),
                ('Freelance', 'INCOME'),
                ('SAAS', 'INCOME'),
                ('Bonuses', 'INCOME'),
                ('Investments', 'INCOME')
                ",
        [],
    )
    .map_err(|e| format!("Failed to insert categories: {}", e))?;

    // Insert transactions for February 2026 (current month based on context)
    conn.execute(
        "INSERT INTO transactions (amount, description, date, type, category_id) VALUES 
                -- February 2026 expenses
                (150.50, 'Weekly groceries', '2026-02-05', 'EXPENSE', 1),
                (200.00, 'Monthly groceries', '2026-02-12', 'EXPENSE', 1),
                (180.75, 'Groceries shopping', '2026-02-20', 'EXPENSE', 1),
                (50.00, 'Gas', '2026-02-08', 'EXPENSE', 2),
                (75.00, 'Public transport pass', '2026-02-01', 'EXPENSE', 2),
                (120.00, 'Movie and dinner', '2026-02-14', 'EXPENSE', 3),
                (80.00, 'Concert tickets', '2026-02-22', 'EXPENSE', 3),
                (200.00, 'Electricity bill', '2026-02-10', 'EXPENSE', 4),
                (100.00, 'Internet', '2026-02-10', 'EXPENSE', 4),
                (250.00, 'Doctor visit', '2026-02-18', 'EXPENSE', 5),
                -- February 2026 income
                (5000.00, 'Monthly salary', '2026-02-28', 'INCOME', 6),
                (1200.00, 'Freelance project', '2026-02-15', 'INCOME', 7),
                (300.00, 'SAAS subscription refund', '2026-02-20', 'INCOME', 8),
                (500.00, 'Year-end bonus', '2026-02-25', 'INCOME', 9),
                (200.00, 'Stock dividends', '2026-02-27', 'INCOME', 10)
                ",
        [],
    )
    .map_err(|e| format!("Failed to insert February transactions: {}", e))?;

    // Insert transactions for 2025 (last year)
    conn.execute(
        "INSERT INTO transactions (amount, description, date, type, category_id) VALUES 
                -- 2025 expenses across different months
                (500.00, 'Monthly groceries', '2025-01-15', 'EXPENSE', 1),
                (450.00, 'Groceries', '2025-02-10', 'EXPENSE', 1),
                (480.00, 'Groceries', '2025-03-12', 'EXPENSE', 1),
                (520.00, 'Groceries', '2025-04-08', 'EXPENSE', 1),
                (300.00, 'Gas expenses', '2025-01-20', 'EXPENSE', 2),
                (250.00, 'Transport', '2025-05-15', 'EXPENSE', 2),
                (180.00, 'Movies', '2025-06-22', 'EXPENSE', 3),
                (220.00, 'Entertainment', '2025-07-10', 'EXPENSE', 3),
                (400.00, 'Bills', '2025-08-05', 'EXPENSE', 4),
                (150.00, 'Medical', '2025-09-12', 'EXPENSE', 5),
                -- 2025 income
                (5000.00, 'Monthly salary', '2025-01-30', 'INCOME', 6),
                (5000.00, 'Monthly salary', '2025-02-28', 'INCOME', 6),
                (1200.00, 'Freelance project', '2025-03-15', 'INCOME', 7),
                (300.00, 'SAAS subscription refund', '2025-04-20', 'INCOME', 8),
                (500.00, 'Year-end bonus', '2025-12-25', 'INCOME', 9),
                (200.00, 'Stock dividends', '2025-11-27', 'INCOME', 10)",
        [],
    )
    .map_err(|e| format!("Failed to insert 2025 transactions: {}", e))?;

    // Insert transactions for January 2026
    conn.execute(
        "INSERT INTO transactions (amount, description, date, type, category_id) VALUES 
                (300.00, 'Groceries', '2026-01-10', 'EXPENSE', 1),
                (100.00, 'Gas', '2026-01-15', 'EXPENSE', 2),
                (5000.00, 'Salary', '2026-01-30', 'INCOME', 6),
                (300.00, 'Freelance project', '2026-01-20', 'INCOME', 7),
                (400.00, 'Year-end bonus', '2026-01-25', 'INCOME', 9),
                (150.00, 'Stock dividends', '2026-01-27', 'INCOME', 10),
                (75.00, 'Electricity bill', '2026-01-12', 'EXPENSE', 4),
                (50.00, 'Internet', '2026-01-12', 'EXPENSE', 4)
                ",
        [],
    )
    .map_err(|e| format!("Failed to insert January 2026 transactions: {}", e))?;

    // Inset Budget for February 2026
    conn.execute(
        "INSERT INTO budgets (amount, month, year, category_id) VALUES
                (500.00, 2, 2026, 1), -- Groceries
                (200.00, 2, 2026, 2), -- Transportation
                (150.00, 2, 2026, 3), -- Entertainment
                (300.00, 2, 2026, 4), -- Utilities
                (250.00, 2, 2026, 5)  -- Healthcare
                ",
        [],
    )
    .map_err(|e| format!("Failed to insert budgets: {}", e))?;

    Ok(())
}

/// Clean up test database
#[allow(dead_code)]
pub fn teardown_test_db() {
    let _ = fs::remove_file(DB_FILE_NAME);
}
