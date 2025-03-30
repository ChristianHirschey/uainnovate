from fastapi import APIRouter, HTTPException
from app.supabase.supabaseClient import supabase
from app.utils.users_ops import create_prompt, create_qr_request
from app.models.user import PromptCreate, QRRequestCreate

router = APIRouter()

@router.post("/")
async def create_request(message: PromptCreate):
    
    result = await create_prompt(message)
    if result["success"]:
        return result
    else:
        raise HTTPException(status_code=400, detail=result["error"])
    
@router.post("/qr-request")
async def create_qr_request(request: QRRequestCreate):
    result = await create_qr_request(request)
    if result["success"]:
        return result
    else:
        raise HTTPException(status_code=400, detail=result["error"])
