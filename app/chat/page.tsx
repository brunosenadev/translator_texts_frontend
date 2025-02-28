"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Clipboard } from "lucide-react";
import useApiRequest from "@/hooks/use-api-request";

type Star = {
    id: number;
    size: number;
    top: number;
    left: number;
    opacity: number;
    duration: number;
};

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

export default function GptChatSimulator() {
    const [agents, setAgents] = useState<AgentGPT[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<number>(-1);
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [stars, setStars] = useState<Star[]>([]);
    const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);
    const effectRan = useRef(false);
    const { request } = useApiRequest();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // const sendMessage = (msg: string = "") => {
    //     if (!inputMessage.trim()) return;

    //     if (msg === "Iniciar") {
    //         setMessages([{ sender: "Você", text: msg }]);
    //     } else {
    //         const userMessage = { sender: "Você", text: inputMessage };
    //         setMessages((prev) => [...prev, userMessage]);
    //         setInputMessage("");
    //     };

    // setTimeout(() => {
    //     const botMessage = { sender: "ChatGPT", text: `Você disse: ${userMessage.text} usando ${selectedAgent} e o modelo ${selectedModel}` };
    //     setMessages((prev) => [...prev, botMessage]);
    // }, 1000);
    // };

    const sendMessage = useCallback((msg: string = "", agentInitial: number = 0) => {
        if (!inputMessage.trim() && msg !== "Iniciar") return;

        if (msg === "Iniciar") {
            setMessages([{ sender: "Você", text: msg }]);
            sendMessageToBackend(msg, agentInitial);
        } else {
            const userMessage = { sender: "Você", text: inputMessage };
            setMessages((prev) => [...prev, userMessage]);
            setInputMessage("");
        }
    }, [inputMessage]);

    const sendMessageToBackend = async (text: string, agent: number = -1) => {
        try {
            const encodedMessage = encodeURIComponent(text);
            const response = await request({
                url: "/gpt_chat/send_message",
                method: "POST",
                body: { message: encodedMessage, model: selectedModel, agent: agent, name_user: localStorage.getItem("userLogged") ?? "" },
            });

            return response.response;
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            return "Erro ao obter resposta do GPT.";
        }
    };

    const fetchAgents = async () => {
        try {
            const response = await request({
                url: "/agent",
                method: "GET",
            });

            if (!Array.isArray(response)) {
                throw new Error("Resposta inesperada do servidor");
            }

            setAgents(response);

            if (response.length > 0) {
                const firstAgent = response[0];
                setSelectedAgent(firstAgent.id);

                if (!effectRan.current) {
                    effectRan.current = true;
                    sendMessage("Iniciar", firstAgent.id);
                }
            }

        } catch (err) {
            const error = err as { message: string };
            setErrorMessage(error?.message || "Erro desconhecido ao buscar agentes.");
        }
    };

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
    }, [])

    useEffect(() => {
        fetchAgents();
        setModels(["GPT-4"]);
        setSelectedModel("GPT-4");
    }, [sendMessage]);

    const handleCleanChat = () => {
        setMessages([]);
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="relative w-full flex flex-col items-center h-full bg-black p-4 overflow-hidden">
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
            <style jsx global>{`
                body {
                    overflow: hidden; /* Esconde o scrollbar da página */
                }
            `}</style>

            <div className="absolute w-full h-full z-0">
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

            <div className="flex-1 w-full max-w-2xl flex flex-col gap-4 items-center justify-start p-4 z-10">
                <div className="w-full h-full mt-10 max-h-[68vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                className={`mt-2 p-2 rounded-xl max-w-[70%] self-start relative ${msg.sender === "Você" ? "bg-gray-300/80 text-black" : "bg-gray-700/80"}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{ marginLeft: msg.sender === "Você" ? "30%" : "2%", marginRight: msg.sender === "ChatGPT" ? "30%" : "2%" }}
                            >
                                <strong>{msg.sender}:</strong>{" "}
                                <pre className="block mt-2 break-words whitespace-pre-wrap">{msg.text}</pre>
                                {msg.sender === "ChatGPT" && (
                                    <div className="absolute top-2 right-2 flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                copyToClipboard(msg.text);
                                                setShowCopiedFeedback(true);
                                                setTimeout(() => setShowCopiedFeedback(false), 2000);
                                            }}
                                            className="text-white opacity-70 hover:opacity-100"
                                        >
                                            <Clipboard size={20} />
                                        </button>
                                        {showCopiedFeedback && (
                                            <motion.span
                                                className="text-xs text-white bg-black/50 px-2 py-1 rounded"
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                            >
                                                Copiado!
                                            </motion.span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-2xl fixed bottom-2 p-4 rounded-lg z-10">
                <div className="flex space-x-2 w-full">
                    <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(Number(e.target.value))}
                        className="p-2 rounded-lg w-[79%] bg-gray-800 text-white"
                    >
                        {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.name_agent} - {agent.description_agent}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="p-2 rounded-lg w-[20%] bg-gray-800 text-white"
                        disabled
                    >
                        {models.map((model, index) => (
                            <option key={index} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                />
                <div className="flex flex-grid grid-cols-2 w-[100%] space-x-2">
                    <button
                        onClick={() => { sendMessage("") }}
                        className="bg-white hover:bg-black w-[70%] hover:text-white text-black font-bold py-3 px-6 rounded-lg transition"
                    >
                        Enviar
                    </button>
                    <button
                        onClick={handleCleanChat}
                        className="bg-white hover:bg-black w-[28%] hover:text-white text-black font-bold py-3 px-6 rounded-lg transition"
                    >
                        Limpar
                    </button>
                </div>
            </div>
        </div>
    );
}