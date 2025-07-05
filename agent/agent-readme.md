# Getting Started with ACP

This guide provides the necessary steps to install dependencies, configure your environment, and run the ACP server.

-----

## 1\. Installation and Configuration

First, set up your project environment and dependencies.

  * **Install Dependencies**: Install all required Python packages using the `requirements.txt` file.

    ```bash
    pip3 install -r requirements.txt
    ```

  * **Configure Environment Variables**: Create a `.env` file in the project root (you can use `env.example` as a template). Inside this file, provide your **Google Gemini API Key**.

    ```ini
    GOOGLE_GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

-----

## 2\. Running the ACP Server

Once the dependencies are installed and your API key is configured, you can start the server. The example `agent.py` file demonstrates how to create a server with multiple agents.

  * **Start the Server**: Use `uvicorn` to run the agent server.
    ```bash
    uv run agent.py
    ```
    

Once running, the server will expose a **REST API** endpoint to list all available agents at `http://127.0.0.1:8000/agents`.

### Example Agents in `agent.py`

The sample server includes two basic agents to demonstrate functionality:

  * **Echo\_Agent**: A simple agent that echoes back any message it receives. It accepts and returns `text/plain` content.
  * **Do\_Nothing\_Agent**: An agent that receives input but always responds with the message, "I will do nothing." It also uses `text/plain` for input and output.

-----

## 3\. Interacting with Agents

You can interact with the running agents in three primary ways: using the Python SDK, making direct HTTP requests, or through a frontend interface.

### Option 1: Use the Python SDK (`client.py`)

The `client.py` script provides examples of how to use the ACP Python client to interact with agents programmatically.

  * **Run the Client**:
    ```bash
    python3 client.py
    ```

The script is pre-configured to run the `stream_execution("Echo_Agent")` example. You can edit the `if __name__ == "__main__":` block in `client.py` to test other functions.

  * **List Available Agents**: Discovers and prints the details of all agents on the server.

    ```python
    async def list_agents() -> None:
        client = Client(base_url="http://localhost:8000")
        async for agent in client.agents():
            print(f"- {agent.name}: {agent.description}")
    ```

  * **Make a Synchronous Agent Call**: Sends a message and waits for the complete response.

    ```python
    async def agent_call(agent_name: str) -> None:
        async with Client(base_url="http://localhost:8000") as client:
            run = await client.run_sync(
                agent=agent_name,
                input=[Message(parts=[MessagePart(content="Hello from the client!")])],
            )
            print(run.output)
    ```

  * **Stream the Agent Execution**: Receives real-time events, including intermediate "thoughts" and the final output. This is ideal for long-running tasks.

    ```python
    async def stream_execution(agent_name: str) -> None:
        async with Client(base_url="http://localhost:8000") as client:
            async for event in client.run_stream(
                agent=agent_name, input=[Message(parts=[MessagePart(content="Howdy!")])]
            ):
                print(event)
    ```

### Option 2: Make Direct HTTP Requests

You can use any HTTP client (like `curl` or Postman) to interact with the agents.

  * **Endpoint**: `http://127.0.0.1:8000/runs`
  * **Method**: `POST`
  * **Body**:
    ```json
    {
      "agent_name": "Echo_Agent",
      "input": [
        {
          "role": "user",
          "parts": [
            {
              "content": "Hey hey!",
              "content_type": "text/plain"
            }
          ]
        }
      ]
    }
    ```

### Option 3: Use the Frontend Application

For a user-friendly interface, navigate to the `/frontend` directory and follow the instructions in its `readme.md` file to launch the web client.