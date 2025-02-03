import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/datatable";

export default function CardWithDatatable<T>({ columns, data }: { columns: ColumnDef<T>[]; data: T[] }) {
    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/70 md:min-h-min">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
