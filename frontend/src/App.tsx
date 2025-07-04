import React, { useState, useEffect, useRef } from "react";
import AgentSelector from "./AgentListComponent";

// Define interfaces for message structure and API payload
interface ChatMessage {
	role: "user" | "agent" | "system";
	content: string;
}

interface ApiPart {
	content: string;
	content_type: "text/plain";
}

interface ApiInput {
	role: "user";
	parts: ApiPart[];
}

interface ApiPayload {
	agent_name: string;
	input: ApiInput[];
}

interface ApiResponse {
	output?: Array<{
		parts?: Array<{
			content?: string;
		}>;
	}>;
}

const BASE_AGENT_API_URL = "/api";

// Main App component
function App(): JSX.Element {
	// State to store chat messages
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	// State to store the currently selected agent
	const [selectedAgentGlobal, setSelectedAgentGlobal] = useState<string>("");
	// State to store the user's input message
	const [inputText, setInputText] = useState<string>("");
	// State to manage loading status during API calls
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Reference to the chat messages container for auto-scrolling
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Effect to scroll to the bottom of the chat messages whenever messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		agentsRefresh();
	}, []);

	const agentsRefresh = () => {
		const selectedAgentGlobalValueLS = localStorage.getItem("AGENT");
		if (selectedAgentGlobalValueLS && selectedAgentGlobalValueLS != "") {
			setSelectedAgentGlobal(selectedAgentGlobalValueLS);
		}
	};

	/**
	 * Handles sending a message to the API.
	 * @param message The message content from the user.
	 */
	const sendMessage = async (message: string): Promise<void> => {
		if (!message.trim() || !selectedAgentGlobal) {
			// Don't send empty messages or if no agent is selected
			return;
		}

		// Add user's message to the chat display immediately
		setMessages((prevMessages) => [
			...prevMessages,
			{ role: "user", content: message },
		]);
		setInputText(""); // Clear the input field
		setIsLoading(true); // Set loading state to true

		// Construct the request payload as per the API specification
		const payload: ApiPayload = {
			agent_name: selectedAgentGlobal,
			input: [
				{
					role: "user",
					parts: [
						{
							content: message,
							content_type: "text/plain",
						},
					],
				},
			],
		};

		try {
			// Make the POST request to the chat API
			const response = await fetch(`${BASE_AGENT_API_URL}/runs`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			// Check if the response was successful
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: ApiResponse = await response.json();
			console.log("API Response:", data); // Log the full response for debugging

			// Extract the agent's reply from the response
			// Assuming the agent's reply is in data.output[0].parts[0].content
			const agentReply =
				data.output?.[0]?.parts?.[0]?.content || "No response from agent.";

			// Add the agent's reply to the chat display
			setMessages((prevMessages) => [
				...prevMessages,
				{ role: "agent", content: agentReply },
			]);
		} catch (error: any) {
			// Type 'error' as any or unknown, then narrow down
			console.error("Error sending message:", error);
			// Display an error message in the chat if the API call fails
			setMessages((prevMessages) => [
				...prevMessages,
				{
					role: "system",
					content: `Error: ${error.message}. Please try again.`,
				},
			]);
		} finally {
			setIsLoading(false); // Set loading state to false regardless of success or failure
		}
	};

	/**
	 * Handles the change event for the agent selection dropdown.
	 * @param event The change event object.
	 */

	/**
	 * Handles the key down event in the input field (for sending with Enter key).
	 * @param event The keyboard event object.
	 */
	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLTextAreaElement>
	): void => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault(); // Prevent new line in textarea
			sendMessage(inputText);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter flex items-center justify-center p-4">
			<div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh] md:h-[90vh]">
				{/* Header */}
				<div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 flex items-center justify-between rounded-t-xl shadow-md">
					<h1 className="text-2xl font-bold">AI Chat</h1>
					<AgentSelector
						setMessages={setMessages}
						agentsRefresh={agentsRefresh}
					/>
				</div>

				{/* Chat Messages Area */}
				<div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
					{messages.length === 0 && (
						<div className="text-center text-gray-500 mt-10">
							Start a conversation with {selectedAgentGlobal}!
						</div>
					)}
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex mb-4 ${
								msg.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[70%] p-3 rounded-lg shadow-md ${
									msg.role === "user"
										? "bg-blue-500 text-white rounded-br-none"
										: msg.role === "agent"
										? "bg-gray-200 text-gray-800 rounded-bl-none"
										: "bg-red-100 text-red-700 rounded-lg border border-red-300" // For system messages
								}`}
							>
								{msg.content}
							</div>
						</div>
					))}
					{isLoading && (
						<div className="flex justify-start mb-4">
							<div className="max-w-[70%] p-3 rounded-lg shadow-md bg-gray-200 text-gray-800 rounded-bl-none animate-pulse">
								Agent is typing...
							</div>
						</div>
					)}
					<div ref={messagesEndRef} /> {/* Scroll target */}
				</div>

				{/* Message Input Area */}
				<div className="p-4 bg-gray-100 border-t border-gray-200 flex items-center rounded-b-xl">
					<textarea
						className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mr-3 custom-scrollbar"
						rows={2}
						placeholder="Type your message..."
						value={inputText}
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
							setInputText(e.target.value)
						}
						onKeyDown={handleKeyDown}
						disabled={isLoading} // Disable input while loading
					/>
					<button
						onClick={() => sendMessage(inputText)}
						disabled={isLoading || !inputText.trim()} // Disable button while loading or if input is empty
						className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<svg
								className="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						) : (
							"Send"
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
