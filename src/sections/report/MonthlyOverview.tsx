import React from "react";
import {
    MonthlyOverviewType,
    MonthlyOverviewZodSchema,
} from "@/zod/reportSchemas";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

const chartConfig = {
    total_income: {
        label: "Income",
        color: "var(--chart-2)",
    },
    total_expenses: {
        label: "Expense",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

// Helper function to convert day number to day string (e.g., 1 -> "Monday", 2 -> "Tuesday", etc.)
const convertNumberToDay = (day: number) => {
    const month = new Date().getMonth(); // get current month
    const year = new Date().getFullYear(); // get current year
    const date = new Date(year, month, day); // create a date object with the given day, current month and year
    // return the day of the week as a string (e.g., "Monday", "Tuesday", etc.)
    return Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
};

const MonthlyOverview = () => {
    // State for monthly overview data
    const [monthlyOverviewData, setMonthlyOverviewData] = React.useState<
        MonthlyOverviewType[]
    >([]);
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    // Tauri query for monthly overview data
    const {
        data: monthlyOverviewQueryData,
        loading: monthlyOverviewQueryLoading,
        isError: monthlyOverviewQueryIsError,
        error: monthlyOverviewQueryError,
        queryAsync: monthlyOverviewQueryAsync,
    } = useTauriQuery<MonthlyOverviewType[], string>();

    // Effect to fetch monthly overview data on mount
    React.useEffect(() => {
        monthlyOverviewQueryAsync("get_monthly_overview", {
            request: {
                month: new Date().getMonth() + 1, // get current month (0-indexed, so add 1)
                year: new Date().getFullYear(), // get current year
            },
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle monthly overview query data and validate it with Zod
    React.useEffect(() => {
        if (monthlyOverviewQueryData) {
            const parsedData = MonthlyOverviewZodSchema.array().safeParse(
                monthlyOverviewQueryData,
            );
            if (!parsedData.success) {
                console.error(
                    "Failed to parse monthly overview data:",
                    parsedData.error,
                );
                setValidationError(
                    "Failed to load monthly overview data. Please try again.",
                );
                return;
            }
            setMonthlyOverviewData(parsedData.data);
            // console.log("Parsed monthly overview data:", parsedData.data);
        }
    }, [monthlyOverviewQueryData]);

    // handle loading states
    if (monthlyOverviewQueryLoading) {
        return <div>Loading...</div>;
    }

    // handle error states
    if (monthlyOverviewQueryIsError) {
        return (
            <ErrorMessageBox
                message={
                    monthlyOverviewQueryError ||
                    "An error occurred while fetching monthly overview data."
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
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>
                    A bar chart showing total income and expenses for the This
                    month.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-100 w-full"
                >
                    <BarChart accessibilityLayer data={monthlyOverviewData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => convertNumberToDay(value)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="total_expenses"
                            fill="var(--color-total_expenses)"
                            radius={4}
                        />
                        <Bar
                            dataKey="total_income"
                            fill="var(--color-total_income)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="leading-none text-muted-foreground">
                    Showing total income and expenses for the this month.
                </div>
            </CardFooter>
        </Card>
    );
};

export default MonthlyOverview;
