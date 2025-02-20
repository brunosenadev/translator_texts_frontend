"use client";

import { useState, useCallback } from "react";

export default function useApiRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(async ({
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

            const contentType = response.headers.get("Content-Type");
            const isJson = contentType && contentType.includes("application/json");
            const result = isJson ? await response.json() : null;

            if (!response.ok) {
                const errorMessage = result?.detail || response.statusText;
                throw new Error(errorMessage);
            }

            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    }, []);

    return { request, loading, error };
}
