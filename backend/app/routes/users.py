from fastapi import APIRouter, HTTPException
from app.supabase.supabaseClient import supabase
from app.utils.users_ops import create_prompt
from app.models.user import PromptCreate

router = APIRouter()

@router.post("/")
def create_request(message: PromptCreate):
    
    result = create_prompt(message)
    if result["success"]:
        return result
    else:
        raise HTTPException(status_code=400, detail=result["error"])
