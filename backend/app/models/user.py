from pydantic import BaseModel

class PromptCreate(BaseModel):
    message: str