from pydantic import BaseModel
from uuid import UUID

class PromptCreate(BaseModel):
    message: str
    user_id: UUID

class QRRequestCreate(BaseModel):
    message: str
