import React from "react";
import { TransactionWithCategoryType } from "@/zod/transactionSchemas";
import { useTauriQuery } from "../useTauriQuery";

export function useGetTransactions() {
    // Tauri query to fetch transactions from the database
    const {
        data: transactions,
        queryAsync: transactionsQueryAsync,
        isError: transactionsIsError,
        error: transactionsError,
        loading: isTransactionsLoading,
        refetch: refetchTransactions,
        isRefetching: isTransactionsRefetching,
    } = useTauriQuery<TransactionWithCategoryType[], string>();

    // useEffect to set the fetched transactions to the data state
    React.useEffect(() => {
        transactionsQueryAsync("get_all_transactions_with_category", {
            params: {
                start_date: new Date(
                    new Date().setDate(new Date().getDate() - 30),
                ).toISOString(), // last 30 days
                end_date: new Date().toISOString(),
            },
        });
    }, []);

    return {
        transactions,
        transactionsQueryAsync,
        transactionsIsError,
        transactionsError,
        isTransactionsLoading,
        refetchTransactions,
        isTransactionsRefetching,
    };
}
