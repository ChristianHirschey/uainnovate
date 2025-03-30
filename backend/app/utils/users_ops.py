import requests
import os
from dotenv import load_dotenv
import base64
import json
from google import genai
from google.genai import types
import httpx
from app.supabase.supabaseClient import supabase
from app.models.user import RequestMessage

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
                "item_type": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
            },
        ),
        system_instruction=[
            types.Part.from_text(text="""Your goal is to take a request from a user intended for an office manager and determine the category ('supply', 'maintenance', 'suggestion', 'other') and priority level ('very_low', 'low', 'medium', 'high', 'very_high'), and the item_type for the item requested (item_type should be as specific as possible including branding and type of supply) if the category is supply, in the output format specified."""),
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
    print("Generated JSON:", generated_json)
    return {"data": generated_json}

async def create_prompt(msg: RequestMessage) -> dict:
    try:
        generated = generate(msg.message)
        data = generated.get("data", {})
        category = data.get("category")
        priority_level = data.get("priority_level")
        item_type = data.get("item_type")
        item_id = supabase.from_("supplies").select("id").ilike("name", item_type).execute()

        print("Item ID:", item_id)
        print("Item type:", item_type)

        if category and priority_level:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://3880-130-160-194-110.ngrok-free.app/api/requests/",
                    json={
                        "type": category,
                        "description": msg.message,
                        "priority": priority_level,
                        "user_id": "anonymous",
                        "supply_id": item_id.data[0].get("id") if item_id.data else None,
                    }
                )

            return {"success": True, "message": "Prompt added"}

        return {
            "success": False,
            "error": "Insert failed. No data returned.",
            "raw_output": generated,
        }

    except Exception as e:
        print("Exception:", e)
        return {"success": False, "error": str(e)}
    