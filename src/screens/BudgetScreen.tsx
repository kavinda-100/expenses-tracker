import { useTauriMutation } from "@/hooks/useTauriMutation";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import { BudgetType, budgetZodSchema } from "@/zod/budgetSchemas";
import {
    GetCategoryNamesType,
    getCategoryNamesZodSchema,
} from "@/zod/categoriesSchemas";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    AlertCircle,
    Wallet,
    RefreshCcwIcon,
    LoaderIcon,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import ScreenHeader from "@/components/ScreenHeader";

const BudgetScreen = () => {
    const [categoryNames, setCategoryNames] = React.useState<
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
        refetch: refetchCategoryNamesAsync,
        isRefetching: isCategoryNamesRefetching,
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
    const handleCreateBudget = async (e: React.FormEvent) => {
        e.preventDefault();

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

        // Reset form
        setSelectedCategoryId(0);
        setAmount(0);
    };

    // Get current month and year for display
    const currentDate = new Date();
    const monthName = currentDate.toLocaleString("en-US", { month: "long" });
    const year = currentDate.getFullYear();

    return (
        <div className="w-full h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <ScreenHeader
                title="Budgets"
                description={`Set spending limits and track your progress for ${monthName} - ${year}`}
            />

            {/* Error Messages */}
            {isCategoryNamesError && categoryNamesError && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm font-medium">{categoryNamesError}</p>
                </div>
            )}

            {isBudgetsError && budgetsError && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm font-medium">{budgetsError}</p>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                {/* Budget List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Budget Overview
                        </h2>
                        <span className="text-sm text-muted-foreground">
                            {budget.length}{" "}
                            {budget.length === 1 ? "budget" : "budgets"} active
                        </span>
                    </div>

                    {isBudgetsLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : budget.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Wallet className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        No budgets set for this month.
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Create your first budget to start
                                        tracking your spending.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        budget.map((b) => {
                            // TODO: Add transaction data to calculate actual spending
                            // For now, showing budget limits only
                            return (
                                <Card key={b.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                {b.category_name}
                                            </CardTitle>
                                            <span className="text-sm font-medium">
                                                {formatCurrency(b.amount)} limit
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>
                                                Budget for {monthName} {year}
                                            </span>
                                            <span className="text-xs">
                                                ID: {b.id}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Set Budget Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Set New Budget
                            </CardTitle>
                            <CardDescription>
                                Create a monthly spending limit for a category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleCreateBudget}
                                className="space-y-4"
                            >
                                {/* Form Error Message */}
                                {budgetError && (
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                                        <AlertCircle className="h-4 w-4" />
                                        <p className="text-xs font-medium">
                                            {budgetError}
                                        </p>
                                    </div>
                                )}

                                {/* Create Budget Error Message */}
                                {isCreateBudgetError && createBudgetError && (
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                                        <AlertCircle className="h-4 w-4" />
                                        <p className="text-xs font-medium">
                                            {createBudgetError}
                                        </p>
                                    </div>
                                )}

                                {/* Success Message */}
                                {createBudgetData && !isCreateBudgetError && (
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10 text-primary border border-primary/20">
                                        <AlertCircle className="h-4 w-4" />
                                        <p className="text-xs font-medium">
                                            {createBudgetData}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex gap-4 items-center justify-start">
                                        <Label htmlFor="category">
                                            Category
                                        </Label>
                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            className="mt-1 cursor-pointer"
                                            onClick={refetchCategoryNamesAsync}
                                            disabled={isCategoryNamesRefetching}
                                        >
                                            {isCategoryNamesRefetching ? (
                                                <LoaderIcon className="animate-spin h-4 w-4" />
                                            ) : (
                                                <RefreshCcwIcon className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <Select
                                        value={
                                            selectedCategoryId
                                                ? selectedCategoryId.toString()
                                                : ""
                                        }
                                        onValueChange={(val) =>
                                            setSelectedCategoryId(Number(val))
                                        }
                                        disabled={
                                            isCreateBudgetLoading ||
                                            isCategoryNamesLoading ||
                                            categoryNames.length === 0
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isCategoryNamesLoading ? (
                                                <SelectItem
                                                    value="loading"
                                                    disabled
                                                >
                                                    Loading categories...
                                                </SelectItem>
                                            ) : categoryNames.length === 0 ? (
                                                <SelectItem
                                                    value="empty"
                                                    disabled
                                                >
                                                    No categories available
                                                </SelectItem>
                                            ) : (
                                                categoryNames.map((c) => (
                                                    <SelectItem
                                                        key={c.id}
                                                        value={c.id.toString()}
                                                    >
                                                        {c.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">
                                        Monthly Budget Amount
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={amount || ""}
                                        onChange={(e) =>
                                            setAmount(Number(e.target.value))
                                        }
                                        placeholder="0.00"
                                        disabled={isCreateBudgetLoading}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isCreateBudgetLoading ||
                                        !amount ||
                                        !selectedCategoryId
                                    }
                                >
                                    {isCreateBudgetLoading ? (
                                        <>Setting Budget...</>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />{" "}
                                            Set Budget
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Budget Tips Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Budget Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>
                                    • Set realistic budgets based on your income
                                    and expenses
                                </p>
                                <p>
                                    • Review and adjust your budgets monthly for
                                    better control
                                </p>
                                <p>
                                    • Track expenses regularly to stay within
                                    your limits
                                </p>
                                <p>
                                    • Use the 50/30/20 rule: 50% needs, 30%
                                    wants, 20% savings
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BudgetScreen;
