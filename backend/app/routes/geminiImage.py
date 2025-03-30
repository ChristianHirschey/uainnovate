from fastapi import File, UploadFile, HTTPException, APIRouter
from typing import Dict, List, Any
from pydantic import BaseModel
from dotenv import load_dotenv

from app.utils.qr_ops import process_image
# Load environment variables
load_dotenv()
router = APIRouter()

class GeminiResponse(BaseModel):
    items: List[Dict[str, Any]]

@router.post("/", response_model=GeminiResponse)
async def gemini_image(file: UploadFile = File(...)):
    """
    Process an image with Google's Gemini model and return structured data
    """
    print("trying to process image")
    processed_data = await process_image(file)
    print(processed_data)
    return processed_data
