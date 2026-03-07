import React from "react";
import {
    ExpenseByCategoryZodSchema,
    ExpenseByCategoryType,
} from "@/zod/reportSchemas";
import { useTauriQuery } from "@/hooks/useTauriQuery";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import { Pie, PieChart } from "recharts";
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
import { generateBlueChartPalette } from "@/lib/utils";
// export const description = "A simple pie chart";
// const chartData = [
//     { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//     { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//     { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//     { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//     { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ];

// const chartConfig = {
//     visitors: {
//         label: "Visitors",
//     },
//     chrome: {
//         label: "Chrome",
//         color: "var(--chart-1)",
//     },
//     safari: {
//         label: "Safari",
//         color: "var(--chart-2)",
//     },
//     firefox: {
//         label: "Firefox",
//         color: "var(--chart-3)",
//     },
//     edge: {
//         label: "Edge",
//         color: "var(--chart-4)",
//     },
//     other: {
//         label: "Other",
//         color: "var(--chart-5)",
//     },
// } satisfies ChartConfig;

// Function to generate random color for pie slices
// const generateRandomColor = () => {
//     const letters = "0123456789ABCDEF";
//     let color = "#";
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// };

// Function to generate chart data from expense by category data
const generateChartData = (data: ExpenseByCategoryType[]) => {
    const blueColors = generateBlueChartPalette(data.length);
    return data.map((item) => ({
        name: item.category_name,
        value: item.total_expense,
        fill: blueColors[data.indexOf(item)],
    }));
};

// Function to generate chart config from expense by category data
const generateChartConfig = (data: ExpenseByCategoryType[]) => {
    const blueColors = generateBlueChartPalette(data.length);
    const config: ChartConfig = {};
    data.forEach((item) => {
        config[item.category_name] = {
            label: item.category_name,
            color: blueColors[data.indexOf(item)],
        };
    });
    return config;
};

const GetExpenseByCategory = () => {
    // State for expense by category data
    const [expenseByCategoryData, setExpenseByCategoryData] = React.useState<
        ExpenseByCategoryType[]
    >([]);
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    // Tauri query for expense by category data
    const {
        data: expenseByCategoryQueryData,
        loading: expenseByCategoryQueryLoading,
        isError: expenseByCategoryQueryIsError,
        error: expenseByCategoryQueryError,
        queryAsync: expenseByCategoryQueryAsync,
    } = useTauriQuery<ExpenseByCategoryType[], string>();

    // Effect to fetch expense by category data on mount
    React.useEffect(() => {
        expenseByCategoryQueryAsync("get_expense_by_category");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle expense by category query data and validate it with Zod
    React.useEffect(() => {
        if (expenseByCategoryQueryData) {
            const parsedData = ExpenseByCategoryZodSchema.array().safeParse(
                expenseByCategoryQueryData,
            );
            if (!parsedData.success) {
                console.error(
                    "Failed to parse expense by category data:",
                    parsedData.error,
                );
                setValidationError(
                    "Failed to load expense by category data. Please try again.",
                );
                return;
            }
            setExpenseByCategoryData(parsedData.data);
        }
    }, [expenseByCategoryQueryData]);

    // handle loading states
    if (expenseByCategoryQueryLoading) {
        return <div>Loading...</div>;
    }

    // handle error states
    if (expenseByCategoryQueryIsError) {
        return (
            <ErrorMessageBox
                message={
                    expenseByCategoryQueryError ||
                    "An error occurred while fetching expense by category data."
                }
            />
        );
    }

    // handle validation error states
    if (validationError) {
        return <ErrorMessageBox message={validationError} />;
    }
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Expense by Category</CardTitle>
                <CardDescription>
                    A pie chart showing the distribution of expenses across
                    different categories
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={generateChartConfig(expenseByCategoryData)}
                    className="mx-auto aspect-square max-h-62.5"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={generateChartData(expenseByCategoryData)}
                            dataKey="value"
                            nameKey="name"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="leading-none text-muted-foreground">
                    Total Expense:{" "}
                    {expenseByCategoryData.reduce(
                        (acc, item) => acc + item.total_expense,
                        0,
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};

export default GetExpenseByCategory;
