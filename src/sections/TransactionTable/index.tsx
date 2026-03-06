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

    const fetchData = async () => {
        const data = await getData();
        return data;
    };

    React.useEffect(() => {
        fetchData().then((data) => setData(data));
    }, []);

    return (
        <div className="w-full">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
