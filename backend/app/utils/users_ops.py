import requests
import os
from dotenv import load_dotenv
import base64
import json
from google import genai
from google.genai import types
from app.models.user import PromptCreate
import httpx

def generate(message: str) -> dict:
    client = genai.Client(
        api_key=os.environ.get("GEMINI_KEY"),
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=message),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0,
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
            type = genai.types.Type.OBJECT,
            properties = {
                "category": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "priority_level": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
            },
        ),
        system_instruction=[
            types.Part.from_text(text="""Your goal is to take a request from a user intended for an office manager and determine the category ('supply', 'maintenance', 'suggestion', 'other') and priority level ('very_low', 'low', 'medium', 'high', 'very_high') in the output format specified."""),
        ],
    )

    output = []
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        output.append(chunk.text)
    
    full_text =  "".join(output)

    try:
        # Try to parse the generated output as JSON.
        generated_json = json.loads(full_text)
    except Exception as e:
        print("Error decoding JSON:", e)
        generated_json = {}

    # Return a dictionary with a "data" key, as expected by create_prompt.
    return {"data": generated_json}

async def create_prompt(prompt: PromptCreate) -> dict:
    try:
        response = generate(prompt.message)
        #data.category
        #data.priority_level
        if response.get("data"):
            with httpx.AsyncClient() as client:
                response = await client.post(
                "localhost:8000/api/requests/",
                data={"type": response.category, "description": prompt.message, "priority": response.priority_level, "user_id": prompt.user_id}
    )

            return {"success": True, "message": "Prompt added"}

        return {
            "success": False,
            "error": "Insert failed. No data returned.",
            "raw_output": response,
        }

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}