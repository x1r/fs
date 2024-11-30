import {ColumnDef} from "@tanstack/react-table";

export const baseColumns = {
    clients: [
        {accessorKey: "client_id", header: "ID", id: "client_id"},
        {accessorKey: "full_name", header: "Full Name", id: "full_name"},
        {accessorKey: "phone", header: "Phone Number", id: "phone"},
        {accessorKey: "email", header: "Email Address", id: "email"},
        {accessorKey: "address", header: "Physical Address", id: "address"},
        {accessorKey: "responsible_employee", header: "Responsible Employee", id: "responsible_employee"},
    ],
    orders: [
        {accessorKey: "order_id", header: "ID", id: "order_id"},
        {accessorKey: "creation_date", header: "Order Date", id: "creation_date"},
        {accessorKey: "status", header: "Order Status", id: "status"},
        {accessorKey: "total_cost", header: "Total Cost ($)", id: "total_cost"},
        {accessorKey: "client_id", header: "Client ID", id: "client_id"},
    ],
    employees: [
        {accessorKey: "employee_id", header: "ID", id: "employee_id"},
        {accessorKey: "full_name", header: "Full Name", id: "full_name"},
        {accessorKey: "position", header: "Job Title", id: "position"},
        {accessorKey: "phone", header: "Contact Number", id: "phone"},
        {accessorKey: "email", header: "Work Email", id: "email"},
    ],
    tasks: [
        {accessorKey: "task_id", header: "ID", id: "task_id"},
        {accessorKey: "description", header: "Task Description", id: "description"},
        {accessorKey: "due_date", header: "Deadline", id: "due_date"},
        {accessorKey: "order_id", header: "Order Associated", id: "order_id"},
        {accessorKey: "employee_id", header: "Assigned Employee", id: "employee_id"},
    ],
    warehouses: [
        {accessorKey: "warehouse_id", header: "ID", id: "warehouse_id"},
        {accessorKey: "location", header: "Warehouse Location", id: "location"},
        {accessorKey: "responsible_employee_id", header: "Responsible Employee", id: "responsible_employee_id"},
    ],
    equipment: [
        {accessorKey: "equipment_id", header: "ID", id: "equipment_id"},
        {accessorKey: "equipment_type", header: "Type of Equipment", id: "equipment_type"},
        {accessorKey: "serial_number", header: "Serial Number", id: "serial_number"},
        {accessorKey: "status", header: "Condition", id: "status"},
        {accessorKey: "order_id", header: "Order Associated", id: "order_id"},
        {accessorKey: "warehouse_id", header: "Stored At", id: "warehouse_id"},
    ],
    payments: [
        {accessorKey: "payment_id", header: "ID", id: "payment_id"},
        {accessorKey: "amount", header: "Payment Amount ($)", id: "amount"},
        {accessorKey: "payment_date", header: "Payment Date", id: "payment_date"},
        {accessorKey: "order_id", header: "Related Order", id: "order_id"},
    ],
    users: [
        {accessorKey: "id", header: "ID", id: "id"},
        {accessorKey: "full_name", header: "Full Name", id: "full_name"},
        {accessorKey: "username", header: "Email", id: "username"},
        {accessorKey: "is_active", header: "Is Active", id: "is_active"},
        {accessorKey: "role", header: "Account Role", id: "role"},
    ],
    audit_log: [
        {accessorKey: "log_id", header: "ID", id: "log_id"},
        {accessorKey: "operation", header: "Operation", id: "operation"},
        {accessorKey: "table_name", header: "Table Name", id: "table_name"},
        {accessorKey: "changed_data", header: "Changed Data", id: "changed_data"},
        {accessorKey: "changed_by", header: "Changed By", id: "changed_by"},
        {accessorKey: "timestamp", header: "Date", id: "timestamp"},
    ]
};


export const selectionColumn: ColumnDef<any> = {
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
};

export const actionsColumn = (onEdit: (row: any) => void, onDelete: (row: any) => void): ColumnDef<any> => ({
    id: "actions",
    header: "Actions",
    cell: ({row}) => (
        <div className="flex gap-2">
            <button
                className="text-blue-500 hover:underline"
                onClick={() => onEdit(row.original)}
            >
                Edit
            </button>
            <button
                className="text-red-500 hover:underline"
                onClick={() => onDelete(row.original)}
            >
                Delete
            </button>
        </div>
    ),
});
