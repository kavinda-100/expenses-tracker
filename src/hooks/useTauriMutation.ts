import React from "react";
import { invoke } from "@tauri-apps/api/core";

// Example usage of the invoke method in Tauri to call a Rust command from the frontend
// async function greet() {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     setGreetMsg(await invoke("greet", { name }));
//   }

/**
 * @description A custom React hook for managing Tauri command invocations, including loading and error states.
 * @description This hook provides a convenient way to call Tauri commands from React components, handling the asynchronous nature of the calls and managing the associated states.
 * @description This command use to invoke mutations and also refetch the last mutation when needed similar to tanstack query mutation.
 * @template T - The expected type of the successful response data.
 * @template E - The expected type of the error response data.
 * @returns The data, error, loading states, along with functions to mutate.
 */
export function useTauriMutation<T, E>() {
    const [data, setData] = React.useState<T | null>(null);
    const [error, setError] = React.useState<E | null>(null);
    const [isError, setIsError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const mutationAsync = async (
        command: string,
        inputParams?: Record<string, any>,
    ) => {
        setLoading(true);
        setError(null);
        setIsError(false);
        try {
            const result = await invoke<T>(command, { inputParams });
            setError(null);
            setIsError(false);
            setData(result);
        } catch (err) {
            setError(err as E);
            setIsError(true);
            setData(null);
            console.error(`Error invoking command "${command}":`, err);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
        setIsError(false);
        setLoading(false);
    };

    return { data, error, isError, loading, mutationAsync, reset };
}
