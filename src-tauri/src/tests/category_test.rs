#[cfg(test)]
mod category_test {

    use crate::{
        controllers::category_controller::{add_category, delete_category, get_all_categories},
        dtos::request_dtos::CategoryRequestDto,
        tests::{setup_test_db, teardown_test_db},
    };

    // ------------------------------------- test for add_category -------------------------------------

    #[test]
    fn test_add_category() {
        // set up
        let _conn = setup_test_db();

        // set up the request DTO for adding a new category
        let new_category = CategoryRequestDto {
            name: "Test Category".to_string(),
            type_: "EXPENSE".to_string(),
        };

        // call the add_category function with the new category
        let result: Result<String, String> = add_category(new_category);

        // assert the result
        assert!(result.is_ok());

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_add_category_invalid_name() {
        // set up
        let _conn = setup_test_db();

        // set up the request DTO with invalid input (empty name)
        let new_category = CategoryRequestDto {
            name: "".to_string(),
            type_: "EXPENSE".to_string(),
        };

        // call the add_category function with the invalid category
        let result: Result<String, String> = add_category(new_category);

        // assert that an error is returned
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Category name cannot be empty".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_add_category_invalid_type() {
        // set up
        let _conn = setup_test_db();

        // set up the request DTO with invalid input (invalid type)
        let new_category = CategoryRequestDto {
            name: "Test Category".to_string(),
            type_: "INVALID_TYPE".to_string(),
        };

        // call the add_category function with the invalid category
        let result: Result<String, String> = add_category(new_category);

        // assert that an error is returned
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "Category type must be either 'INCOME' or 'EXPENSE'".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    // ------------------------------------- test for delete_category -------------------------------------

    /**
     * Helper function to set up a category before testing delete_category. Returns the ID of the created category.
     */
    fn before_each_delete_category_test() -> i64 {
        // set up
        let _conn = setup_test_db();

        // set up the request DTO for adding a new category
        let new_category = CategoryRequestDto {
            name: "Category to Delete".to_string(),
            type_: "EXPENSE".to_string(),
        };

        // call the add_category function to create a category for deletion
        let result: Result<String, String> = add_category(new_category);
        // assert that the category was added successfully
        assert!(result.is_ok());
        // Return the ID of the created category (assuming the function returns it)
        let added_transaction_id: i64 = result
            .ok()
            .unwrap()
            .split("id: ")
            .nth(1)
            .unwrap()
            .parse()
            .unwrap();

        // return the ID of the created category for use in the delete_category test
        added_transaction_id
    }

    #[test]
    fn test_delete_category() {
        // set up
        let category_id = before_each_delete_category_test();

        // call the delete_category function with the ID of the category to be deleted
        let result: Result<String, String> = delete_category(category_id);

        // assert that the category was deleted successfully
        assert!(result.is_ok());
        // The expected success message should include the ID of the deleted category
        let expected_message = format!("Category with id {} deleted successfully", category_id);
        // assert that the success message matches the expected message
        assert_eq!(result.ok().unwrap(), expected_message);

        // Teardown
        teardown_test_db();
    }

    #[test]
    fn test_delete_category_non_existent() {
        // set up
        let _conn = setup_test_db();

        // call the delete_category function with an ID that does not exist in the database
        let result: Result<String, String> = delete_category(9999); // Assuming 9999 is a non-existent ID

        // assert that an error is returned indicating that no category was found with the given ID
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap(),
            "No category found with id: 9999".to_string()
        );

        // Teardown
        teardown_test_db();
    }

    // ------------------------------------- test for get_all_categories -------------------------------------

    #[test]
    fn test_get_all_categories() {
        // set up
        let _conn = setup_test_db();

        // call the get_all_categories function to retrieve all categories
        let result = get_all_categories();

        // assert that the categories were retrieved successfully and that the expected number of categories is returned
        assert!(result.is_ok());

        let categories = result.ok().unwrap();
        // Assuming we have categories.
        assert!(categories.len() > 0);

        // Teardown
        teardown_test_db();
    }
}
