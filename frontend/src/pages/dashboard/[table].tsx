import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {AppSidebar} from "@/components/app-sidebar";
import {DataTable} from "@/components/table/data-table";
import {actionsColumn, baseColumns, selectionColumn} from "@/lib/tables-columns";
import {CRUD} from "@/src/utils/api";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import RecordDialog from "@/components/record-dialog";
// import {useSession} from "next-auth/react";

const DashboardTable = () => {
    // const {data: session, status} = useSession();
    const router = useRouter();
    const {table} = router.query;
    const [data, setData] = useState([]);
    const [_loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentData, setCurrentData] = useState<any>(null);
    const [totalRows, setTotalRows] = useState(0);

    // if (status === "unauthenticated") {
    //     router.push("/auth/login");
    //     return null;
    // }

    useEffect(() => {

        // @ts-ignore
        if (!table || !baseColumns[table]) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // @ts-ignore
                const data = await CRUD.getAll(table,
                    {
                        skip: pageIndex * pageSize,
                        limit: pageSize,
                    });
                setData(data);
                // @ts-ignore
                const totalRows = await CRUD.getCount(table, {});
                setTotalRows(totalRows);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then(r => r);
    }, [table, pageIndex, pageSize]);

    // @ts-ignore
    if (!table || !baseColumns[table]) {
        return <p className="p-4">Table not found</p>;
    }

    const handleDelete = async (rowsToDelete: any[]) => {
        if (!rowsToDelete || rowsToDelete.length === 0) {
            console.error("No rows selected for deletion.");
            return;
        }

        const tableName = Array.isArray(table) ? table[0] : table;

        if (!tableName || typeof tableName !== "string") {
            console.error("Invalid table name.");
            return;
        }

        try {
            const deletePromises = rowsToDelete.map((row) =>
                CRUD.delete(tableName, row.id)
            );
            await Promise.all(deletePromises);
            console.log(`Deleted ${rowsToDelete.length} row(s) successfully.`);

            const refreshedData = await CRUD.getAll(tableName);
            setData(refreshedData);
        } catch (err) {
            console.error("Failed to delete rows:", err);
        }
    };

    const handleEdit = (row: any) => {
        setDialogMode("edit");
        setCurrentData(row);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setDialogMode("add");
        setCurrentData(null);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (table: any, formData: any) => {
        try {
            if (dialogMode === "edit") {
                console.log(`Editing ${table}:`, formData);

                if (!formData.id) {
                    console.error("Edit operation requires an entity ID.");
                    return;
                }

                await CRUD.update(table, formData.id, formData);
                console.log(`Entity updated successfully in ${table}.`);
            } else {
                console.log(`Adding to ${table}:`, formData);

                await CRUD.create(table, formData);
                console.log(`Entity added successfully to ${table}.`);
            }

            setIsDialogOpen(false);

            const refreshedData = await CRUD.getAll(table);
            setData(refreshedData);
        } catch (err) {
            console.error(`Failed to process operation on ${table}:`, err);
        }
    };

    const columns = [
        selectionColumn,
        // @ts-ignore
        ...baseColumns[table],
        actionsColumn(handleEdit, handleDelete),
    ];
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block"/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{table}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div>

                    <DataTable
                        columns={columns}
                        data={data}
                        onAdd={handleAdd}
                        onDelete={(rows) => handleDelete(rows)}
                        onPaginationChange={({pageIndex, pageSize}) => {
                            setPageIndex(pageIndex);
                            setPageSize(pageSize);
                        }}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalRows={totalRows}
                    />

                    {isDialogOpen && (
                        <RecordDialog
                            mode={dialogMode}
                            table={table as keyof typeof baseColumns}
                            data={currentData}
                            onSubmit={handleSubmit}
                            onClose={() => setIsDialogOpen(false)}
                        />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardTable;
