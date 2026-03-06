import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <div className="w-full space-y-4">
            <div className="rounded-lg border bg-card shadow-sm">
                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="hover:bg-transparent border-b"
                                >
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="bg-muted/50 font-semibold h-12 px-8"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-4 px-8"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="48"
                                                height="48"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-20"
                                            >
                                                <rect
                                                    width="18"
                                                    height="18"
                                                    x="3"
                                                    y="3"
                                                    rx="2"
                                                />
                                                <path d="M3 9h18" />
                                                <path d="M9 21V9" />
                                            </svg>
                                            <p className="text-sm font-medium">
                                                No transactions found
                                            </p>
                                            <p className="text-xs">
                                                Add your first transaction to
                                                get started
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                        {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium">
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) *
                                table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length,
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                        {table.getFilteredRowModel().rows.length}
                    </span>{" "}
                    transactions
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
