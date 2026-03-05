import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, AlertCircle, SquarePenIcon, X } from "lucide-react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CategoryType,
    categoryZodSchema,
    createCategoryZodSchema,
} from "@/zod/categoriesSchemas";
import { Type } from "@/zod";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import { useTauriMutation } from "@/hooks/useTauriMutation";
import ScreenHeader from "@/components/ScreenHeader";

const CategoriesScreen = () => {
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = React.useState<
        number | null
    >(null);
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

    // Fetch categories on component mount only
    React.useEffect(() => {
        queryCategoriesAsync("get_all_categories");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty array = runs only once on mount

    // Separate categories into income and expense lists when data changes
    React.useEffect(() => {
        if (!categories) return;

        const validatedCategories = categoryZodSchema
            .array()
            .safeParse(categories);

        if (validatedCategories.success) {
            setIncomeCategories(
                validatedCategories.data.filter((cat) => cat.type === "INCOME"),
            );
            setExpenseCategories(
                validatedCategories.data.filter(
                    (cat) => cat.type === "EXPENSE",
                ),
            );
        }
    }, [categories]);

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
            newCategory: {
                name: validatedData.data.name,
                type: validatedData.data.type,
            },
        });
        // refetch categories after adding a new one
        await refetchCategories();
        // reset form fields
        setName("");
        setType("EXPENSE");
    };

    // handler for deleting a category
    const handleDeleteCategory = async () => {
        if (!categoryIdToDelete) return;
        await deleteCategoryAsync("delete_category", {
            categoryId: categoryIdToDelete,
        });
        // refetch categories after deleting one
        await refetchCategories();
        // close the delete confirmation dialog and reset the categoryIdToDelete state
        setOpenDeleteDialog(false);
        setCategoryIdToDelete(null);
    };

    return (
        <>
            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="space-y-3">
                            <p className="text-pretty">
                                This action cannot be undone. This will
                                permanently delete your category and remove all
                                it it's associated transactions.
                            </p>
                            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground text-pretty">
                                <strong className="font-medium text-foreground">
                                    💡 Recommendation:
                                </strong>{" "}
                                Instead of deleting, consider renaming the
                                category to something like "Archived - Old
                                Category Name" to preserve historical data and
                                transaction records.
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex w-full justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setOpenDeleteDialog(false)}
                        >
                            <X className="mr-1 h-4 w-4" />
                            No, Cancel
                        </Button>
                        <Button
                            className="ml-auto"
                            variant="destructive"
                            onClick={handleDeleteCategory}
                            disabled={isDeleteCategoryLoading}
                        >
                            <Trash2 className="mr-1 h-4 w-4" /> Yes, Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Main jsx */}
            <div className="w-full h-full flex flex-col gap-6 p-6">
                {/* Header */}
                <ScreenHeader
                    title="Categories"
                    description="Organize your transactions with custom income and expense
                    categories"
                />

                {/* Error Message for fetching categories */}
                {isCategoriesError && categoriesError && (
                    <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">{categoriesError}</p>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Add category form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Add New Category
                            </CardTitle>
                            <CardDescription>
                                Create a custom category for your transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleAddCategory}
                                className="space-y-4"
                            >
                                {/* Form Error Message */}
                                {formError && (
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                                        <AlertCircle className="h-4 w-4" />
                                        <p className="text-xs font-medium">
                                            {formError}
                                        </p>
                                    </div>
                                )}

                                {/* Create Category Error Message */}
                                {isCreateCategoryError &&
                                    createCategoryError && (
                                        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                                            <AlertCircle className="h-4 w-4" />
                                            <p className="text-xs font-medium">
                                                {createCategoryError}
                                            </p>
                                        </div>
                                    )}

                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g. Groceries, Salary"
                                        disabled={isCreateCategoryLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select
                                        value={type}
                                        onValueChange={(
                                            val: "INCOME" | "EXPENSE",
                                        ) => setType(val)}
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
                                        isCreateCategoryLoading ||
                                        name.trim() === ""
                                    }
                                    className="w-full"
                                >
                                    {isCreateCategoryLoading ? (
                                        <>Adding...</>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />{" "}
                                            Add Category
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Category lists */}
                    <div className="space-y-6">
                        {/* Delete Category Error Message */}
                        {isDeleteCategoryError && deleteCategoryError && (
                            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                                <AlertCircle className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    {deleteCategoryError}
                                </p>
                            </div>
                        )}

                        {/* Expense Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Expense Categories
                                </CardTitle>
                                <CardDescription>
                                    {isCategoriesLoading &&
                                    !isCategoriesRefetching
                                        ? "Loading..."
                                        : `${expenseCategories.length} ${expenseCategories.length === 1 ? "category" : "categories"}`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isCategoriesLoading &&
                                !isCategoriesRefetching ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {expenseCategories.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No expense categories yet.
                                                Create one to get started.
                                            </p>
                                        ) : (
                                            expenseCategories.map((c) => (
                                                <li
                                                    key={c.id}
                                                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md border border-transparent hover:border-border transition-colors"
                                                >
                                                    <span className="text-sm font-medium">
                                                        {c.name}
                                                    </span>
                                                    <div className="flex space-x-2">
                                                        <RenameCategoryDialog
                                                            id={c.id}
                                                            oldName={c.name}
                                                        />

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setCategoryIdToDelete(
                                                                    c.id,
                                                                );
                                                                setOpenDeleteDialog(
                                                                    true,
                                                                );
                                                            }}
                                                            disabled={
                                                                isDeleteCategoryLoading
                                                            }
                                                            className="text-destructive h-8 w-8 hover:bg-destructive/10 cursor-pointer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>

                        {/* Income Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Income Categories
                                </CardTitle>
                                <CardDescription>
                                    {isCategoriesLoading &&
                                    !isCategoriesRefetching
                                        ? "Loading..."
                                        : `${incomeCategories.length} ${incomeCategories.length === 1 ? "category" : "categories"}`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isCategoriesLoading &&
                                !isCategoriesRefetching ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {incomeCategories.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No income categories yet. Create
                                                one to get started.
                                            </p>
                                        ) : (
                                            incomeCategories.map((c) => (
                                                <li
                                                    key={c.id}
                                                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md border border-transparent hover:border-border transition-colors"
                                                >
                                                    <span className="text-sm font-medium">
                                                        {c.name}
                                                    </span>

                                                    <div className="flex space-x-2">
                                                        <RenameCategoryDialog
                                                            id={c.id}
                                                            oldName={c.name}
                                                        />

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setCategoryIdToDelete(
                                                                    c.id,
                                                                );
                                                                setOpenDeleteDialog(
                                                                    true,
                                                                );
                                                            }}
                                                            disabled={
                                                                isDeleteCategoryLoading
                                                            }
                                                            className="text-destructive h-8 w-8 hover:bg-destructive/10 cursor-pointer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoriesScreen;

const RenameCategoryDialog = ({
    id,
    oldName,
}: {
    id: number;
    oldName: string;
}) => {
    const [open, setOpen] = React.useState(false);
    const [newName, setNewName] = React.useState(oldName);

    // Tauri mutation for renaming category
    const {
        mutationAsync: renameCategoryAsync,
        error: renameCategoryError,
        isError: isRenameCategoryError,
        loading: isRenameCategoryLoading,
    } = useTauriMutation<string, string>();

    // handler for renaming category
    const handleRenameCategory = async () => {
        // Implementation for renaming category
        await renameCategoryAsync("rename_category", {
            new_data: {
                category_id: id,
                new_name: newName,
            },
        });
        // Close the dialog after renaming
        setOpen(false);
    };
    return (
        <>
            {/* Rename Category dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <SquarePenIcon className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Category</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="newName" className="text-right">
                                New Name
                            </Label>
                            <Input
                                id="newName"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="col-span-3"
                                disabled={isRenameCategoryLoading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isRenameCategoryLoading}
                        >
                            <X className="mr-1 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleRenameCategory}
                            disabled={isRenameCategoryLoading}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
