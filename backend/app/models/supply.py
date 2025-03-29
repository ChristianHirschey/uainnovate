# app/models/supply.py
from pydantic import BaseModel
from typing import Optional

class Supply(BaseModel):
    name: str
    description: Optional[str] = None
    current_stock: int
    max_stock: int
    threshold: Optional[int] = 1
    unit: Optional[str] = "unit"
    purchase_url: Optional[str] = None
    purchase_price: Optional[float] = 0.00