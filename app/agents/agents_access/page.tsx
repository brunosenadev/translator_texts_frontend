"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/datatable";
import useApiRequest from "@/hooks/use-api-request";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type Agent = {
    id: string;
    name_agent: string;
    description_agent: string;
    rules_agent: string;
};

type Star = {
    id: number;
    size: number;
    top: number;
    left: number;
    opacity: number;
    duration: number;
};

export default function GptAgentList() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { request } = useApiRequest();
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            size: Math.random() * 3,
            top: Math.random() * 100,
            left: Math.random() * 100,
            opacity: Math.random() * 0.8 + 0.2,
            duration: Math.random() * 5 + 3,
        }));

        setStars(generatedStars);
    }, []);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await request({
                    url: "/agent",
                    method: "GET",
                });
                setAgents(response);
            } catch (err) {
                const error = err as { response: { data: { detail: string } } };
                const errorMessage = error?.response?.data?.detail || "Erro desconhecido";
                setErrorMessage(errorMessage);
            }
        };

        fetchAgents();
    }, [request]);

    const handleEdit = (agentId: string) => {
        window.location.href = `/agents/register_agent/${agentId}`;
    };

    const handleCreate = (agentId: string) => {
        window.location.href = `/agents/register_agent/${agentId}`;
    };

    const handleDelete = async (agentId: string) => {
        if (confirm("Tem certeza que deseja excluir este agente?")) {
            try {
                await request({
                    url: `/agent/${agentId}`,
                    method: "DELETE",
                });
                setAgents(agents.filter(agent => agent.id !== agentId));
                setSuccessMessage("Agente excluído com sucesso.");
            } catch (err) {
                const error = err as { response: { data: { detail: string } } };
                const errorMessage = error?.response?.data?.detail || "Erro desconhecido";
                setErrorMessage(errorMessage);
            }
        }
    };

    const columns: ColumnDef<Agent>[] = [
        {
            header: "Nome do Agente",
            accessorKey: "name_agent",
        },
        {
            header: "Descrição do Agente",
            accessorKey: "description_agent",
        },
        {
            header: "Regras do Agente",
            accessorKey: "rules_agent",
            cell: ({ row }) => (
                <div
                    style={{
                        maxHeight: '100px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {row.original.rules_agent}
                </div>
            ),
        },
        {
            header: "Ações",
            cell: ({ row }) => (
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => handleEdit(row.original.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Excluir
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-8">
            <div className="inset-0 overflow-hidden">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            top: `${star.top}vh`,
                            left: `${star.left}vw`,
                            opacity: star.opacity,
                        }}
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>
            <h1 className="text-2xl font-bold mb-10">Lista de Agentes GPT</h1>
            <Button className="mb-10" onClick={() => handleCreate("create")}>
            <PlusIcon/>
                Novo Agente
            </Button>
            <AnimatePresence mode="wait">
                {successMessage && (
                    <motion.div
                        className="absolute top-10 bg-green-500 text-white p-3 rounded-lg shadow-lg z-20"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        {successMessage}
                    </motion.div>
                )}
                {errorMessage && (
                    <motion.div
                        className="absolute top-10 bg-red-500 text-white p-3 rounded-lg shadow-lg z-20"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        {errorMessage}
                    </motion.div>
                )}
            </AnimatePresence>
            <DataTable columns={columns} data={agents} />
        </div>
    );
}
