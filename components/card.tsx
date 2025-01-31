interface CardProps {
    title: string;
    status: "online" | "offline";
    content: string;
    lastMessage: string;
}

export default function Card({ title, status, content,  lastMessage}: CardProps) {
    return (
        <div className="w-full rounded-xl bg-muted/50 p-4 shadow-lg">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="flex items-center justify-end">
                    <span
                        className={`h-3 w-3 mr-2 mt-2 rounded-full ${status === "online" ? "bg-green-500" : "bg-red-500"
                            }`}
                    />
                    <p className="mt-2 text-sm font-bold">{status === "online" ? "Online" : "Offline"}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <p className="mt-2 text-sm text-muted-foreground">{content}</p>
                <p className="mt-2 text-sm text-muted-foreground">Horário do ultimo ping: {lastMessage}</p>
            </div>
        </div>
    );
}