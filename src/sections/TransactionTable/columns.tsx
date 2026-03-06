import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { TransactionWithCategoryType } from "@/zod/transactionSchemas";
import { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    TrendingUp,
    TrendingDown,
    Tag,
    Calendar,
} from "lucide-react";

export const columns: ColumnDef<TransactionWithCategoryType>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div className="flex w-full justify-center items-center">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="font-semibold"
                    >
                        ID
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <div className="text-center font-mono text-sm text-muted-foreground">
                    #{id}
                </div>
            );
        },
    },
    {
        accessorKey: "category_name",
        header: () => (
            <div className="text-left font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Category
            </div>
        ),
        cell: ({ row }) => {
            const categoryName = row.original.category_name || "Uncategorized";
            return (
                <div className="text-left">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {categoryName}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "description",
        header: () => (
            <div className="text-left font-semibold">Description</div>
        ),
        cell: ({ row }) => {
            const description = row.original.description || "No description";
            return (
                <div className="text-left max-w-md">
                    <p className="text-sm font-medium leading-tight line-clamp-2">
                        {description}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: () => <div className="text-center font-semibold">Type</div>,
        cell: ({ row }) => {
            const type = row.original.type;

            const isIncome = type === "INCOME";
            const isExpense = type === "EXPENSE";

            return (
                <div className="flex justify-center">
                    {isIncome && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                            <TrendingUp className="h-3 w-3" />
                            Income
                        </span>
                    )}
                    {isExpense && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                            <TrendingDown className="h-3 w-3" />
                            Expense
                        </span>
                    )}
                    {!isIncome && !isExpense && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-600">
                            Unknown
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <div className="flex w-full justify-end items-end">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="font-semibold"
                    >
                        Amount
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const amount = formatCurrency(row.original.amount);
            const type = row.original.type;
            const isIncome = type === "INCOME";
            const isExpense = type === "EXPENSE";

            const colorClass = isIncome
                ? "text-green-600 dark:text-green-400"
                : isExpense
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground";

            const sign = isIncome ? "+" : isExpense ? "-" : "";

            return (
                <div className="text-right font-semibold text-sm">
                    <span className={colorClass}>
                        {sign}
                        {amount}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "date",
        header: () => (
            <div className="text-right font-semibold flex items-center justify-end gap-2">
                <Calendar className="h-4 w-4" />
                Date
            </div>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const formattedDate = Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }).format(date);
            const formattedTime = Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);

            return (
                <div className="text-right">
                    <div className="text-sm font-medium">{formattedDate}</div>
                    <div className="text-xs text-muted-foreground">
                        {formattedTime}
                    </div>
                </div>
            );
        },
    },
];
