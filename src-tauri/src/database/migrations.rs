use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        // Migration 1: Create Category table
        Migration {
            version: 1,
            description: "Create categories table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    type TEXT NOT NULL CHECK(type IN ('INCOME', 'EXPENSE')),
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
                CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
            "#,
            kind: MigrationKind::Up,
        },
        // Migration 2: Create Transaction table
        Migration {
            version: 2,
            description: "Create transactions table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    amount REAL NOT NULL,
                    description TEXT,
                    date DATETIME NOT NULL,
                    type TEXT NOT NULL CHECK(type IN ('INCOME', 'EXPENSE')),
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    category_id INTEGER NOT NULL,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
                );
                
                CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
                CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
                CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
            "#,
            kind: MigrationKind::Up,
        },
        // Migration 3: Create Budget table
        Migration {
            version: 3,
            description: "Create budgets table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS budgets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    amount REAL NOT NULL,
                    month INTEGER NOT NULL CHECK(month >= 1 AND month <= 12),
                    year INTEGER NOT NULL,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    category_id INTEGER NOT NULL,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
                    UNIQUE(category_id, month, year)
                );
                
                CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
                CREATE INDEX IF NOT EXISTS idx_budgets_month_year ON budgets(month, year);
            "#,
            kind: MigrationKind::Up,
        },
    ]
}
