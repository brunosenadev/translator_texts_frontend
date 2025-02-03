"use client"

import CardWithDatatable from "@/components/card-datatable";
import Card from "@/components/card";

export default function Main() {
    const columns: ColumnsDefMainType = [
        {
            accessorKey: "whatsapp",
            header: "Whatsapp",
        },
        {
            accessorKey: "number",
            header: "Number",
        },
        {
            accessorKey: "lastMessage",
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
    ];

    const data: DataMain[] = [
        {
            whatsapp: "Sispzap1",
            number: "+55474071",
            lastMessage: "21h30",
            status: "Online",
        },
        {
            whatsapp: "Sispzap2",
            number: "+55472632",
            lastMessage: "02h45",
            status: "Offline"
        },
        {
            whatsapp: "Sispzap3",
            number: "+472679",
            lastMessage: "09h50",
            status: "Online",
        },
    ];

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card
                    title="Vm-Node1"
                    status="offline"
                    content="Sispzap1"
                    lastMessage="21h30"
                />
                <Card
                    title="Vm-Node2"
                    status="online"
                    content="Sispzap2"
                    lastMessage="02h30"
                />
                <Card
                    title="Vm-Node3"
                    status="offline"
                    content="Sispzap3"
                    lastMessage="01h30"
                />
            </div>
            <CardWithDatatable columns={columns} data={data} />
        </div>
    );
}
