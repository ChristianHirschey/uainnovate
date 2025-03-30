import difflib
from typing import Any, Dict
from google import genai
from google.genai import types
import base64
import json
import asyncio
import os
from fastapi import UploadFile, File, HTTPException
import uuid
from app.utils.supply_ops import get_all_supplies, consume_supply


async def process_image(file: UploadFile = File(...)):
    """
    Process an image with Google's Gemini model and return structured data
    
    - Accepts an image file upload
    - Processes image with Gemini Vision API
    - Returns structured data about the image content
    """
    try:
        # Read file contents
        print("reading file contents")
        contents = await file.read()
        print(f"File contents type: {type(contents)}, size: {len(contents)} bytes")
        
        # Get mime type
        mime_type = file.content_type or "image/jpeg"  # Default to jpeg if not provided
        print(f"Using mime type: {mime_type}")
        
        # Initialize the Gemini client
        print("initializing gemini client")
        client = genai.Client(
            api_key=os.environ.get("GEMINI_KEY"),
        )
        print("gemini client initialized")
        
        # Use gemini-1.5-pro-vision for vision capabilities
        model = "gemini-2.0-flash"
        print(f"Using model: {model}")
        
        # Create the prompt text
        prompt_text = "Analyze this image and identify the focus item in the image (typically food, drink, or an office supply). Be specific and detailed about what you see in the image."
        
        # Create a base64 encoded string of the image
        # Skip this step to use raw bytes directly - following your working pattern
        
        # Define the schema for the response
        generate_content_config = types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
            response_schema=genai.types.Schema(
                type=genai.types.Type.OBJECT,
                properties={
                    "items": genai.types.Schema(
                        type=genai.types.Type.ARRAY,
                        items=genai.types.Schema(
                            type=genai.types.Type.OBJECT,
                            properties={
                                "name": genai.types.Schema(
                                    type=genai.types.Type.STRING,
                                ),
                                "description": genai.types.Schema(
                                    type=genai.types.Type.STRING,
                                ),
                                "quantity": genai.types.Schema(
                                    type=genai.types.Type.STRING,
                                ),
                                "priority": genai.types.Schema(
                                    type=genai.types.Type.STRING,
                                ),
                                "category": genai.types.Schema(
                                    type=genai.types.Type.STRING,
                                ),
                            },
                        ),
                    ),
                },
            ),
            system_instruction=[
                types.Part.from_text(text="Your task is to analyze the image and identify any items or objects that would be needed or required in a typical office or work environment. For each item detected, provide a name, brief description, estimated quantity needed, priority level (high/medium/low), and a category for the item."),
            ],
        )
        
        # Create the contents with text prompt and image data
        print("creating content")
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt_text),
                    # Use inline_data format with raw binary data
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": base64.b64encode(contents).decode("utf-8")
                        }
                    }
                ],
            ),
        ]
        
        # Generate content with streaming, just like your working example
        print("generating content")
        def generate_content_sync():
            try:
                output = []
                for chunk in client.models.generate_content_stream(
                    model=model,
                    contents=contents,
                    config=generate_content_config,
                ):
                    output.append(chunk.text)
                
                full_text = "".join(output)
                print(f"Response text preview: {full_text[:100]}...")
                return full_text
            except Exception as e:
                print(f"API call failed with error: {str(e)}")
                import traceback
                print(traceback.format_exc())
                raise
        
        # Run the synchronous operation in a thread pool
        loop = asyncio.get_event_loop()
        result_text = await loop.run_in_executor(None, generate_content_sync)
        
        print("response received")
        
        # Parse the JSON response
        try:
            # Try to parse the generated output as JSON
            parsed_data = json.loads(result_text)
            
            # Ensure the response has the expected structure
            if "items" not in parsed_data:
                parsed_data = {"items": [parsed_data]}
                
            # Add request ID to each item
            request_id = str(uuid.uuid4())
            for item in parsed_data["items"]:
                item["request_id"] = request_id
                
            print("Returning parsed data")
            handle_parsed_data(parsed_data)
            return parsed_data
            
        except json.JSONDecodeError as json_err:
            print(f"JSON decode error: {str(json_err)}")
            # If JSON parsing fails, create a fallback structure
            return {
                "items": [
                    {
                        "name": "Unspecified item",
                        "description": result_text[:200],  # Use part of the raw text
                        "quantity": "1",
                        "priority": "medium",
                        "category": "unknown",
                        "request_id": str(uuid.uuid4())
                    }
                ]
            }
            
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
def handle_parsed_data(parsed_data: Dict[str, Any]):
    """
    Handle the parsed data from image processing
    """
    # Get all existing supplies from the database
    all_supplies = get_all_supplies()
    
    # Map supplies by name for easier lookup
    supply_map = {supply["name"].lower(): supply["id"] for supply in all_supplies}
    
    results = []
    
    # Process each detected item
    for item in (parsed_data.get("items", [])):
        item_name = item.get("name", "").lower()
        
        # Try to find a matching supply
        matched_supply_name = None
        matched_supply_id = None
        for supply_name, supply in supply_map.items():
            # Simple contains check
            if item_name in supply_name or supply_name in item_name:
                matched_supply_name = supply_name
                matched_supply_id = supply
                break
                        
        # If no direct match, try fuzzy matching
        if matched_supply_name is None:
            matches = difflib.get_close_matches(
                item_name,
                supply_map.keys(),
                n=1,
                cutoff=0.6
            )
            
            if matches:
                matched_supply_name = matches[0]
                matched_supply_id = supply_map[matched_supply_name]
        
        # If we found a match, consume one unit
        if matched_supply_name:
            # Create a supply action
            quantity = 1  # Default to consuming 1 unit
            
            # Consume the supply
            result = consume_supply(
                supply_id=str(matched_supply_id),
                quantity=quantity,
                user_id=None  # You might want to pass a user ID here
            )
            
            results.append({
                "item": item.get("name"),
                "matched_supply": matched_supply_name,
                "supply_id": matched_supply_id,
                "consumed": result.get("success", False),
                "new_stock": result.get("new_stock"),
                "error": result.get("error")
            })
        else:
            # No match found
            results.append({
                "item": item.get("name"),
                "matched": False,
                "error": "No matching supply found"
            })

        if matched_supply_id:
            quantity_to_subtract = item.get("quantity", 1)
        
            consume_supply(
                supply_id=str(matched_supply_id),
                quantity=quantity_to_subtract,
                user_id=None 
            )

if __name__ == "__main__":
    parsed = {'items': [{'name': 'tissue', 'description': 'A cup of coffee with latte art, likely a cappuccino or latte.', 'quantity': 'Variable, depending on employee preference', 'priority': 'Medium', 'category': 'Beverage', 'request_id': 'cc76561d-a37a-4f62-be91-7e99eb306c17'}]}

    results = handle_parsed_data(parsed)

    print("Results:", results)