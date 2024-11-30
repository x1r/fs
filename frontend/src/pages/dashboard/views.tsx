import {ColumnDef} from "@tanstack/react-table";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {DataTable} from "@/components/table/data-table";
import {useEffect, useState} from "react";
import {baseColumns} from "@/lib/tables-columns";
import {CRUD} from "@/src/utils/api";


export function Page() {
    const router = useRouter();
    const {data: session, status} = useSession();
    if (status === "unauthenticated") {
        router.push("/auth/login");
        return null;
    }
    const table = "warehouse_equipment";
    const [data, setData] = useState([]);


    useEffect(() => {
        // @ts-ignore
        if (!table || !baseColumns[table]) return;

        const fetchData = async () => {
            try {
                // @ts-ignore
                const data = await CRUD.getAll(table);
                setData(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData().then(r => r);
    }, [table]);

    // @ts-ignore
    if (!table || !baseColumns[table]) {
        return <p className="p-4">Table not found</p>;
    }


    const log_columns: ColumnDef<any> = [
        {
            id: "select",
            header: ({table}) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({row}) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        },
        {accessorKey: "log_id", header: "ID", id: "log_id"},
        {accessorKey: "operation", header: "Operation", id: "operation"},
        {accessorKey: "table_name", header: "Table Name", id: "table_name"},
        {accessorKey: "changed_data", header: "Changed Data", id: "changed_data"},
        {accessorKey: "changed_by", header: "Changed By", id: "changed_by"},
        {accessorKey: "timestamp", header: "Date", id: "timestamp"},

    ]

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
                                    <BreadcrumbPage>
                                        Log
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div>
                    <div>

                        <DataTable
                            columns={log_columns}
                            data={data}
                        />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Page;