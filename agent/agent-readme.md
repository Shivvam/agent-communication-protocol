
# How to Get Started with ACP

----------

To begin working with ACP, follow these installation and setup steps:

## Installation of dependecies

`pip3 install -r requirements.txt`

## Provide GEMINI API KEY at environment variable

use env.example at root

provide value of 'GOOGLE_GEMINI_API_KEY'

## Running the ACP Server


----------

## Creating a Simple ACP Server with Mulitple Agents '/agent.py'

This example demonstrates how to set up an Agent Communication Protocol server with multiple agents

For example `Echo_Agent` and `Do_Nothing_Agent`.

### Echo_Agent

-   **Name:** `Echo_Agent`
    
-   **Description:** This agent simply echoes back any message it receives.
    
-   **Input Content Types:** `text/plain`
    
-   **Output Content Types:** `text/plain`
    
-   **How it works:** When the `Echo_Agent` receives input, it iterates through each message, introduces a small delay, yields a "thought" indicating its intention to echo, and then yields the original message back.
    

### Do_Nothing_Agent

-   **Name:** `Do_Nothing_Agent`
    
-   **Description:** This agent is designed to receive input but consistently responds with a generic "I will do nothing" message.
    
-   **Input Content Types:** `text/plain`
    
-   **Output Content Types:** `text/plain`
    
-   **How it works:** Similar to the `Echo_Agent`, this agent processes each input message with a delay and a "thought." However, instead of echoing the input, it yields a fixed string: "I will do nothing".
    

----------


Once you have agent.py and all dependencies are installed, you can start the server using .


```
uv run agent.py

```

## Usage

Once the server is running, you can interact with these agents using either the ACP SDK client or any tool capable of making HTTP requests to the exposed endpoints . 

**REST API Endpoint to list all agents :** `http://127.0.0.1:8000/agents`

----------

## Direct Access to ACP Agent Capabilities with Python SDK

You can also use the Python SDK to create an ACP client for direct access to agent capabilities.

For example, `client.py` demonstrates how to interact with an ACP SDK server, showcasing agent discovery, synchronous agent invocation, and streaming agent execution.

To run the client script:

Bash

```
uv run client.py

```

The `client.py` script includes three main functions, each demonstrating a different way to interact with an ACP SDK server. By default, the script is configured to run `stream_execution("Echo_Agent")`.

To run a specific example, uncomment the corresponding line in the `if __name__ == "__main__":` block and comment out the others.

### 1. Agent Discovery: `list_agents()`

This function connects to the server and lists all available agents by printing their names and descriptions.

Python

```
async def list_agents() -> None:
    client = Client(base_url="http://localhost:8000")
    async for agent in client.agents():
        print(agent.name, agent.description)

# To run:
# asyncio.run(list_agents())

```

**Output Example** (if `Echo_Agent` and `Do_Nothing_Agent` are on the server):

```
Echo_Agent Echoes everything
Do_Nothing_Agent This agent does nothing

```

### 2. Synchronous Agent Call: `agent_call(agent_name: str)`

This function demonstrates how to make a synchronous call to a specific agent on the server. It sends a `text/plain` message and prints the entire output received from the agent.

Python

```
async def agent_call(agent_name:str) -> None:
    async with Client(base_url="http://localhost:8000") as client:
        run = await client.run_sync(
            agent=agent_name,
            input=[
                Message(
                    parts=[MessagePart(content="hey hey to echo from client!", content_type="text/plain")]
                )
            ],
        )
        print(run.output)

# To run:
# asyncio.run(agent_call("Echo_Agent"))

```

**Output Example** (for `Echo_Agent`):

```
[Message(parts=[MessagePart(content='hey hey to echo from client!', content_type='text/plain', metadata={})])]

```

### 3. Streaming Agent Execution: `stream_execution(agent_name: str)`

This function shows how to get a stream of events from an agent's execution lifecycle. This is particularly useful for long-running agents or when you want to see intermediate "thoughts" or progress updates from the agent.

Python

```
async def stream_execution(agent_name:str) -> None:
    async with Client(base_url="http://localhost:8000") as client:
        async for event in client.run_stream(agent=agent_name, input=[Message(parts=[MessagePart(content="Howdy!")])]):
            print(event)

# To run (default):
# asyncio.run(stream_execution("Echo_Agent"))

```

----------

### Run the Agent via HTTP (Follow the instructions provided at '/forntend')

You can also interact with your ACP agents directly using HTTP requests. Here's an example of how to make a `POST` request to the `/runs` endpoint:

-   **URL:** `http://127.0.0.1:8000/runs`
    
-   **Method:** `POST`
    
-   **Data:**
    
    JSON
    
    ```
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
    
-   **Response Example:**
    
    JSON
    
    ```
    {
        "run_id": "a2a0b7dd-b7d5-44c9-bc1d-35be499399bc",
        "agent_name": "Echo_Agent",
        "session_id": "ecadbce4-fea2-4f96-96db-d2c099e76918",
        "status": "completed",
        "await_request": null,
        "output": [
            {
                "role": "agent/Echo_Agent",
                "parts": [
                    {
                        "name": null,
                        "content_type": "text/plain",
                        "content": "Hey hey!",
                        "content_encoding": "plain",
                        "content_url": null,
                        "metadata": null
                    }
                ],
                "created_at": "2025-07-04T05:42:52.442805Z",
                "completed_at": "2025-07-04T05:42:52.442805Z"
            }
        ],
        "error": null,
        "created_at": "2025-07-04T05:42:52.442805Z",
        "finished_at": "2025-07-04T05:42:53.443712Z"
    }
    
    ```