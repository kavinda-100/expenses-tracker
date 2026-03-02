import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ModeToggle } from './components/ModeToggle';

function App() {
	const [greetMsg, setGreetMsg] = useState('');
	const [name, setName] = useState('');

	async function greet() {
		// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
		setGreetMsg(await invoke('greet', { name }));
	}

	return (
		<main className="container h-full w-full bg-blue-400">
			<h1 className="text-3xl font-bold underline text-blue-500">
				Welcome to Tauri + React
			</h1>
			<ModeToggle />

			<form
				className="flex flex-row mt-4 gap-3 justify-center items-start"
				onSubmit={(e) => {
					e.preventDefault();
					greet();
				}}
			>
				<Input
					onChange={(e) => setName(e.currentTarget.value)}
					placeholder="Enter a name..."
					className="w-75"
				/>
				<Button variant="default" onClick={greet} type="submit">
					Greet
				</Button>
			</form>
			<p>{greetMsg}</p>
		</main>
	);
}

export default App;
