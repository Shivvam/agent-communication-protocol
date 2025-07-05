# 🚀 Chat UI for ACP Agents

A modern, intuitive chat interface built with **React** and **Vite**, designed to facilitate seamless interaction with various AI agents powered by the **Agent Communication Protocol (ACP)**. This frontend application connects to a REST API to efficiently manage and communicate with your AI agents.

----------

## ✨ Features

-   **Intelligent Agent Interaction:** Engage with AI agents that adhere to the ACP standard for structured communication.
    
-   **Dynamic Agent Listing:** Fetches and displays a real-time list of available AI agents from a backend REST API, ensuring you always see the latest agents.
    
-   **Agent Execution:** Effortlessly run selected AI agents and view their responses directly within a clean, user-friendly chat interface.
    
-   **Responsive Design:** Optimized for a smooth and consistent user experience across various devices, from desktops to mobile phones.
    
-   **Fast Development Experience:** Leverages Vite for blazing-fast cold starts and hot module reloading, making development quick and enjoyable.
    

----------

## 🛠️ Technologies Used

-   ### Frontend
    
    -   **[React](https://react.dev/)**: A powerful JavaScript library for building dynamic and interactive user interfaces.
        
    -   **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling that provides an incredibly fast development environment.
        
    -   **TailwindCSS**: For styling the Chat UI.
        
-   ### Communication
    
    -   **RESTful API Integration**: Handles seamless communication with the backend service.
        
    -   **Agent Communication Protocol (ACP)**: The core protocol enabling standardized interaction with diverse AI agents.
        

----------

## 🚀 Getting Started

Follow these simple steps to get your local development environment up and running.

### Prerequisites

Before you begin, make sure you have the following installed on your system:

-   **[Node.js](https://nodejs.org/en/)**: The LTS (Long Term Support) version is recommended.
    
-   **[npm](https://www.npmjs.com/)**: Node Package Manager, which typically comes bundled with Node.js.
    

### Installation


    
1.  **Install dependencies:**
    
    Bash
    
    ```
    npm install
    
    ```
    
    _This command will install all the necessary project dependencies listed in `package.json`._
    

### Running the Development Server

Once the dependencies are installed, you can start the development server:

Bash

```
npm run dev

```

_This command will compile the project and launch the Vite development server._

### 🌐 Visit the Application

After running `npm run dev`, open your web browser and navigate to:

[http://localhost:5173/](https://www.google.com/search?q=http://localhost:5173/)

You should now see the chat UI, ready to connect and interact with your AI agents!

----------

## 🔌 API Endpoints & Proxy Configuration

This frontend application relies on a backend REST API for its core functionality. Ensure your backend service is running and accessible. The frontend interacts with the following assumed API endpoints:

-   **`GET /agents`**: Used to retrieve a comprehensive list of all available AI agents.
    
-   **`POST /runs`**: Used to execute a selected AI agent by sending specific inputs. (Details on the exact request body and expected response will depend on your specific ACP implementation.)
    

### Avoiding CORS Errors

To prevent Cross-Origin Resource Sharing (CORS) issues when interacting with your backend API, a proxy has been configured in the `vite.config.js` file:

JavaScript

```
// vite.config.js snippet
server: {
  proxy: {
    // Proxy requests from '/api' to your backend API
    '/api': {
      target: 'http://127.0.0.1:8000', // Your Python backend API URL
      changeOrigin: true, // Needed for virtual hosted sites
      rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix when forwarding
      // ws: true, // Uncomment if your backend uses WebSockets
    },
  },
},

```

This configuration ensures that any requests made by the frontend to `/api` will be transparently forwarded to your backend API running at `http://127.0.0.1:8000`, effectively bypassing common CORS restrictions.

