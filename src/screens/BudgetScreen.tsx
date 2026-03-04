import { useTauriMutation } from "@/hooks/useTauriMutation";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import { BudgetType, budgetZodSchema } from "@/zod/budgetSchemas";
import {
    GetCategoryNamesType,
    getCategoryNamesZodSchema,
} from "@/zod/categoriesSchemas";
import React from "react";

// Helper function to format numbers as currency
const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(val);

const BudgetScreen = () => {
    const [categorNames, setCategoryNames] = React.useState<
        GetCategoryNamesType[]
    >([]);
    const [selectedCategoryId, setSelectedCategoryId] =
        React.useState<number>(0);
    const [amount, setAmount] = React.useState<number>(0);
    const [budget, setBudget] = React.useState<BudgetType[]>([]);
    const [budgetError, setBudgetError] = React.useState<string | null>(null);

    // Tauri query for fetching category names
    const {
        data: categoryNamesData,
        error: categoryNamesError,
        isError: isCategoryNamesError,
        loading: isCategoryNamesLoading,
        queryAsync: queryCategoryNamesAsync,
    } = useTauriQuery<GetCategoryNamesType[], string>();

    // Tauri query for fetching budgets
    const {
        data: budgetsData,
        error: budgetsError,
        isError: isBudgetsError,
        loading: isBudgetsLoading,
        queryAsync: queryBudgetsAsync,
        refetch: refetchBudgetsAsync,
    } = useTauriQuery<BudgetType[], string>();

    // tauri mutation for creating a new budget
    const {
        data: createBudgetData,
        error: createBudgetError,
        isError: isCreateBudgetError,
        loading: isCreateBudgetLoading,
        mutationAsync: createBudgetAsync,
    } = useTauriMutation<string, string>();

    // Fetch category names on component mount only
    React.useEffect(() => {
        queryCategoryNamesAsync("get_categories_names");
        queryBudgetsAsync("get_budgets", {
            params: {
                month: new Date().getMonth() + 1, // Current month (0-based index)
                year: new Date().getFullYear(), // Current year
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty array = runs only once on mount

    // Update category names state when data is fetched
    React.useEffect(() => {
        if (categoryNamesData) {
            const parsedCategoryNames = getCategoryNamesZodSchema
                .array()
                .safeParse(categoryNamesData);
            if (parsedCategoryNames.success) {
                setCategoryNames(parsedCategoryNames.data);
            } else {
                console.error(
                    "Category names data validation failed:",
                    parsedCategoryNames.error,
                );
                setCategoryNames([]);
            }
        }
    }, [categoryNamesData]);

    // Update budgets state when data is fetched and validated
    React.useEffect(() => {
        if (budgetsData) {
            const parsedBudgets = budgetZodSchema
                .array()
                .safeParse(budgetsData);
            if (parsedBudgets.success) {
                setBudget(parsedBudgets.data);
            } else {
                console.error(
                    "Budget data validation failed:",
                    parsedBudgets.error,
                );
                setBudgetError(
                    "Failed to load budgets due to data validation error.",
                );
            }
        }
    }, [budgetsData]);

    // Function to handle creating a new budget
    const handleCreateBudget = async () => {
        if (!selectedCategoryId) {
            setBudgetError("Please select a category.");
            return;
        }
        if (amount <= 0) {
            setBudgetError("Please enter a valid amount.");
            return;
        }
        setBudgetError(null); // Clear any previous errors

        // Call the create budget mutation
        await createBudgetAsync("add_budget", {
            newBudget: {
                amount: amount,
                month: new Date().getMonth() + 1, // Current month
                year: new Date().getFullYear(), // Current year
                category_id: selectedCategoryId,
            },
        });

        // After creating a budget, refetch the budgets to update the list
        await refetchBudgetsAsync();
    };

    return <div>BudgetScreen</div>;
};

export default BudgetScreen;
