import React from 'react';
import { invoke } from '@tauri-apps/api/core';

// Example usage of the invoke method in Tauri to call a Rust command from the frontend
// async function greet() {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     setGreetMsg(await invoke("greet", { name }));
//   }

/**
 * @description A custom React hook for managing Tauri command invocations, including loading and error states.
 * @description This hook provides a convenient way to call Tauri commands from React components, handling the asynchronous nature of the calls and managing the associated states.
 * @description This command use to invoke queries and also refetch the last query when needed similar to tanstack query.
 * @template T - The expected type of the successful response data.
 * @template E - The expected type of the error response data.
 * @returns The data, error, loading, and refetching states, along with functions to query and refetch.
 */
export function useTauriQuery<T, E>() {
	const [data, setData] = React.useState<T | null>(null);
	const [error, setError] = React.useState<E | null>(null);
	const [isError, setIsError] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [isRefetching, setIsRefetching] = React.useState(false);
	const lastQueryRef = React.useRef<{
		command: string;
		queryParams?: Record<string, any>;
	} | null>(null);

	const queryAsync = async (
		command: string,
		queryParams?: Record<string, any>,
	) => {
		setLoading(true);
		setError(null);
		setIsError(false);
		lastQueryRef.current = { command, queryParams };
		try {
			const result = await invoke<T>(command, queryParams);
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

	const refetch = async () => {
		if (lastQueryRef.current) {
			setIsRefetching(true);
			setError(null);
			setIsError(false);
			try {
				await queryAsync(
					lastQueryRef.current.command,
					lastQueryRef.current.queryParams,
				);
			} finally {
				setIsRefetching(false);
			}
		}
	};

	const reset = () => {
		setData(null);
		setError(null);
		setIsError(false);
		setLoading(false);
		setIsRefetching(false);
		lastQueryRef.current = null;
	};

	return {
		data,
		error,
		isError,
		loading,
		isRefetching,
		queryAsync,
		refetch,
		reset,
	};
}
