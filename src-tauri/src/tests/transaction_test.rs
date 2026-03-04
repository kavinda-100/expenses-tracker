#[cfg(test)]
mod transaction_test {
    use rusqlite::Connection;

    use crate::{controllers::transaction_controller::{add_transaction, delete_transaction, get_all_transactions_with_category}, dtos::request_dtos::{GetAllTransactionsWithCategoryRequestDto, TransactionRequestDto}, tests::{setup_test_db, teardown_test_db}};


    // -------------------------------- Tests for add_transaction function --------------------------------
    #[test]
    fn test_add_transaction() {
        // Setup
        let _conn = setup_test_db();

        // Create a new transaction request
        let new_transaction = TransactionRequestDto {
            amount: 100.0,
            description: Some("Test Transaction".to_string()),
            date: "2024-06-01".to_string(),
            type_: "EXPENSE".to_string(),
            category_id: 1, // Assuming category with ID 1 exists in mock data
        };

        // Call the add_transaction function with the new transaction
        let result: Result<String, String> = add_transaction(new_transaction);

        // Assert the result
        assert!(result.is_ok());

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_add_transaction_invalid_amount() {
        // Setup
        let _conn = setup_test_db();

        // Create a new transaction request with an invalid amount
        let new_transaction = TransactionRequestDto {
            amount: -50.0, // Invalid amount
            description: Some("Invalid Transaction".to_string()),
            date: "2024-06-01".to_string(),
            type_: "EXPENSE".to_string(),
            category_id: 1,
        };

        // Call the add_transaction function with the invalid transaction
        let result: Result<String, String> = add_transaction(new_transaction);

        // Assert that the result is an error
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Transaction amount must be greater than zero".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_add_transaction_invalid_type() {
        // Setup
        let _conn = setup_test_db();

        // Create a new transaction request with an invalid type
        let new_transaction = TransactionRequestDto {
            amount: 50.0,
            description: Some("Invalid Transaction".to_string()),
            date: "2024-06-01".to_string(),
            type_: "INVALID_TYPE".to_string(), // Invalid type
            category_id: 1,
        };

        // Call the add_transaction function with the invalid transaction
        let result: Result<String, String> = add_transaction(new_transaction);

        // Assert that the result is an error
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Transaction type must be either 'INCOME' or 'EXPENSE'".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_add_transaction_empty_date() {
        // Setup
        let _conn = setup_test_db();

        // Create a new transaction request with an empty date
        let new_transaction = TransactionRequestDto {
            amount: 50.0,
            description: Some("Invalid Transaction".to_string()),
            date: "".to_string(), // Empty date
            type_: "EXPENSE".to_string(),
            category_id: 1,
        };

        // Call the add_transaction function with the invalid transaction
        let result: Result<String, String> = add_transaction(new_transaction);

        // Assert that the result is an error
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Transaction date cannot be empty".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    // --------------------------------------- Tests for delete_transaction function --------------------------------

    /**
     * Helper function to set up a transaction for testing the delete_transaction function. It adds a transaction to the database and returns its ID along with the database connection for further operations in the test.
     */
    fn before_delete_transaction_test() -> (i64, Connection) {
        // Setup
        let _conn = setup_test_db();

        // First, add a transaction to ensure there is something to delete
        let new_transaction = TransactionRequestDto {
            amount: 100.0,
            description: Some("Transaction to Delete".to_string()),
            date: "2024-06-01".to_string(),
            type_: "EXPENSE".to_string(),
            category_id: 1,
        };
        // Add the transaction and get its ID
        let add_result = add_transaction(new_transaction);
        // Assert that the transaction was added successfully and extract the ID from the success message
        assert!(add_result.is_ok());
        // The success message is expected to be in the format "Transaction added successfully with id: {id}", so we split the string to extract the ID
        let added_transaction_id: i64 = add_result
            .ok()
            .unwrap()
            .split("id: ")
            .nth(1)
            .unwrap()
            .parse()
            .unwrap();

            // Return the ID of the newly added transaction and the database connection for use in the delete test
        (   added_transaction_id, _conn)
    }

    #[test]
    fn test_delete_transaction() {
        // Setup
        let (added_transaction_id, _) = before_delete_transaction_test();

        // Call the delete_transaction function with the ID of the newly added transaction
        let delete_result = delete_transaction(added_transaction_id);

        // Assert that the deletion was successful
        assert!(delete_result.is_ok());
        assert_eq!(
            delete_result.ok().unwrap(),
            format!("Transaction with id {} deleted successfully", added_transaction_id)
        );

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_delete_nonexistent_transaction() {
        // Setup
        let _conn = setup_test_db();

        // Call the delete_transaction function with an ID that does not exist in the database
        let delete_result = delete_transaction(9999); // Assuming 9999 is a non-existent ID

        // Assert that the result is an error
        assert!(delete_result.is_err());
        assert_eq!(
            delete_result.err().unwrap(),
            "No transaction found with id: 9999".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    // --------------------------------------- Test for get_all_transactions_with_category ------------------------------

    #[test]
    fn test_get_all_transactions_with_category(){
        // Setup
        let _conn = setup_test_db();

        // Create a request DTO with a valid date range that includes the transactions added in the mock data
        let request_dto = GetAllTransactionsWithCategoryRequestDto {
            start_date: "2026-01-01".to_string(),
            end_date: "2026-12-31".to_string(),
        };

        // Call the get_all_transactions_with_category function with the request DTO
        let result = get_all_transactions_with_category(request_dto);

        // Assert that the result is successful and contains the expected transactions
        assert!(result.is_ok());
        let transactions = result.ok().unwrap();
        // println!("Retrieved transactions with category: {:?}", transactions);
        assert!(!transactions.is_empty()); // Assuming there are transactions in the mock data for the given date range

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_get_all_transactions_with_category_empty_dates(){
        // Setup
        let _conn = setup_test_db();

        // Create a request DTO with empty start and end dates
        let request_dto = GetAllTransactionsWithCategoryRequestDto {
            start_date: "".to_string(),
            end_date: "".to_string(),
        };

        // Call the get_all_transactions_with_category function with the invalid request DTO
        let result = get_all_transactions_with_category(request_dto);

        // Assert that the result is an error due to empty date fields
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Start date and end date cannot be empty".to_string()
        );

        // Teardown
        teardown_test_db();
    }
}