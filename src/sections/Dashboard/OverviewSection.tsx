import ErrorMessageBox from "@/components/ErrorMessageBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import { cn, formatCurrency } from "@/lib/utils";
import {
    DashboardOverviewType,
    DashboardOverviewZodSchema,
} from "@/zod/dashboardSchemas";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
} from "lucide-react";
import React from "react";

const OverviewSection = () => {
    // State for overview data
    const [overviewData, setOverviewData] =
        React.useState<DashboardOverviewType>({
            total_income: 0,
            total_expenses: 0,
            net_balance: 0,
        });
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    // Tauri query for overview data
    const {
        data: overviewQueryData,
        loading: overviewQueryLoading,
        isError: overviewQueryIsError,
        error: overviewQueryError,
        queryAsync: overviewQueryAsync,
    } = useTauriQuery<DashboardOverviewType, string>();

    // Effect to fetch overview data on mount
    React.useEffect(() => {
        overviewQueryAsync("get_dashboard_overview");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle overview query data and validate it with Zod
    React.useEffect(() => {
        if (overviewQueryData) {
            const parsedData =
                DashboardOverviewZodSchema.safeParse(overviewQueryData);
            if (!parsedData.success) {
                console.error(
                    "Failed to parse overview data:",
                    parsedData.error,
                );
                setValidationError(
                    "Failed to load overview data. Please try again.",
                );
                return;
            }
            setOverviewData(parsedData.data);
        }
    }, [overviewQueryData]);

    // handle loading states
    if (overviewQueryLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-25" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-37.5" />
                            <Skeleton className="h-4 w-25 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    //  handle query error
    if (overviewQueryIsError) {
        return (
            <ErrorMessageBox
                message={
                    overviewQueryError ||
                    "An error occurred while loading overview data."
                }
            />
        );
    }

    // handle validation error
    if (validationError) {
        return <ErrorMessageBox message={validationError} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <OverviewCard
                title="Total Income"
                icon={TrendingUp}
                iconColor="text-green-600 dark:text-green-500"
                iconBgColor="bg-green-100 dark:bg-green-950"
                value={overviewData.total_income}
                trend={
                    overviewData.total_income >= overviewData.total_expenses
                        ? "positive"
                        : "negative"
                }
            />

            <OverviewCard
                title="Total Expenses"
                icon={TrendingDown}
                iconColor="text-red-600 dark:text-red-500"
                iconBgColor="bg-red-100 dark:bg-red-950"
                value={overviewData.total_expenses}
                trend={
                    overviewData.total_expenses >= overviewData.total_income
                        ? "negative"
                        : "positive"
                }
            />

            <OverviewCard
                title="Net Balance"
                icon={Wallet}
                iconColor={
                    overviewData.net_balance >= 0
                        ? "text-blue-600 dark:text-blue-500"
                        : "text-orange-600 dark:text-orange-500"
                }
                iconBgColor={
                    overviewData.net_balance >= 0
                        ? "bg-blue-100 dark:bg-blue-950"
                        : "bg-orange-100 dark:bg-orange-950"
                }
                value={overviewData.net_balance}
                trend={overviewData.net_balance >= 0 ? "positive" : "negative"}
                showTrendIcon
            />
        </div>
    );
};

export default OverviewSection;

type OverviewCardProps = {
    title: string;
    icon: React.ElementType;
    iconColor: string;
    iconBgColor: string;
    value: number;
    trend: "positive" | "negative";
    showTrendIcon?: boolean;
};

// display card
const OverviewCard = ({
    title,
    icon: Icon,
    iconColor,
    iconBgColor,
    value,
    trend,
    showTrendIcon = false,
}: OverviewCardProps) => {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn("p-2 rounded-full", iconBgColor)}>
                    <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline justify-between">
                    <div className="space-y-1">
                        <p className="text-2xl font-bold">
                            {formatCurrency(value)}
                        </p>
                        {showTrendIcon && (
                            <div className="flex items-center gap-1 text-xs">
                                {trend === "positive" ? (
                                    <ArrowUpCircle className="w-3 h-3 text-green-600 dark:text-green-500" />
                                ) : (
                                    <ArrowDownCircle className="w-3 h-3 text-red-600 dark:text-red-500" />
                                )}
                                <span
                                    className={cn(
                                        "font-medium",
                                        trend === "positive"
                                            ? "text-green-600 dark:text-green-500"
                                            : "text-red-600 dark:text-red-500",
                                    )}
                                >
                                    {trend === "positive"
                                        ? "Surplus"
                                        : "Deficit"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
