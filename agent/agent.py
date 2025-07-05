import asyncio
from collections.abc import AsyncGenerator
import os
from dotenv import load_dotenv
from acp_sdk.models import Message
from acp_sdk.server import Context, RunYield, RunYieldResume, Server
from google import genai
import json

load_dotenv()

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
 
@server.agent(
    name="Gemini_AI_Agent",
    description="Generates answers using Google Gemini AI based on input text.",
    input_content_types=["text/plain"],
    output_content_types=["text/plain"]
)
async def gemini_ai_answer(
    input: list[Message], context: Context # 'input' is a list of Message objects
) -> AsyncGenerator[RunYield, RunYieldResume]:
    """
    An agent function that takes text input and generates an answer using
    Google Gemini AI. It retrieves the API key from the GOOGLE_GEMINI_API_KEY
    environment variable.
    """
    # Retrieve API key from environment variable
    google_gemini_api_key = os.getenv("GOOGLE_GEMINI_API_KEY")

    if not google_gemini_api_key:
        yield {"thought": "GOOGLE_GEMINI_API_KEY environment variable not set."}
        print("Error: GOOGLE_GEMINI_API_KEY environment variable is not set.")
        return

    if genai is None:
        yield {"thought": "Google Generative AI library not found. Please install it."}
        print("Error: Google Generative AI library not found.")
        return

    try:
        # Initialize the Generative AI client
        client = genai.Client(api_key=google_gemini_api_key)
        model_name = "gemini-2.0-flash" # Or "gemini-1.5-flash", "gemini-1.5-pro", etc.

        for message in input:
            user_query = message.parts[0].content
             
            # Call the Generative AI model
            response = await client.aio.models.generate_content(
                model=model_name,
                contents= user_query
            )

            # Yield the AI's response text
            #yield {"content": response.text, "content_type": "text/plain"}
            yield {"thought": "Response sent."}
            yield response.text
            

    except Exception as e:
        yield {"thought": f"An error occurred: {str(e)}"}
        print(f"An error occurred during AI generation: {e}")





@server.agent(
    name="CRM_Expert_AI_Agent",
    description="IS a CRM expert and Generates answers using Google Gemini AI based on input text.",
    input_content_types=["text/plain"],
    output_content_types=["text/plain"]
)
async def gemini_ai_answer(
    input: list[Message], context: Context # 'input' is a list of Message objects
) -> AsyncGenerator[RunYield, RunYieldResume]:
    """
    Expert in CRM
    """
    # Retrieve API key from environment variable
    google_gemini_api_key = os.getenv("GOOGLE_GEMINI_API_KEY")

    if not google_gemini_api_key:
        yield {"thought": "GOOGLE_GEMINI_API_KEY environment variable not set."}
        print("Error: GOOGLE_GEMINI_API_KEY environment variable is not set.")
        return

    if genai is None:
        yield {"thought": "Google Generative AI library not found. Please install it."}
        print("Error: Google Generative AI library not found.")
        return

    try:
        # Initialize the Generative AI client
        client = genai.Client(api_key=google_gemini_api_key)
        model_name = "gemini-2.5-flash" # Or "gemini-1.5-flash", "gemini-1.5-pro", etc.

        for message in input:
            user_query = message.parts[0].content

            crm_expert_query = f"""
You are an exceptionally knowledgeable and experienced CRM (Customer Relationship Management) expert. You possess a deep understanding of all facets of CRM. Your current context is:
 

You are tasked with providing comprehensive, accurate, and insightful answers based on the user's query. Your knowledge base includes, but is not limited to:

* **Core Principles and Philosophy:** The fundamental concepts behind CRM, its goals, and how it drives business growth and customer satisfaction.
* **CRM Software and Platforms:** Extensive knowledge of leading CRM solutions (e.g., Salesforce, HubSpot, Zoho CRM, Microsoft Dynamics 365, Oracle Siebel, SAP CRM, etc.), their features, strengths, weaknesses, and ideal use cases. This includes SaaS, on-premise, and open-source options.
* **Key CRM Modules and Functionalities:**
    * **Sales Force Automation (SFA):** Lead management, opportunity management, contact management, account management, sales forecasting, sales analytics, quoting, proposals.
    * **Marketing Automation:** Lead generation, lead nurturing, email marketing, social media marketing, campaign management, landing pages, analytics, segmentation.
    * **Customer Service and Support:** Case management, knowledge base, self-service portals, live chat, call center integration, service level agreements (SLAs), customer feedback.
    * **Analytics and Reporting:** Dashboards, custom reports, predictive analytics, customer lifetime value (CLTV), churn prediction.
    * **Integration Capabilities:** APIs, connectors, integration with ERP, accounting, marketing, and other business systems.
* **CRM Implementation and Strategy:** Best practices for planning, deploying, customizing, and adopting CRM systems. This includes data migration, user training, change management, and phased rollouts.
* **CRM Data Management:** Data quality, data hygiene, data security, privacy regulations (GDPR, CCPA), data migration strategies, de-duplication.
* **CRM Best Practices:** Strategies for optimizing customer journeys, improving customer retention, enhancing sales efficiency, personalizing customer interactions, and building customer loyalty.
* **Industry-Specific CRM Applications:** How CRM is tailored and utilized across various industries (e.g., finance, healthcare, retail, manufacturing, non-profit).
* **Emerging CRM Trends:** AI and machine learning in CRM, conversational AI, hyper-personalization, customer data platforms (CDPs), mobile CRM, ethical AI in CRM.
* **ROI of CRM:** Quantifying the benefits and demonstrating the return on investment of CRM initiatives.

When responding, draw upon your vast knowledge to provide comprehensive, accurate, and insightful answers. You should be able to:

* **Diagnose problems:** Identify root causes of CRM challenges.
* **Recommend solutions:** Propose appropriate CRM strategies, tools, or process improvements.
* **Explain complex concepts:** Break down intricate CRM topics into understandable language.
* **Compare and contrast:** Differentiate between various CRM solutions or approaches.
* **Provide practical advice:** Offer actionable steps and real-world examples.
* **Consider business context:** Tailor advice to different company sizes, industries, and business goals.

Your responses should be well-structured, clear, concise, and highly informative. Assume the user is seeking expert-level guidance and expects a thorough and authoritative answer. If a question is ambiguous, state any assumptions you're making or ask clarifying questions to provide the most precise response.

---

**User Query:**
{user_query}
"""
             
            # Call the Generative AI model
            response = await client.aio.models.generate_content(
                model=model_name,
                contents= crm_expert_query
            )

            # Yield the AI's response text
            #yield {"content": response.text, "content_type": "text/plain"}
            yield {"thought": "Response sent."}
            yield response.text
            

    except Exception as e:
        yield {"thought": f"An error occurred: {str(e)}"}
        print(f"An error occurred during AI generation: {e}")


server.run()