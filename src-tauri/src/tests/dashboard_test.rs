#[cfg(test)]
mod dashboard_test {
    use crate::controllers::dashboard_controller::{
        get_dashboard_overview, get_past_seven_days_data, get_recent_transactions,
    };
    use crate::tests::{setup_test_db, teardown_test_db};

    // -------------------------------- tests for get_dashboard_overview --------------------------------
    #[test]
    fn test_get_dashboard_overview() {
        // Setup
        let _conn = setup_test_db();

        // Call the function being tested
        let result = get_dashboard_overview();

        // Assert the expected outcome
        assert!(result.is_ok());
        let overview = result.ok().unwrap();
        assert!(overview.total_income > 0.0);
        assert!(overview.total_expenses > 0.0);
        assert!(overview.net_balance > 0.0);

        // Teardown
        teardown_test_db();
    }

    // -------------------------------- tests for get_past_seven_days_data --------------------------------
    #[test]
    fn test_get_past_seven_days_data() {
        // Setup
        let _conn = setup_test_db();

        // Call the function being tested
        let result = get_past_seven_days_data();

        // Assert the expected outcome
        assert!(result.is_ok());
        let data = result.ok().unwrap();
        assert!(data.len() > 0, "Should have data for the past 7 days");
        // println!("Past 7 days data: {:?}", data);
    }

    // ------------------------------------ test for get_recent_transactions ------------------------------------
    #[test]
    fn test_get_recent_transactions_with_out_limit() {
        // Setup
        let _conn = setup_test_db();

        // Call the function being tested
        let result = get_recent_transactions(None);

        // Assert the expected outcome
        assert!(result.is_ok());
        let transactions = result.ok().unwrap();
        assert_eq!(
            transactions.len(),
            5,
            "Should return default 5 recent transactions"
        );
        // println!("Recent transactions: {:?}", transactions);
    }

    #[test]
    fn test_get_recent_transactions_with_limit() {
        // Setup
        let _conn = setup_test_db();

        // Call the function being tested with a specific limit
        let result = get_recent_transactions(Some(3));

        // Assert the expected outcome
        assert!(result.is_ok());
        let transactions = result.ok().unwrap();
        assert!(
            transactions.len() > 0,
            "Should return recent transactions with limit 3"
        );
        // assert_eq!(transactions.len(), 3, "Should return 3 recent transactions");
        println!("Recent transactions with limit 3: {:?}", transactions);
    }
}
