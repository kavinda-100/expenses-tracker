#[cfg(test)]
mod budget_test {

    use crate::{
        controllers::budget_controller::{add_budget, delete_budget, get_budgets, update_budget},
        dtos::request_dtos::{AddBudgetRequestDto, GetAllBudgetRequestDto, UpdateBudgetRequestDto},
        tests::{setup_test_db, teardown_test_db},
    };

    // -------------------------------- tests for add_budget --------------------------------

    #[test]
    fn test_add_budget() {
        // Setup
        let _conn = setup_test_db();

        // prepare test data
        let new_budget = AddBudgetRequestDto {
            amount: 100.0,
            month: 1,
            year: 2024,
            category_id: 1,
        };

        // Call the function being tested
        let result = add_budget(new_budget);

        // Assert the expected outcome
        assert!(result.is_ok());

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_add_budget_invalid_amount() {
        // Setup
        let _conn = setup_test_db();

        // prepare test data with invalid amount
        let new_budget = AddBudgetRequestDto {
            amount: -50.0, // Invalid amount
            month: 1,
            year: 2024,
            category_id: 1,
        };

        // Call the function being tested
        let result = add_budget(new_budget);

        // Assert the expected outcome
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Budget amount must be greater than zero".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_add_budget_invalid_month() {
        // Setup
        let _conn = setup_test_db();

        // prepare test data with invalid month
        let new_budget = AddBudgetRequestDto {
            amount: 100.0,
            month: 13, // Invalid month
            year: 2024,
            category_id: 1,
        };

        // Call the function being tested
        let result = add_budget(new_budget);

        // Assert the expected outcome
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Month must be between 1 and 12".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_add_budget_invalid_year() {
        // Setup
        let _conn = setup_test_db();

        // prepare test data with invalid year
        let new_budget = AddBudgetRequestDto {
            amount: 100.0,
            month: 1,
            year: 1800, // Invalid year
            category_id: 1,
        };

        // Call the function being tested
        let result = add_budget(new_budget);

        // Assert the expected outcome
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Year must be between 1900 and 2100".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    // -------------------------------- tests for delete_budget --------------------------------

    /**
     * Helper function to set up a budget in the database before each delete_budget test and return the inserted budget ID
     */
    fn before_each_delete_budget() -> i64 {
        // Setup
        let _conn = setup_test_db();

        // Insert a budget to be deleted
        let new_budget = AddBudgetRequestDto {
            amount: 100.0,
            month: 1,
            year: 2024,
            category_id: 1,
        };
        // Call the add_budget function to insert the budget and get the inserted ID
        let result = add_budget(new_budget);

        // Assert that the transaction was added successfully and extract the ID from the success message
        assert!(result.is_ok());
        // The success message is expected to be in the format "Budget added successfully with id: {id}", so we split the string to extract the ID
        let added_budget_id: i64 = result
            .ok()
            .unwrap()
            .split("id: ")
            .nth(1)
            .unwrap()
            .parse()
            .unwrap();

        // Alternatively, we can directly query the database to get the last inserted ID since add_budget returns the last inserted ID in the success message.
        added_budget_id
    }

    #[test]
    fn test_delete_budget() {
        // Setup - insert a budget to be deleted and get its ID
        let budget_id = before_each_delete_budget();

        // Call the function being tested
        let result = delete_budget(budget_id);

        // Assert the expected outcome
        assert!(result.is_ok());
        let expected_message = format!("Budget with id {} deleted successfully", budget_id);
        assert_eq!(result.ok().unwrap(), expected_message);

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_delete_budget_non_existent_id() {
        // Setup
        let _conn = setup_test_db();

        // Call the function being tested with a non-existent ID
        let result = delete_budget(9999); // Assuming 9999 is a non-existent ID

        // Assert the expected outcome
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "No budget found with id: 9999".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    // -------------------------------------- test for get_budgets --------------------------------------

    #[test]
    fn test_get_budgets() {
        // Setup
        let _conn = setup_test_db();

        // Insert a budget for the month and year we will query
        let monthly_budget_request = GetAllBudgetRequestDto {
            month: 2,
            year: 2026,
        };
        let result = get_budgets(monthly_budget_request);
        assert!(result.is_ok());

        // Call the function being tested
        let budgets = result.ok().unwrap();

        // Assert the expected outcome
        assert!(!budgets.is_empty());
        let budget = &budgets[0];
        assert_eq!(budget.amount, 500.00);
        assert_eq!(budget.month, 2);
        assert_eq!(budget.year, 2026);
        assert_eq!(budget.category_id, 1);
        assert_eq!(budget.category_name, "Groceries".to_string());

        // Teardown
        teardown_test_db();
    }

    // ---------------------------------- test for update_budget ----------------------------------

    fn before_each_update_budget() -> i64 {
        let conn = setup_test_db();

        // Insert a budget to be updated and get its ID
        let new_budget = AddBudgetRequestDto {
            amount: 100.0,
            month: 1,
            year: 2026,
            category_id: 1,
        };
        let result = add_budget(new_budget);
        assert!(result.is_ok());

        conn.last_insert_rowid()
    }

    #[test]
    fn test_update_budget() {
        // Setup - insert a budget to be updated and get its ID
        let budget_id = before_each_update_budget();

        // Prepare updated budget data
        let request = UpdateBudgetRequestDto {
            id: budget_id,
            amount: 150.0, // Updated amount
        };

        // Call the function being tested to update the budget
        let result = update_budget(request);

        // Assert the expected outcome
        assert!(result.is_ok());
        assert_eq!(
            result.ok().unwrap(),
            format!("Budget with id {} updated successfully", budget_id)
        );

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_update_budget_non_existent_id() {
        // Setup
        let _conn = setup_test_db();

        // Prepare update request with a non-existent ID
        let request = UpdateBudgetRequestDto {
            id: 9999, // Assuming 9999 is a non-existent ID
            amount: 150.0,
        };

        // Call the function being tested to update the budget
        let result = update_budget(request);

        // Assert the expected outcome
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "No budget found with id: 9999".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_update_budget_invalid_amount() {
        // Setup - insert a budget to be updated and get its ID
        let budget_id = before_each_update_budget();

        // Prepare update request with an invalid amount
        let request = UpdateBudgetRequestDto {
            id: budget_id,
            amount: -50.0, // Invalid amount
        };

        // Call the function being tested to update the budget
        let result = update_budget(request);

        // Assert the expected outcome
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Budget amount must be greater than zero".to_string()
        );

        // Teardown
        teardown_test_db();
    }
}
