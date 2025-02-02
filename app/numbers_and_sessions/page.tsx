"use client"

import CardWithDatatable from "@/components/card-datatable";
import { ColumnDef } from "@tanstack/react-table";

export default function NumbersAndSessions() {
    const columns: ColumnDef<DataMain>[] = [
        {
            accessorKey: "whatsapp",
            header: "Whatsapp",
        },
        {
            accessorKey: "number",
            header: "Number",
        },
        {
            accessorKey: "last_message",
            header: "Last Message",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div className="flex items-center">
                    <span
                        className={`h-3 w-3 mr-2 mt-2 rounded-full ${row.original.status.toLowerCase() === "online" ? "bg-green-500" : "bg-red-500"
                            }`}
                    />
                    <p className="mt-2 text-sm font-bold">{row.original.status.toLowerCase() === "online" ? "Online" : "Offline"}</p>
                </div>
            )
        },
        {
            accessorKey: "actions",
            header: "Actions",
        },
    ];

    const data: DataMain[] = [
        {
            whatsapp: "Sispzap1",
            number: "+55474071",
            lastMessage: "21h30",
            status: "Online",
            actions: "None",
        },
        {
            whatsapp: "Sispzap2",
            number: "+55472632",
            lastMessage: "02h45",
            status: "Offline",
            actions: "None",
        },
        {
            whatsapp: "Sispzap3",
            number: "+472679",
            lastMessage: "09h50",
            status: "Online",
            actions: "None",
        },
    ];
    
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <CardWithDatatable columns={columns} data={data} />
        </div>
    )
}