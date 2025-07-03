import asyncio
from collections.abc import AsyncGenerator

from acp_sdk.models import Message
from acp_sdk.server import Context, RunYield, RunYieldResume, Server

server = Server()


@server.agent(
    name="Echo_Agent",
    description="Echoes everything",
    input_content_types=["text/plain"],
    output_content_types=["text/plain"]
    )
async def echo(
    input: list[Message], context: Context
) -> AsyncGenerator[RunYield, RunYieldResume]:
  
    for message in input:
        await asyncio.sleep(0.5)
        yield {"thought": "I should echo everything"}
        await asyncio.sleep(0.5)
        yield message


@server.agent(
    name="Do_Nothing_Agent",
    description="This agent does nothing",
    input_content_types=["text/plain"],
    output_content_types=["text/plain"]
    )
async def do_nothing(
    input: list[Message], context: Context
) -> AsyncGenerator[RunYield, RunYieldResume]:
  
    for message in input:
        await asyncio.sleep(0.5)
        yield {"thought": "I should echo everything"}
        await asyncio.sleep(0.5)
        yield "I will do nothing"
 


server.run()