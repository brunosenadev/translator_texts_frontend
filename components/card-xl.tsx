import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/datatable";

interface Node {
    title: string;
    status: string;
    content: string;
    lastMessage: string;
}

export default function CardXl () {
    const columns: ColumnDef<Node>[] = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "content",
            header: "Content",
        },
        {
            accessorKey: "lastMessage",
            header: "Last Message",
        },
    ];

    const data: Node[] = [
        {
            title: "Vm-Node1",
            status: "offline",
            content: "Sispzap1",
            lastMessage: "21h30",
        },
        {
            title: "Vm-Node2",
            status: "online",
            content: "Sispzap2",
            lastMessage: "02h30",
        },
        {
            title: "Vm-Node3",
            status: "offline",
            content: "Sispzap3",
            lastMessage: "01h30",
        },
    ];
    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
         <DataTable columns={columns} data={data} />
        </div>
    )
}