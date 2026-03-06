import React from "react";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TransactionWithCategoryType } from "@/zod/transactionSchemas";

async function getData(): Promise<TransactionWithCategoryType[]> {
    const status = ["INCOME", "EXPENSE"] as const;
    // Fetch data from your API here.
    return Array.from({ length: 100 }, (_, i) => ({
        id: Math.floor(Math.random() * 1000),
        amount: Math.floor(Math.random() * 10000) / 100,
        description: `Transaction Transaction Transaction ${i + 1}`,
        date: new Date().toISOString(),
        type: status[Math.floor(Math.random() * status.length)],
        category_id: Math.floor(Math.random() * 100),
        category_name: `Category ${Math.floor(Math.random() * 100)}`,
        created_at: new Date().toISOString(),
    }));
}

export default function TransactionTable() {
    const [data, setData] = React.useState<TransactionWithCategoryType[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getData();
            setData(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

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

    return (
        <div className="w-full">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
