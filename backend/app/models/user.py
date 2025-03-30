from pydantic import BaseModel
from uuid import UUID
from typing import Optional
class PromptCreate(BaseModel):
    message: str
    user_id: Optional[UUID] = None

