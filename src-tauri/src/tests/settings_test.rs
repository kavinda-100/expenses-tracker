#[cfg(test)]
mod settings_test {
    use crate::controllers::settings_controller::clear_all_data_from_database;
    use crate::tests::{setup_test_db, teardown_test_db};

    #[test]
    fn test_clear_all_data() {
        let conn = setup_test_db();

        // Clear all data from the database
        let result = clear_all_data_from_database();

        assert!(result.is_ok());
        let message = result.ok().unwrap();
        assert_eq!(message, "All data cleared successfully");

        // Verify that all tables are empty
        let category_count: i64 = conn
            .query_row("SELECT COUNT(*) FROM categories", [], |row| row.get(0))
            .expect("Failed to count categories");
        let transaction_count: i64 = conn
            .query_row("SELECT COUNT(*) FROM transactions", [], |row| row.get(0))
            .expect("Failed to count transactions");
        let budget_count: i64 = conn
            .query_row("SELECT COUNT(*) FROM budgets", [], |row| row.get(0))
            .expect("Failed to count budgets");

        assert_eq!(category_count, 0, "Categories table should be empty");
        assert_eq!(transaction_count, 0, "Transactions table should be empty");
        assert_eq!(budget_count, 0, "Budgets table should be empty");

        // teardown
        teardown_test_db();
    }
}
