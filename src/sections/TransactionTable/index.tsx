import React from "react";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
    TransactionWithCategoryType,
    TransactionWithCategoryZodSchema,
} from "@/zod/transactionSchemas";

// async function getData(): Promise<TransactionWithCategoryType[]> {
//     const status = ["INCOME", "EXPENSE"] as const;
//     // Fetch data from your API here.
//     return Array.from({ length: 100 }, (_, i) => ({
//         id: Math.floor(Math.random() * 1000),
//         amount: Math.floor(Math.random() * 10000) / 100,
//         description: `Transaction Transaction Transaction ${i + 1}`,
//         date: new Date().toISOString(),
//         type: status[Math.floor(Math.random() * status.length)],
//         category_id: Math.floor(Math.random() * 100),
//         category_name: `Category ${Math.floor(Math.random() * 100)}`,
//         created_at: new Date().toISOString(),
//     }));
// }

interface TransactionTableProps {
    transactions: TransactionWithCategoryType[] | null;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
}

export default function TransactionTable({
    transactions,
    isLoading,
    isError,
    error,
}: TransactionTableProps) {
    const [data, setData] = React.useState<TransactionWithCategoryType[]>([]);
    const [transactionValidationError, setTransactionValidationError] =
        React.useState<string | null>(null);

    // useEffect to update the data state when transactions are fetched
    React.useEffect(() => {
        if (transactions && !isLoading && !isError) {
            const validatedTransactions =
                TransactionWithCategoryZodSchema.array().safeParse(
                    transactions,
                );
            if (validatedTransactions.success) {
                setData(validatedTransactions.data);
            } else {
                console.error(
                    "Failed to validate transactions:",
                    validatedTransactions.error,
                );
                setTransactionValidationError(
                    "Failed to validate transactions",
                );
            }
        }
    }, [isLoading, transactions, isError]);

    if (isLoading) {
        return (
            <div className="w-full rounded-lg border bg-card shadow-sm p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">
                        Loading transactions...
                    </p>
                </div>
            </div>
        );
    }

    if (isError || transactionValidationError) {
        const errorMessage = error ?? "Failed to fetch transactions";
        return (
            <div className="w-full rounded-lg border bg-card shadow-sm p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        {isError ? errorMessage : transactionValidationError}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
