"use client";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {ChevronDown, Plus, Trash2} from "lucide-react";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onAdd?: () => void;
    onDelete?: (rows: TData[]) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             onAdd,
                                             onDelete,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [selectedFilterColumn, setSelectedFilterColumn] = useState<string>("");

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);

    return (
        <div className="h-full w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* Dropdown для выбора колонки */}
                    {/* Поле ввода для фильтрации */}
                    <Input
                        placeholder=
                            {selectedFilterColumn
                                ? `Type ${
                                    columns.find((col) => col.id === selectedFilterColumn)?.header || selectedFilterColumn
                                }`
                                : "Select column"}

                        value={
                            selectedFilterColumn
                                ? (table.getColumn(selectedFilterColumn)?.getFilterValue() as string) ?? ""
                                : ""
                        }
                        onChange={(event) =>
                            selectedFilterColumn &&
                            table.getColumn(selectedFilterColumn)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                        disabled={!selectedFilterColumn}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {selectedFilterColumn
                                    ? `Filter by: ${
                                        columns.find((col) => col.id === selectedFilterColumn)?.header || selectedFilterColumn
                                    }`
                                    : "Select column"}
                            </Button>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {columns
                                .filter((column) => column.header && column.header !== "Actions" && column.id !== "select")
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={selectedFilterColumn === column.id}
                                        onCheckedChange={() => setSelectedFilterColumn(column.id as string)}
                                    >
                                        {column.header as string}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>


                </div>
                <div className="flex items-center gap-2">
                    {onDelete && selectedRows.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => onDelete(selectedRows)}
                        >
                            <Trash2 className="mr-2 h-4 w-4"/>
                            Delete {selectedRows.length} Item(s)
                        </Button>
                    )}
                    {onAdd && (
                        <Button onClick={onAdd}>
                            <Plus className="mr-2 h-4 w-4"/> Add New
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
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
        </div>
    );
}
