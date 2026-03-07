import React from "react";
import {
    RecentTransactionsZodSchema,
    RecentTransactionsType,
} from "@/zod/dashboardSchemas";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn, getCurrencyFormat } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const RecentTransactions = () => {
    // State for recent transactions data
    const [recentTransactionsData, setRecentTransactionsData] = React.useState<
        RecentTransactionsType[]
    >([]);
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    const [limit, setLimit] = React.useState<number>(5);
    // Tauri query for recent transactions data
    const {
        data: recentTransactionsQueryData,
        loading: recentTransactionsQueryLoading,
        isError: recentTransactionsQueryIsError,
        error: recentTransactionsQueryError,
        queryAsync: recentTransactionsQueryAsync,
    } = useTauriQuery<RecentTransactionsType[], string>();

    // Effect to fetch recent transactions data on mount
    React.useEffect(() => {
        recentTransactionsQueryAsync("get_recent_transactions", {
            limit: limit,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit]);

    // Effect to handle recent transactions query data and validate it with Zod
    React.useEffect(() => {
        if (recentTransactionsQueryData) {
            const parsedData = RecentTransactionsZodSchema.array().safeParse(
                recentTransactionsQueryData,
            );
            if (!parsedData.success) {
                console.error(
                    "Failed to parse recent transactions data:",
                    parsedData.error,
                );
                setValidationError(
                    "Failed to load recent transactions data. Please try again.",
                );
                return;
            }
            setRecentTransactionsData(parsedData.data);
        }
    }, [recentTransactionsQueryData]);

    // handle loading states
    if (recentTransactionsQueryLoading) {
        return <div>Loading...</div>;
    }

    // handle error states
    if (recentTransactionsQueryIsError) {
        return (
            <ErrorMessageBox
                message={recentTransactionsQueryError || "Unknown error"}
            />
        );
    }

    // handle validation error states
    if (validationError) {
        return <ErrorMessageBox message={validationError} />;
    }

    return (
        <Card>
            <CardHeader className="flex justify-between gap-2">
                <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    {recentTransactionsData.length > 0 && (
                        <CardDescription>
                            Here are your {recentTransactionsData.length} most
                            recent transactions.
                        </CardDescription>
                    )}
                </div>

                {/* limit select */}
                <Select
                    value={limit.toString()}
                    onValueChange={(value) => setLimit(parseInt(value))}
                >
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent>
                {recentTransactionsData.length === 0 ? (
                    <p>No recent transactions found.</p>
                ) : (
                    <ul className="space-y-3">
                        {recentTransactionsData.map((transaction, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center p-3 shadow hover:bg-muted transition-colors rounded-md"
                            >
                                <div className="flex flex-col gap-3">
                                    <p className="font-medium">
                                        {transaction.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {Intl.DateTimeFormat("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }).format(new Date(transaction.date))}
                                    </p>
                                </div>
                                <p
                                    className={cn("font-bold", {
                                        "text-green-600":
                                            transaction.type === "INCOME",
                                        "text-red-900":
                                            transaction.type === "EXPENSE",
                                    })}
                                >
                                    {Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: getCurrencyFormat(),
                                    }).format(transaction.amount)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;
