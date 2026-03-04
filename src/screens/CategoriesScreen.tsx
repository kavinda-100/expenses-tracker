import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
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
import {
    CategoryType,
    categoryZodSchema,
    createCategoryZodSchema,
} from "@/zod/categoriesSchemas";
import { Type } from "@/zod";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import { useTauriMutation } from "@/hooks/useTauriMutation";

const CategoriesScreen = () => {
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState<Type>("EXPENSE");
    const [formError, setFormError] = React.useState<string | null>(null);
    const [incomeCategories, setIncomeCategories] = React.useState<
        CategoryType[]
    >([]);
    const [expenseCategories, setExpenseCategories] = React.useState<
        CategoryType[]
    >([]);

    // useTauriQuery for fetching categories and useTauriMutation for creating a new category
    const {
        data: categories,
        error: categoriesError,
        isError: isCategoriesError,
        loading: isCategoriesLoading,
        isRefetching: isCategoriesRefetching,
        queryAsync: queryCategoriesAsync,
        refetch: refetchCategories,
    } = useTauriQuery<CategoryType[], string>();

    // useTauriMutation for creating a new category
    const {
        mutationAsync: createCategoryAsync,
        error: createCategoryError,
        isError: isCreateCategoryError,
        loading: isCreateCategoryLoading,
    } = useTauriMutation<string, string>();

    // useTauriMutation for deleting a category
    const {
        mutationAsync: deleteCategoryAsync,
        error: deleteCategoryError,
        isError: isDeleteCategoryError,
        loading: isDeleteCategoryLoading,
    } = useTauriMutation<string, string>();

    // handler for fetching categories on component mount
    const fetchCategories = useCallback(async () => {
        await queryCategoriesAsync("get_categories");
    }, [queryCategoriesAsync]);

    // useEffect to fetch categories and separate them into income and expense lists
    React.useEffect(() => {
        // fetch categories when component mounts
        fetchCategories();
        // separate categories into income and expense lists when data changes
        const validatedCategories = categoryZodSchema
            .array()
            .safeParse(categories);

        if (validatedCategories.success) {
            // validate categories data before setting state
            setIncomeCategories(
                validatedCategories.data.filter((cat) => cat.type === "INCOME"),
            );
            setExpenseCategories(
                validatedCategories.data.filter(
                    (cat) => cat.type === "EXPENSE",
                ),
            );
        }
        // cleanup function to reset query state when component unmounts
        return () => {
            fetchCategories();
        };
    }, [categories, fetchCategories]);

    // handler for adding a new category
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const validatedData = createCategoryZodSchema.safeParse({ name, type });

        if (!validatedData.success) {
            setFormError(validatedData.error.message);
            console.error("Validation errors:", validatedData.error.issues);
            return;
        }

        setFormError(null);
        await createCategoryAsync("add_category", {
            name: validatedData.data.name,
            type: validatedData.data.type,
        });
        // refetch categories after adding a new one
        await refetchCategories();
        // reset form fields
        setName("");
        setType("EXPENSE");
    };

    // handler for deleting a category (not implemented yet)
    const handleDeleteCategory = async (id: string) => {
        await deleteCategoryAsync("delete_category", { id });
        // refetch categories after deleting one
        await refetchCategories();
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Add category form */}
            <Card>
                <CardHeader>
                    <CardTitle>Add New Category</CardTitle>
                    <CardDescription>
                        Create a custom category for transactions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Groceries"
                                disabled={isCreateCategoryLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={type}
                                onValueChange={(val: "INCOME" | "EXPENSE") =>
                                    setType(val)
                                }
                                disabled={isCreateCategoryLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EXPENSE">
                                        Expense
                                    </SelectItem>
                                    <SelectItem value="INCOME">
                                        Income
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            disabled={
                                isCreateCategoryLoading || name.trim() === ""
                            }
                            className="w-full"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Category lists */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Expense Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 relative">
                            {expenseCategories.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No expense categories.
                                </p>
                            ) : (
                                expenseCategories.map((c) => (
                                    <li
                                        key={c.id}
                                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md border border-transparent hover:border-border transition-colors"
                                    >
                                        <span className="text-sm font-medium">
                                            {c.name}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDeleteCategory(c.id)
                                            }
                                            disabled={isDeleteCategoryLoading}
                                            className="text-destructive h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Income Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {incomeCategories.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No income categories.
                                </p>
                            ) : (
                                incomeCategories.map((c) => (
                                    <li
                                        key={c.id}
                                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md border border-transparent hover:border-border transition-colors"
                                    >
                                        <span className="text-sm font-medium">
                                            {c.name}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDeleteCategory(c.id)
                                            }
                                            disabled={isDeleteCategoryLoading}
                                            className="text-destructive h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CategoriesScreen;
