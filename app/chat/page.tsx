"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Clipboard } from "lucide-react";

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

export default function GptChatSimulator() {
    const [agents, setAgents] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>(["Modelo A", "Modelo B", "Modelo C"]);
    const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]);
    const [selectedModel, setSelectedModel] = useState<string>(models[0]);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [inputMessage, setInputMessage] = useState("");

    const sendMessage = () => {
        if (!inputMessage.trim()) return;

        const userMessage = { sender: "Você", text: inputMessage };
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");

        // Simula a resposta do ChatGPT
        setTimeout(() => {
            const botMessage = { sender: "ChatGPT", text: `Você disse: ${userMessage.text} usando ${selectedAgent} e o modelo ${selectedModel}` };
            setMessages((prev) => [...prev, botMessage]);
        }, 1000);
    };

    useEffect(() => {
        setAgents(["Agente 1", "Agente 2", "Agente 3"]);
        setModels([]);
    }, []);

    return (
        <div className="relative w-full flex flex-col items-center min-h-screen bg-black overflow-hidden p-4">
                        {/* Exibindo as mensagens */}
                        <div className="flex-1 w-full max-w-2xl flex flex-col gap-4 items-center justify-start p-4 overflow-hidden">
                <AnimatePresence mode="wait">
                    {messages.map((msg, index) => (
                        <motion.div 
                            key={index} 
                            className={`p-4 rounded-xl max-w-[70%] relative mx-auto ${msg.sender === "Você" ? "bg-gray-300/80 self-end text-black text-right" : "bg-gray-700/80 self-start text-left"}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                marginLeft: msg.sender === "Você" ? "0%" : "0%", 
                                marginRight: msg.sender === "ChatGPT" ? "0%" : "0%", 
                            }}
                        >
                            <strong>{msg.sender}:</strong> <span className="block mt-2 break-words">{msg.text}</span>
                            {msg.sender === "ChatGPT" && (
                                <button
                                    onClick={() => copyToClipboard(msg.text)}
                                    className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100"
                                >
                                    <Clipboard size={20} />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-2xl">
                {/* Select para Agente */}
                <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="p-2 rounded-lg bg-gray-800 text-white"
                >
                    {agents.map((agent, index) => (
                        <option key={index} value={agent}>
                            {agent}
                        </option>
                    ))}
                </select>

                {/* Select para Modelo */}
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="p-2 rounded-lg bg-gray-800 text-white"
                >
                    {models.map((model, index) => (
                        <option key={index} value={model}>
                            {model}
                        </option>
                    ))}
                </select>

                {/* Caixa de Texto */}
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                />

                {/* Botão de Enviar */}
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                    Enviar
                </button>
            </div>

        </div>
    );
}
