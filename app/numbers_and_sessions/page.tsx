"use client"

import CardWithDatatable from "@/components/card-datatable";
import { ColumnDef } from "@tanstack/react-table";

export default function NumbersAndSessions() {
    const columns: ColumnsDefNumberType = [
        {
            accessorKey: "number",
            header: "Number",
        },
        {
            accessorKey: "session",
            header: "Session",
        },
        {
            accessorKey: "path",
            header: "Path",
        },
        {
            accessorKey: "timeout",
            header: "Timeout",
        },
        {
            accessorKey: "actions",
            header: "Actions",
        },
    ];

    const data: DataNumber[] = [
        {
            number: "+55474071",
            session: "Sispzap1",
            path: "21h30",
            timeout: 10
        },
        {
            number: "+55472632",
            session: "Sispzap2",
            path: "02h45",
            timeout: 10
        },
        {
            number: "+472679",
            session: "Sispzap3",
            path: "09h50",
            timeout: 10
        },
    ];
    
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <CardWithDatatable columns={columns} data={data} />
        </div>
    )
}