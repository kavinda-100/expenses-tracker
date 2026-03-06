import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { TransactionWithCategoryType } from "@/zod/transactionSchemas";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<TransactionWithCategoryType>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div className="flex w-full justify-end items-end">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const id = row.original.id;
            return <div className="text-right">{id}</div>;
        },
    },
    {
        accessorKey: "category_name",
        header: () => <div className="text-right font-bold">Category</div>,
        cell: ({ row }) => {
            const categoryName = row.original.category_name || "Uncategorized";
            return <div className="text-right truncate">{categoryName}</div>;
        },
    },
    {
        accessorKey: "description",
        header: () => <div className="text-right font-bold">Description</div>,
        cell: ({ row }) => {
            const description = row.original.description || "No description";
            return (
                <div className="text-right truncate max-w-4xl">
                    {description}
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: () => <div className="text-right font-bold">Type</div>,
        cell: ({ row }) => {
            const type = row.original.type;

            const typeLabel =
                type === "INCOME"
                    ? "Income"
                    : type === "EXPENSE"
                      ? "Expense"
                      : "Unknown";

            return <div className={`text-right`}>{typeLabel}</div>;
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
                    >
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const amount = formatCurrency(row.original.amount);
            const type = row.original.type;
            const color =
                type === "INCOME"
                    ? "text-green-500"
                    : type === "EXPENSE"
                      ? "text-red-500"
                      : "text-gray-500";
            const sign =
                type === "INCOME" ? "+" : type === "EXPENSE" ? "-" : "";

            return (
                <div className={`text-right`}>
                    <span className={`${color} mr-1 font-bold`}>{sign}</span>
                    {amount}
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: () => <div className="text-right font-bold">Created At</div>,
        cell: ({ row }) => {
            const date = Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(row.original.created_at));

            return <div className="text-right">{date}</div>;
        },
    },
];
