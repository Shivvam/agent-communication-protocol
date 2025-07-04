import React, { useState, useEffect } from "react";

function AgentSelector({
	setMessages,
	agentsRefresh,
}: {
	setMessages: Function;
	agentsRefresh: Function;
}) {
	const [agents, setAgents] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedAgent, setSelectedAgent] = useState<string>("");

	useEffect(() => {
		const fetchAgents = async () => {
			try {
				const response = await fetch("/api/agents");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				// Extract agent names from the response
				const agentNames = data.agents.map(
					(agent: { name: string }) => agent.name
				);
				setAgents(agentNames);
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAgents();
	}, []); // The empty dependency array ensures this effect runs only once on mount

	if (loading) {
		return <div>Loading agents...</div>;
	}

	if (error) {
		return <div>Error loading agents: {error}</div>;
	}

	const preserveAgentSelectionToLocalStorage = (inputValue: string) => {
		localStorage.setItem("AGENT", inputValue);
	};

	const handleAgentChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	): void => {
		const selectedValue = event.target.value;
		setSelectedAgent(selectedValue);
		preserveAgentSelectionToLocalStorage(selectedValue);
		agentsRefresh();
		// Optionally, clear messages or add a system message when agent changes
		setMessages([]); // Clear chat history when agent changes
	};

	return (
		<div>
 			<div className="flex items-center space-x-2">
				<label htmlFor="agent-select" className="text-sm font-medium">
					Select Agent:
				</label>
				<select
					id="agent-select"
					value={selectedAgent}
					onChange={handleAgentChange}
					className="p-2 rounded-md bg-purple-700 text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-200 ease-in-out cursor-pointer"
				>
					{agents.map((agent) => (
						<option key={agent} value={agent}>
							{agent}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

export default AgentSelector;
