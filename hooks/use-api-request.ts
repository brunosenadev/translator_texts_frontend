"use client";

import { useState } from "react";

export default function useApiRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = async ({
        url,
        method = "GET",
        headers = {},
        body = null,
    }: {
        url: string;
        method?: string;
        headers?: Record<string, string>;
        body?: any;
    }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3500${url}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                body: body ? JSON.stringify(body) : null,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Erro na requisição");
            }

            if (response.status != 201 && response.status != 200) {
                throw new Error(`Erro: ${result.detail}`)
            }

            setLoading(false);

            return result;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                setLoading(false);
                throw err; 
            } else {
                setError("Erro desconhecido");
                setLoading(false);
                throw new Error("Erro desconhecido");
            }
        }
    };

    return { request, loading };
}
