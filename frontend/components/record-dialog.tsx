import {useState} from "react";
import {Dialog, DialogHeader, DialogFooter, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {baseColumns} from "@/lib/tables-columns";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";

const RecordDialog = ({
                          mode,
                          table,
                          data,
                          onSubmit,
                          onClose,
                      }: {
    mode: "add" | "edit";
    table: keyof typeof baseColumns;
    data: any;
    onSubmit: (table: any, data: any) => Promise<void>;
    onClose: () => void;
}) => {
    const columns = baseColumns[table];
    const [formData, setFormData] = useState(data || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = () => {
        onSubmit(table, formData);
        onClose();
    };

    return (
        <Dialog open={true}>
            <DialogContent>
                <VisuallyHidden>
                    <DialogTitle/>
                </VisuallyHidden>
                <DialogHeader>
                    {mode === "edit" ? `Edit ${table}` : `Add New ${table}`}
                </DialogHeader>
                <div className="space-y-4">
                    {columns
                        .filter((column) => column.accessorKey !== "id")
                        .map((column) => (
                            <div key={column.accessorKey}>
                                <label htmlFor={column.accessorKey} className="block text-sm font-medium">
                                    {column.header}
                                </label>
                                <Input
                                    id={column.accessorKey}
                                    name={column.accessorKey}
                                    placeholder={column.header as string}
                                    value={formData[column.accessorKey] || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                </div>
                <DialogFooter>
                    <Button variant={"outline"} className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="btn btn-primary" onClick={handleSubmit}>
                        {mode === "edit" ? "Save Changes" : "Add Record"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RecordDialog;
