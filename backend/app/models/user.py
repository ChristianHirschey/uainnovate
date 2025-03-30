from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class RequestMessage(BaseModel):
    message: str

