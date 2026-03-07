import React from "react";
import {
    LastMonthHabitsZodSchema,
    LastMonthHabitsType,
} from "@/zod/reportSchemas";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

// const chartData = [
//     { category_name: "Groceries", total_amount: 186 },
//     { category_name: "Entertainment", total_amount: 305 },
//     { category_name: "Utilities", total_amount: 237 },
//     { category_name: "Transportation", total_amount: 73 },
//     { category_name: "Saas", total_amount: 209 },
//     { category_name: "Salary", total_amount: 214 },
// ];
const chartConfig = {
    total_amount: {
        label: "Amount",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

const LastMonthHabits = () => {
    // State for last month habits data
    const [lastMonthHabitsData, setLastMonthHabitsData] = React.useState<
        LastMonthHabitsType[]
    >([]);
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    // Tauri query for last month habits data
    const {
        data: lastMonthHabitsQueryData,
        loading: lastMonthHabitsQueryLoading,
        isError: lastMonthHabitsQueryIsError,
        error: lastMonthHabitsQueryError,
        queryAsync: lastMonthHabitsQueryAsync,
    } = useTauriQuery<LastMonthHabitsType[], string>();

    // Effect to fetch last month habits data on mount
    React.useEffect(() => {
        lastMonthHabitsQueryAsync("get_last_month_habits", {
            request: {
                month: new Date().getMonth() + 1, // get last month (0-indexed, so no need to add 1)
                year: new Date().getFullYear(), // get current year
            },
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle last month habits query data and validate it with Zod
    React.useEffect(() => {
        if (lastMonthHabitsQueryData) {
            const parsedData = LastMonthHabitsZodSchema.array().safeParse(
                lastMonthHabitsQueryData,
            );
            if (!parsedData.success) {
                console.error(
                    "Failed to parse last month habits data:",
                    parsedData.error,
                );
                setValidationError(
                    "Failed to load last month habits data. Please try again.",
                );
                setLastMonthHabitsData([]);
            } else {
                setLastMonthHabitsData(parsedData.data);
                setValidationError(null);
                // console.log("Parsed last month habits data:", parsedData.data);
            }
        }
    }, [lastMonthHabitsQueryData]);

    // handle loading states
    if (lastMonthHabitsQueryLoading) {
        return <div>Loading...</div>;
    }

    // handle error states
    if (lastMonthHabitsQueryIsError) {
        return (
            <ErrorMessageBox
                message={
                    lastMonthHabitsQueryError ||
                    "An unknown error occurred while loading last month habits data. Please try again."
                }
            />
        );
    }

    // handle validation error states
    if (validationError) {
        return <ErrorMessageBox message={validationError} />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>This month's spending habits</CardTitle>
                <CardDescription>
                    An area chart showing your spending habits for the this
                    month.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-100 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={lastMonthHabitsData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="category_name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            // tickFormatter={(value) => value.slice(0, 12)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="total_amount"
                            type="natural"
                            fill="var(--color-total_amount)"
                            fillOpacity={0.4}
                            stroke="var(--color-total_amount)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                        Spending habits for the this month.
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default LastMonthHabits;
