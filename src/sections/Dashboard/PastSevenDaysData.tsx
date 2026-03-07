import React from "react";
import {
    PastSevenDaysDataZodSchema,
    PastSevenDaysDataType,
} from "@/zod/dashboardSchemas";
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
export const description = "A bar chart";

// const chartData = [
//     { day: "Monday", total_expense: 186, total_income: 80 },
//     { day: "Tuesday", total_expense: 305, total_income: 200 },
//     { day: "Wednesday", total_expense: 237, total_income: 120 },
//     { day: "Thursday", total_expense: 73, total_income: 190 },
//     { day: "Friday", total_expense: 209, total_income: 130 },
//     { day: "Saturday", total_expense: 214, total_income: 140 },
//     { day: "Sunday", total_expense: 152, total_income: 100 },
// ];

const chartConfig = {
    total_expense: {
        label: "Expense",
        color: "var(--chart-1)",
    },
    total_income: {
        label: "Income",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

const PastSevenDaysData = () => {
    // State for past seven days data
    const [pastSevenDaysData, setPastSevenDaysData] = React.useState<
        PastSevenDaysDataType[]
    >([]);
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    // Tauri query for past seven days data
    const {
        data: pastSevenDaysQueryData,
        loading: pastSevenDaysQueryLoading,
        isError: pastSevenDaysQueryIsError,
        error: pastSevenDaysQueryError,
        queryAsync: pastSevenDaysQueryAsync,
    } = useTauriQuery<PastSevenDaysDataType[], string>();

    // Effect to fetch past seven days data on mount
    React.useEffect(() => {
        pastSevenDaysQueryAsync("get_past_seven_days_data");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle past seven days query data and validate it with Zod
    React.useEffect(() => {
        if (pastSevenDaysQueryData) {
            const parsedData = PastSevenDaysDataZodSchema.array().safeParse(
                pastSevenDaysQueryData,
            );
            if (!parsedData.success) {
                console.error(
                    "Failed to parse past seven days data:",
                    parsedData.error,
                );
                setValidationError(
                    "Failed to load past seven days data. Please try again.",
                );
                return;
            }
            // day getting as '2026-03-04`, we need to convert it to a more readable format like 'Wednesday'
            const formattedData = parsedData.data.map((item) => {
                const date = new Date(item.day);
                const dayName = date.toLocaleDateString("en-US", {
                    weekday: "long",
                });
                return {
                    day: dayName,
                    total_expense: item.total_expense,
                    total_income: item.total_income,
                };
            });
            setPastSevenDaysData(formattedData);
            // console.log("Parsed past seven days data:", formattedData);
        }
    }, [pastSevenDaysQueryData]);

    // handle loading states
    if (pastSevenDaysQueryLoading) {
        return <div>Loading past seven days data...</div>;
    }

    if (pastSevenDaysQueryIsError) {
        return (
            <ErrorMessageBox
                message={
                    pastSevenDaysQueryError ||
                    "Failed to load past seven days data."
                }
            />
        );
    }

    // handle validation error
    if (validationError) {
        return <ErrorMessageBox message={validationError} />;
    }

    // main jsx
    return (
        <Card>
            <CardHeader>
                <CardTitle>Past Seven Days</CardTitle>
                <CardDescription>
                    A bar chart showing total income and expenses for the past 7
                    days.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={pastSevenDaysData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="total_expense"
                            fill="var(--color-total_expense)"
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
                    Showing total income and expenses form the past 7 days.
                </div>
            </CardFooter>
        </Card>
    );
};

export default PastSevenDaysData;
