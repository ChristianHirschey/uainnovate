from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base model
class SupplyBase(BaseModel):
    name: str
    description: Optional[str] = None
    current_stock: int
    max_stock: int
    threshold: Optional[int] = 1
    unit: Optional[str] = "unit"
    purchase_url: Optional[str] = None
    purchase_price: Optional[float] = 0.00

# Create supply
class SupplyCreate(SupplyBase):
    """
    Model for creating a new supply.
    Does not include ID or timestamps — those are generated automatically.
    """
    pass

# Update supply
class SupplyUpdate(BaseModel):
    """
    Model for updating supply fields.
    All fields are optional to support partial updates.
    """
    name: Optional[str] = None
    description: Optional[str] = None
    current_stock: Optional[int] = None
    max_stock: Optional[int] = None
    threshold: Optional[int] = None
    unit: Optional[str] = None
    purchase_url: Optional[str] = None
    purchase_price: Optional[float] = None
    timestamp: Optional[datetime] = None

# Get output
class SupplyOut(SupplyBase):
    """
    Model for returning supply info to the frontend.
    Includes ID and timestamps.
    """
    id: str
    created_at: datetime
    updated_at: datetime

# Action for restocking
class SupplyAction(BaseModel):
    quantity: int
    user_id: Optional[str] = None
