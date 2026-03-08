import React from "react";
import {
    YearlyOverviewType,
    YearlyOverviewZodSchema,
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

// Helper function to convert month number to month string (e.g., 0 -> "January", 1 -> "February", etc.)
const convertNumberToMonth = (month: number) => {
    const year = new Date().getFullYear(); // get current year
    const date = new Date(year, month - 1); // create a date object with the given month and current year
    // return the month name as a string (e.g., "January", "February", etc.)
    return Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
};

const YearlyOverview = () => {
    // State for yearly overview data
    const [yearlyOverviewData, setYearlyOverviewData] = React.useState<
        YearlyOverviewType[]
    >([]);
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    // Tauri query for yearly overview data
    const {
        data: yearlyOverviewQueryData,
        loading: yearlyOverviewQueryLoading,
        isError: yearlyOverviewQueryIsError,
        error: yearlyOverviewQueryError,
        queryAsync: yearlyOverviewQueryAsync,
    } = useTauriQuery<YearlyOverviewType[], string>();

    // Effect to fetch yearly overview data on mount
    React.useEffect(() => {
        yearlyOverviewQueryAsync("get_yearly_overview", {
            request: {
                year: new Date().getFullYear(), // get current year
            },
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle yearly overview query data and validate it with Zod
    React.useEffect(() => {
        if (yearlyOverviewQueryData) {
            const parsedData = YearlyOverviewZodSchema.array().safeParse(
                yearlyOverviewQueryData,
            );
            if (!parsedData.success) {
                console.error(
                    "Failed to parse yearly overview data:",
                    parsedData.error,
                );
                setValidationError(
                    "Failed to load yearly overview data. Please try again.",
                );
                return;
            }
            setYearlyOverviewData(parsedData.data);
            // console.log("Parsed yearly overview data:", parsedData.data);
        }
    }, [yearlyOverviewQueryData]);

    // handle loading states
    if (yearlyOverviewQueryLoading) {
        return <div>Loading...</div>;
    }

    // handle error states
    if (yearlyOverviewQueryIsError) {
        return (
            <ErrorMessageBox
                message={
                    yearlyOverviewQueryError ||
                    "An error occurred while fetching yearly overview data."
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
                <CardTitle>Yearly Overview</CardTitle>
                <CardDescription>
                    A bar chart showing total income and expenses for the this
                    year.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-100 w-full"
                >
                    <BarChart accessibilityLayer data={yearlyOverviewData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                convertNumberToMonth(value)
                            }
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
                    Showing total income and expenses for the this year.
                </div>
            </CardFooter>
        </Card>
    );
};

export default YearlyOverview;
