import asyncio

from acp_sdk.client import Client
from acp_sdk.models import Message, MessagePart


## Agent Discovery -> List all agents on server
async def list_agents() -> None:
    client = Client(base_url="http://localhost:8000")
    async for agent in client.agents():
        print(agent.name, agent.description)



## calling  an agent -> Whatever you pass to echo agent, gets printed in return
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


## streaming execution of an agent server -> Gets Agent Lifecycle
async def stream_execution(agent_name:str) -> None:
    async with Client(base_url="http://localhost:8000") as client:
        async for event in client.run_stream(agent=agent_name, input=[Message(parts=[MessagePart(content="Howdy!")])]):
            print(event)



if __name__ == "__main__":
    #asyncio.run(list_agents())
    #asyncio.run(agent_call("Echo_Agent"))
    asyncio.run(stream_execution("Echo_Agent"))
    