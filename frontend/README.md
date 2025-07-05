# 🚀 Chat UI for ACP Agents

This is a modern chat interface built with **React** and **Vite**, designed for seamless interaction with AI agents that use the **Agent Communication Protocol (ACP)**. The application connects to a backend REST API to dynamically fetch and communicate with your agents.

-----

## 🛠️ Core Technologies

  * **Frontend**: A dynamic and interactive UI built with **React**, **Vite**, and styled with **TailwindCSS**.
  * **Communication**: Integrates with a backend via a **RESTful API** and utilizes the **Agent Communication Protocol (ACP)** for standardized agent interaction.

-----

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the latest LTS version of **Node.js** and **npm** installed on your system.

### Installation & Setup

1.  **Install Dependencies**: Open your terminal, navigate to the project directory, and run:

    ```bash
    npm install
    ```

    This command installs all the required dependencies listed in `package.json`.

2.  **Run the Development Server**: Once the installation is complete, start the Vite development server:

    ```bash
    npm run dev
    ```

3.  **Visit the Application**: After the server starts, open your web browser and go to **`http://localhost:5173`**. You should now see the chat UI, ready to interact with your agents.

-----

## 🔌 API and Proxy Configuration

The application requires a running backend service to function. It communicates with two primary endpoints:

  * **`GET /agents`**: Retrieves the list of all available AI agents.
  * **`POST /runs`**: Executes a selected agent with a specific input.

To avoid Cross-Origin Resource Sharing (CORS) errors during development, this project uses a proxy. As configured in `vite.config.js`, any request made to `/api` from the frontend is automatically forwarded to the backend service at `http://127.0.0.1:8000`.