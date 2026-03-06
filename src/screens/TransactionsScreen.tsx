import React from "react";
import ScreenHeader from "@/components/ScreenHeader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { PlusIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    GetCategoryNamesType,
    getCategoryNamesZodSchema,
} from "@/zod/categoriesSchemas";
import { Separator } from "@/components/ui/separator";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import { TransactionZodSchema } from "@/zod/transactionSchemas";
import { useTauriMutation } from "@/hooks/useTauriMutation";
import TransactionTable from "@/sections/TransactionTable";
import { useGetTransactions } from "@/hooks/Transactions/useGetTransactions";

const TransactionsScreen = () => {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date>();
    const [type, setType] = React.useState<"INCOME" | "EXPENSE">("INCOME");
    const [categoryNames, setCategoryNames] = React.useState<
        GetCategoryNamesType[]
    >([]);
    const [amount, setAmount] = React.useState<number>(0);
    const [description, setDescription] = React.useState<string>("");
    const [categoryId, setCategoryId] = React.useState<number | null>(null);
    const [validationErrors, setValidationErrors] = React.useState<
        string | null
    >(null);

    // hook for fetching transactions from the database
    const {
        transactions,
        transactionsIsError,
        transactionsError,
        isTransactionsLoading,
        refetchTransactions,
    } = useGetTransactions();

    // Tauri query for fetching category names
    const {
        data: categoryNamesData,
        error: categoryNamesError,
        isError: isCategoryNamesError,
        loading: isCategoryNamesLoading,
        queryAsync: queryCategoryNamesAsync,
    } = useTauriQuery<GetCategoryNamesType[], string>();

    // Tauri mutation for creating transaction.
    const {
        data: createTransactionData,
        loading: isCreateTransactionLoading,
        error: createTransactionError,
        isError: isCreateTransactionError,
        mutationAsync: createTransactionAsync,
    } = useTauriMutation<string, string>();

    // Tauri mutation for deleting transaction.
    const {
        data: _deleteTransactionData,
        loading: isDeleteTransactionLoading,
        error: _deleteTransactionError,
        isError: _isDeleteTransactionError,
        mutationAsync: deleteTransactionAsync,
    } = useTauriMutation<string, string>();

    // Fetch category names on component mount only
    React.useEffect(() => {
        queryCategoryNamesAsync("get_categories_names");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty array = runs only once on mount

    // Update category names state when data is fetched
    React.useEffect(() => {
        if (categoryNamesData) {
            const parsedCategoryNames = getCategoryNamesZodSchema
                .array()
                .safeParse(categoryNamesData);
            if (parsedCategoryNames.success) {
                // filter out only EXPENSE type categories for budgeting
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

    // Watch for successful transaction creation and close dialog
    React.useEffect(() => {
        if (
            !isCreateTransactionLoading &&
            !isCreateTransactionError &&
            createTransactionData
        ) {
            // Reset form fields
            setAmount(0);
            setDescription("");
            setDate(undefined);
            setType("INCOME");
            setCategoryId(null);
            setValidationErrors(null);
            // Close dialog
            setOpen(false);
        }
    }, [
        createTransactionData,
        isCreateTransactionError,
        isCreateTransactionLoading,
    ]);

    // handle create transaction
    const handleCreateTransaction = async () => {
        // reset validation errors
        setValidationErrors(null);
        // prepare transaction data
        const transactionData = {
            amount,
            description,
            date: date ? date.toISOString() : new Date().toISOString(), // convert to ISO string (backend expects ISO 8601 format)
            type,
            category_id: categoryId,
        };
        // validate transaction data using Zod schema
        const validatedData = TransactionZodSchema.safeParse(transactionData);
        // if validation fails, set validation errors state to display in the UI
        if (!validatedData.success) {
            console.error(
                "Transaction data validation failed:",
                validatedData.error,
            );
            setValidationErrors(
                validatedData.error.issues
                    .map(
                        (issue) =>
                            `${issue.message} ${validatedData.error.issues.length > 1 ? `and` : ""}`,
                    )
                    .join("\n"),
            );
            return;
        }

        // if validation succeeds, invoke Tauri command to create transaction
        await createTransactionAsync("add_transaction", {
            newTransaction: {
                amount: validatedData.data.amount,
                description: validatedData.data.description,
                date: validatedData.data.date,
                type: validatedData.data.type,
                category_id: validatedData.data.category_id,
            },
        });

        // refetch transactions to update the table
        await refetchTransactions();
    };

    // delete transaction handler
    const handleDeleteTransaction = async (transactionId: number) => {
        // invoke Tauri command to delete transaction
        await deleteTransactionAsync("delete_transaction", {
            transactionId: transactionId,
        });

        // refetch transactions to update the table
        await refetchTransactions();
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <ScreenHeader
                title="Transactions"
                description="Manage your transactions and view transaction history."
            />

            {/* Create Transaction Button */}
            <div className="w-full flex justify-end mb-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Transaction
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Transaction</DialogTitle>
                            <DialogDescription>
                                Here you can create a new transaction. Fill in
                                the details and save it to your transaction
                                history.
                            </DialogDescription>

                            {/* errors */}
                            {isCategoryNamesError && (
                                <ErrorMessageBox
                                    message={
                                        categoryNamesError ??
                                        "An error occurred while fetching category names."
                                    }
                                />
                            )}
                            {validationErrors && (
                                <ErrorMessageBox message={validationErrors} />
                            )}
                            {isCreateTransactionError &&
                                createTransactionError && (
                                    <ErrorMessageBox
                                        message={
                                            createTransactionError ??
                                            "An error occurred while creating the transaction."
                                        }
                                    />
                                )}
                        </DialogHeader>

                        <Separator />

                        <div className="space-y-4">
                            {/* amount, date */}
                            <div className="flex gap-4">
                                {/* amount */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="amount">
                                        Amount{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="amount"
                                        placeholder="0.00"
                                        value={amount || ""}
                                        onChange={(e) =>
                                            setAmount(
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                    />
                                </div>
                                {/* date */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="date">
                                        Date{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date &&
                                                        "text-muted-foreground",
                                                )}
                                            >
                                                {date ? (
                                                    format(date, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <ChevronDownIcon className="ml-auto h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            {/* type, category */}
                            <div className="flex gap-4">
                                {/* type */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="type">
                                        Type{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setType(
                                                value as "INCOME" | "EXPENSE",
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INCOME">
                                                Income
                                            </SelectItem>
                                            <SelectItem value="EXPENSE">
                                                Expense
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* category */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="category">
                                        Category{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setCategoryId(parseInt(value));
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryNames.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* description */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    type="text"
                                    id="description"
                                    placeholder="Description"
                                    value={description || ""}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                onClick={handleCreateTransaction}
                                disabled={
                                    isCategoryNamesLoading ||
                                    isCreateTransactionLoading
                                }
                            >
                                {isCreateTransactionLoading
                                    ? "Creating..."
                                    : "Create Transaction"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Transaction table */}
            <TransactionTable
                transactions={transactions}
                isLoading={isTransactionsLoading}
                isError={transactionsIsError}
                error={transactionsError}
                onDeleteTransaction={handleDeleteTransaction}
                isDeleting={isDeleteTransactionLoading}
            />
        </div>
    );
};

export default TransactionsScreen;
