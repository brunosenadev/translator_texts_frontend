"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import useApiRequest from "@/hooks/use-api-request";
import RichTextEditor from "@/components/richtexteditor";

type Star = {
    id: number;
    size: number;
    top: number;
    left: number;
    opacity: number;
    duration: number;
};

export default function GptAgentRegister() {
    const pathname = usePathname();
    const agent_id = pathname?.split("/")[3]
    const [agentName, setAgentName] = useState("");
    const [descriptionAgentName, setDescriptionAgentName] = useState("");
    const [rules, setRules] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { request } = useApiRequest();
    const [hideScrollbar, setHideScrollbar] = useState(false);
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
        const timeout = setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);

        return () => clearTimeout(timeout);
    }, [successMessage, errorMessage]);

    useEffect(() => {
        const checkOverflow = () => {
            if (document.documentElement.scrollHeight <= window.innerHeight) {
                setHideScrollbar(true);
            } else {
                setHideScrollbar(false);
            }
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, []);

    useEffect(() => {
        if (agent_id) {
            if (agent_id != "create") {
                const fetchAgentDetails = async () => {
                    try {
                        const response = await request({
                            url: `/agent/${agent_id}`,
                            method: "GET",
                        });
                        const agent = response;
                        setAgentName(agent.name_agent);
                        setDescriptionAgentName(agent.description_agent);
                        setRules(agent.rules_agent);
                    } catch (err) {
                        const error = err as { response: { data: { detail: string } } };
                        const errorMessage = error?.response?.data?.detail || "Erro desconhecido";
                        setErrorMessage(errorMessage);
                    }
                };
                fetchAgentDetails();
            }
        }
    }, [agent_id, request]);

    const handleRegisterOrUpdateAgent = async () => {
        if (!agentName || !descriptionAgentName || !rules) {
            setErrorMessage("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const url = agent_id && agent_id != "create" ? `/agent/${agent_id}` : "/agent/create";
            const method = agent_id && agent_id != "create" ? "PUT" : "POST";
            await request({
                url,
                method,
                body: {
                    name_agent: agentName,
                    description_agent: descriptionAgentName,
                    rules_agent: btoa(unescape(encodeURIComponent(rules))),
                },
            });

            setSuccessMessage(agent_id && agent_id != "create" ? "Agente atualizado com sucesso!" : "Agente registrado com sucesso!");
            if (!agent_id && agent_id != "create" ) {
                setTimeout(() => setSuccessMessage(""), 500);
            } else {
                setTimeout(() => {
                    setSuccessMessage("");
                    window.location.href = "/agents/agents_access";
                }, 2000);
            }
        } catch (err) {
            const error = err as { response: { data: { detail: string } } };
            const errorMessage = error?.response?.data?.detail || "Erro desconhecido";
            setErrorMessage(errorMessage);
        }
    };

    return (
        <div className={`relative w-full ${hideScrollbar ? "overflow-hidden" : "overflow-auto"} flex items-center justify-center min-h-screen bg-black`}>
            <div className="absolute inset-0 overflow-hidden">
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
            <AnimatePresence mode="wait">
                {successMessage && (
                    <motion.div className="absolute top-10 bg-green-500 text-white p-3 rounded-lg shadow-lg z-20"
                        initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                        {successMessage}
                    </motion.div>
                )}
                {errorMessage && (
                    <motion.div className="absolute top-10 bg-red-500 text-white p-3 rounded-lg shadow-lg z-20"
                        initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                        {errorMessage}
                    </motion.div>
                )}
                <motion.div className="relative bg-muted/60 p-12 rounded-2xl shadow-2xl w-[600px] flex flex-col gap-6 z-10"
                    initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-white text-2xl font-bold mb-4 text-center">{agent_id ? "Editar Agente GPT" : "Cadastro de Agente GPT"}</h1>
                    <input type="text" placeholder="Nome do Agente" value={agentName} onChange={(e) => setAgentName(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Descrição do Agente" value={descriptionAgentName} onChange={(e) => setDescriptionAgentName(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <RichTextEditor value={rules} onChange={setRules}
                        className="w-full bg-gray-800 p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-[400px] overflow-y-auto" />
                    <button onClick={handleRegisterOrUpdateAgent}
                        className="w-full bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-lg transition">
                        {agent_id && agent_id != "create" ? "Atualizar Agente" : "Cadastrar Agente"}
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
