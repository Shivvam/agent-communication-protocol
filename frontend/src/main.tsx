import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./App.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
		<footer className="flex">
			<div className="mx-auto py-2">
				<a
					href="https://github.com/Shivvam/agent-communication-protocol"
					target="_blank"
				>
					<img alt="github" src="/gh2.png" className="w-10" />
				</a>
			</div>
		</footer>
	</StrictMode>
);
