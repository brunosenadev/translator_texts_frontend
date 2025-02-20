"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useApiRequest from "@/hooks/use-api-request";

type Star = {
    id: number;
    size: number;
    top: number;
    left: number;
    opacity: number;
    duration: number;
};

export default function Login() {
    const router = useRouter();
    const [gptKey, setGptKey] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [stars, setStars] = useState<Star[]>([]);
    const [elementRegisterDisabled, setElementRegisterDisabled] = useState(false);
    const { request } = useApiRequest();

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


    const handleLogin = () => {
        document.cookie = "loggedIn=true; path=/; SameSite=Lax";
        router.refresh();
    };

    const handleRegister = async () => {
        setElementRegisterDisabled(true);

        if (!user || !gptKey || !password || !confirmPassword) {
            setErrorMessage("Todos os campos são obrigatórios.");
            setElementRegisterDisabled(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("As senhas não coincidem.");
            setElementRegisterDisabled(false);
            return;
        }

        if (gptKey.length < 10) {
            setErrorMessage("A chave do GPT deve ter pelo menos 10 caracteres.");
            setElementRegisterDisabled(false);
            return;
        }

        try {
            const response = await request({
                url: "/gptconfig/create",
                method: "POST",
                body: {
                    name_key: user,
                    api_key: gptKey,
                    password: password,
                    model_gpt: "gpt-4"
                },
            });

            console.log(response)

            setSuccessMessage("Registrado com sucesso!");
            setTimeout(() => {
                setSuccessMessage("");
                setIsRegistering(false);
            }, 1000);
            setUser("");
            setGptKey("");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro desdconhecido";
            setErrorMessage(errorMessage);
            setElementRegisterDisabled(false);
        } finally {
            setElementRegisterDisabled(false);
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
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

                {!isRegistering ? (
                    <motion.div
                        key="login"
                        className="relative bg-muted/60 p-8 rounded-2xl shadow-2xl w-80 flex flex-col gap-4 z-10"
                        initial={{ y: 0 }}
                        animate={{ y: 0 }}
                        exit={{ y: 300, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-white text-2xl font-bold mb-4 text-center">Bem-vindo ao (?)</h1>

                        <input
                            type="text"
                            placeholder="Usuário"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={handleLogin}
                            className="w-full bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-lg transition"
                        >
                            Entrar
                        </button>

                        <button
                            onClick={() => {
                                setElementRegisterDisabled(false);
                                setIsRegistering(true);
                            }}
                            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            Registrar-se
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        className="relative bg-muted/60 p-8 rounded-2xl shadow-2xl w-80 flex flex-col gap-4 z-10"
                        initial={{ y: -300, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -300, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-white text-2xl font-bold mb-4 text-center">Registrar-se</h1>

                        <input
                            type="text"
                            placeholder="Usuário"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            disabled={elementRegisterDisabled}
                            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            placeholder="Chave do GPT"
                            value={gptKey}
                            onChange={(e) => setGptKey(e.target.value)}
                            disabled={elementRegisterDisabled}
                            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={elementRegisterDisabled}
                            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={elementRegisterDisabled}
                            className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={() => {
                                handleRegister();
                            }}
                            className="w-full bg-white hover:bg-gray-600 text-black font-bold py-2 px-4 rounded-lg transition"
                        >
                            Finalizar Registro
                        </button>
                        
                        <button
                            onClick={() => {
                                setIsRegistering(false);
                                setErrorMessage("");
                            }}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            Voltar
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
