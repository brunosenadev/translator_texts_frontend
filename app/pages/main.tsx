import Card from "@/components/card";
import CardXl from "@/components/card-xl";

export default function Main() {
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
            <CardXl />
        </div>
    );
}