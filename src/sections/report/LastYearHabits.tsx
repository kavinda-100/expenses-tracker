import React from "react";
import {
    LastYearHabitsZodSchema,
    LastYearHabitsType,
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

const LastYearHabits = () => {
    // State for last year habits data
    const [lastYearHabitsData, setLastYearHabitsData] = React.useState<
        LastYearHabitsType[]
    >([]);
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    // Tauri query for last year habits data
    const {
        data: lastYearHabitsQueryData,
        loading: lastYearHabitsQueryLoading,
        isError: lastYearHabitsQueryIsError,
        error: lastYearHabitsQueryError,
        queryAsync: lastYearHabitsQueryAsync,
    } = useTauriQuery<LastYearHabitsType[], string>();

    // Effect to fetch last year habits data on mount
    React.useEffect(() => {
        lastYearHabitsQueryAsync("get_last_year_habits", {
            request: {
                year: new Date().getFullYear(), // get current year
            },
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle last year habits query data and validate it with Zod
    React.useEffect(() => {
        if (lastYearHabitsQueryData) {
            const parsedData = LastYearHabitsZodSchema.array().safeParse(
                lastYearHabitsQueryData,
            );
            if (!parsedData.success) {
                console.error(
                    "Failed to parse last year habits data:",
                    parsedData.error,
                );
                setValidationError(
                    "Failed to load last year habits data. Please try again.",
                );
                setLastYearHabitsData([]);
            } else {
                setLastYearHabitsData(parsedData.data);
                setValidationError(null);
                // console.log("Parsed last year habits data:", parsedData.data);
            }
        }
    }, [lastYearHabitsQueryData]);

    // handle loading states
    if (lastYearHabitsQueryLoading) {
        return <div>Loading...</div>;
    }

    // handle error states
    if (lastYearHabitsQueryIsError) {
        return (
            <ErrorMessageBox
                message={
                    lastYearHabitsQueryError ||
                    "An unknown error occurred while loading last year habits data. Please try again."
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
                <CardTitle>This year's spending habits</CardTitle>
                <CardDescription>
                    An area chart showing your spending habits for the this
                    year.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-100 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={lastYearHabitsData}
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
                        Spending habits for the this year.
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default LastYearHabits;
