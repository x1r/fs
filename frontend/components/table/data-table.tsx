"use client";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    VisibilityState
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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onAdd?: () => void;
    onDelete?: (rows: TData[]) => void;
    onPaginationChange?: (pagination: PaginationState) => void; // Now accepts full PaginationState
    pageIndex?: number;
    pageSize?: number;
    totalRows: number;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             onAdd,
                                             onDelete,
                                             onPaginationChange,
                                             pageIndex = 0,
                                             pageSize = 10,
                                             totalRows,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [selectedFilterColumn, setSelectedFilterColumn] = useState<string>("");
    const totalPages = Math.ceil(totalRows / pageSize);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: (updaterOrValue) => {
            if (typeof updaterOrValue === "function") {
                const newState = updaterOrValue({pageIndex, pageSize});
                onPaginationChange?.(newState);
            } else {
                onPaginationChange?.(updaterOrValue);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        manualPagination: true,
        pageCount: totalPages,
    });

    const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

    return (
        <div className="h-full w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder={
                            selectedFilterColumn
                                ? `Type ${
                                    columns.find((col) => col.id === selectedFilterColumn)?.header ||
                                    selectedFilterColumn
                                }`
                                : "Select column"
                        }
                        value={
                            selectedFilterColumn
                                ? (table.getColumn(selectedFilterColumn)?.getFilterValue() as string) || ""
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
                                        columns.find((col) => col.id === selectedFilterColumn)?.header ||
                                        selectedFilterColumn
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
                        <Button variant="destructive" onClick={() => onDelete(selectedRows)}>
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
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">

                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                    selected.
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center gap-2">

                    <Select
                        value={String(pageSize)}
                        onValueChange={(value) => {
                            onPaginationChange?.({pageIndex, pageSize: Number(value)});
                        }}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Page size"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                            <SelectItem value="50">50 per page</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onPaginationChange?.({ pageIndex: pageIndex - 1, pageSize });
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onPaginationChange?.({ pageIndex: pageIndex + 1, pageSize });
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
