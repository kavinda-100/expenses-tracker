#[cfg(test)]
mod report_tests {
    use crate::controllers::report_controller::{get_expense_by_category, get_last_month_habits, get_last_year_habits, get_monthly_overview, get_yearly_overview};
    use crate::dtos::request_dtos::{LastMonthHabitsRequestDto, LastYearHabitsRequestDto, MonthlyOverviewRequestDto, YearlyOverviewRequestDto};
    use crate::tests::{setup_test_db, teardown_test_db};

    #[test]
    fn test_get_last_month_habits_february_2026() {
        // Setup
        let _conn = setup_test_db();

        // Create request for February 2026
        let request = LastMonthHabitsRequestDto {
            month: 2,
            year: 2026,
        };

        // Call the actual controller function with test database
        let habits = get_last_month_habits(request).expect("Failed to get last month habits");

        // Assertions
        assert!(
            !habits.is_empty(),
            "Should have spending habits for February 2026"
        );

        // Check that categories are ordered by amount (descending)
        assert_eq!(habits[0].category_name, "Groceries"); // Should be highest
        assert_eq!(habits[0].total_amount, 531.25); // 150.50 + 200.00 + 180.75

        // Check second highest
        assert_eq!(habits[1].category_name, "Utilities");
        assert_eq!(habits[1].total_amount, 300.00); // 200.00 + 100.00

        // Check third highest
        assert_eq!(habits[2].category_name, "Healthcare");
        assert_eq!(habits[2].total_amount, 250.00);

        // Verify all expense categories with data are present
        assert!(
            habits.len() >= 5,
            "Should have at least 5 spending categories"
        );

        // print the data for debugging
        println!("✅ test_get_last_month_habits_february_2026 {:?}", habits);

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_get_last_month_habits_no_data() {
        // Setup
        let _conn = setup_test_db();

        // Create request for a month with no data (December 2024)
        let request = LastMonthHabitsRequestDto {
            month: 12,
            year: 2024,
        };

        // Call the actual controller function with test database
        let habits = get_last_month_habits(request).expect("Failed to get last month habits");

        // Assertions
        assert!(
            habits.is_empty(),
            "Should have no spending habits for December 2024"
        );

        // print the data for debugging
        println!("test_get_last_month_habits_no_data {:?}", habits);

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_get_last_year_habits_2025() {
        // Setup
        let _conn = setup_test_db();

        // Create request for 2025
        let request = LastYearHabitsRequestDto { year: 2025 };

        // Call the actual controller function with test database
        let habits = get_last_year_habits(request).expect("Failed to get last year habits");

        // Assertions
        assert!(!habits.is_empty(), "Should have spending habits for 2025");

        // Groceries should be the highest (500 + 450 + 480 + 520 = 1950)
        assert_eq!(habits[0].category_name, "Groceries");
        assert_eq!(habits[0].total_amount, 1950.00);

        // Check that Transportation is second (300 + 250 = 550)
        assert_eq!(habits[1].category_name, "Transportation");
        assert_eq!(habits[1].total_amount, 550.00);

        // Check that we have the expected categories
        assert!(
            habits.len() >= 4,
            "Should have at least 4 spending categories"
        );

        println!("✅ 2025 yearly habits:");
        for habit in &habits {
            println!("  - {}: ${:.2}", habit.category_name, habit.total_amount);
        }

        // print the data for debugging
        println!("✅ test_get_last_year_habits_2025 {:?}", habits);

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_get_last_year_habits_current_year_2026() {
        // Setup
        let _conn = setup_test_db();

        // Create request for 2026 (should have data from Jan and Feb)
        let request = LastYearHabitsRequestDto { year: 2026 };

        // Call the actual controller function with test database
        let habits = get_last_year_habits(request).expect("Failed to get last year habits");

        // Assertions
        assert!(!habits.is_empty(), "Should have spending habits for 2026");

        // Groceries: Feb (150.50 + 200.00 + 180.75) + Jan (300) = 831.25
        let groceries = habits
            .iter()
            .find(|h| h.category_name == "Groceries")
            .unwrap();
        assert_eq!(groceries.total_amount, 831.25);

        // Utilities: Feb (200.00 + 100.00) + Jan (75.00 + 50.00) = 425.00
        let utilities = habits
            .iter()
            .find(|h| h.category_name == "Utilities")
            .unwrap();
        assert_eq!(utilities.total_amount, 425.00);

        // print the data for debugging
        println!("✅ test_get_last_year_habits_current_year_2026 {:?}", habits);

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_get_last_year_habits_no_data() {
        // Setup
        let _conn = setup_test_db();

        // Create request for a year with no data (2020)
        let request = LastYearHabitsRequestDto { year: 2020 };

        // Call the actual controller function with test database
        let habits = get_last_year_habits(request).expect("Failed to get last year habits");

        // Assertions
        assert!(habits.is_empty(), "Should have no spending habits for 2020");

        println!("✅ 2020 has no spending data (as expected)");

        // print the data for debugging
        println!("test_get_last_year_habits_no_data {:?}", habits);

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_get_expense_by_category(){
        // Setup
        let _conn = setup_test_db();

        // Call the actual controller function with test database
        let expenses_by_category = get_expense_by_category()
            .expect("Failed to get expense by category");

        // Assertions
        assert!(!expenses_by_category.is_empty(), "Should have expense data by category");

        // Check that we have the expected categories and amounts
        let groceries = expenses_by_category
            .iter()
            .find(|e| e.category_name == "Groceries")
            .unwrap();
        assert!(groceries.total_expense > 0.0, "Groceries should have expenses");

        // Check that Transportation has expenses
        let transportation = expenses_by_category
            .iter()
            .find(|e| e.category_name == "Transportation")
            .unwrap();
        assert!(transportation.total_expense > 0.0, "Transportation should have expenses");

        // print the data for debugging
        println!("test_get_expense_by_category {:?}", expenses_by_category);

        // Teardown
        teardown_test_db();
    }


    #[test]
    fn test_get_monthly_overview(){
        // Setup
        let _conn = setup_test_db();

        // Create request for February 2026
        let request = MonthlyOverviewRequestDto {
            month: 2,
            year: 2026,
        };

        // Call the actual controller function with test database
        let overview = get_monthly_overview(request)
            .expect("Failed to get monthly overview");

        // Assertions
        assert!(overview.total_income > 0.0, "Should have total income for February 2026");
        assert!(overview.total_expenses > 0.0, "Should have total expenses for February 2026");

        // print the data for debugging
        println!("test_get_monthly_overview {:?}", overview);

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_get_yearly_overview(){
        // Setup
        let _conn = setup_test_db();

        // Create request for 2025
        let request = YearlyOverviewRequestDto {
            year: 2025,
        };

        // Call the actual controller function with test database
        let overview = get_yearly_overview(request)
            .expect("Failed to get yearly overview");

        // get the first month overview (January) and check values
        let january = overview
            .iter()
            .find(|m| m.month == 1)
            .unwrap();

        // Assertions
        assert!(january.total_income > 0.0, "January should have total income");
        assert!(january.total_expenses > 0.0, "January should have total expenses");

        // print the data for debugging
        println!("test_get_yearly_overview {:?}", overview);

        // Teardown
        teardown_test_db();
    }
}
