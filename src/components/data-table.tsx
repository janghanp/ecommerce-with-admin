"use client";

import { useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import AlertModal from "@/src/components/alert-modal";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey: string;
    deleteHandler: (ids: string[]) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    deleteHandler,
}: DataTableProps<TData, TValue>) {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            rowSelection,
        },
    });

    const deleteEntities = async () => {
        setIsLoading(true);

        try {
            const ids = table.getFilteredSelectedRowModel().rows.map((row) => {
                // @ts-ignore
                return row.original.id as string;
            });

            await deleteHandler(ids);

            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setIsOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <>
            <AlertModal
                isLoading={isLoading}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={deleteEntities}
            />
            <div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search"
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>

                <div className="flex items-center mb-3 h-10 gap-x-5">
                    <div className="text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>

                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
                            <Trash className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
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
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}
