from fastapi import APIRouter, HTTPException
from app.models.supply import SupplyCreate, SupplyUpdate, SupplyOut, SupplyAction
from app.utils import supply_ops

router = APIRouter()

# Create new supply
@router.post("/", response_model=SupplyOut)
def create_supply(supply: SupplyCreate):
    result = supply_ops.create_supply_record(supply)
    if result.get("success"):
        return supply_ops.get_supply_by_id(result["id"])
    raise HTTPException(status_code=400, detail=result.get("error", "Failed to create supply"))


# Get all low stock supplies
@router.get("/low-stock", response_model=list[SupplyOut])
def low_stock_supplies():
    result = supply_ops.get_supplies_below_threshold()
    if result is not None:
        return result
    raise HTTPException(status_code=500, detail="Failed to fetch low-stock items")


# Get all supplies
@router.get("/", response_model=list[SupplyOut])
def get_all_supplies():
    data = supply_ops.get_all_supplies()
    if data is not None:
        return data
    raise HTTPException(status_code=500, detail="Error fetching supplies")


# Get supply by ID
@router.get("/{supply_id}", response_model=SupplyOut)
def get_supply(supply_id: str):
    data = supply_ops.get_supply_by_id(supply_id)
    if data:
        return data
    raise HTTPException(status_code=404, detail="Supply not found")


# Update supply with ID
@router.patch("/{supply_id}", response_model=SupplyOut)
def update_supply(supply_id: str, updates: SupplyUpdate):
    result = supply_ops.update_supply(supply_id, updates)
    if result:
        return supply_ops.get_supply_by_id(supply_id)
    raise HTTPException(status_code=400, detail="Update failed")


# Delete supply by ID
@router.delete("/{supply_id}")
def delete_supply(supply_id: str):
    result = supply_ops.delete_supply(supply_id)
    if result:
        return {"success": True, "message": "Supply deleted"}
    raise HTTPException(status_code=404, detail="Supply not found or already deleted")


# Restock supply
@router.post("/{supply_id}/restock")
def restock_supply(supply_id: str, action: SupplyAction):
    return supply_ops.restock_supply(
        supply_id=supply_id,
        quantity=action.quantity,
        user_id=action.user_id
)


# Consume supply
@router.post("/{supply_id}/consume")
def consume_supply(supply_id: str, action: SupplyAction):
    return supply_ops.consume_supply(
        supply_id=supply_id,
        quantity=action.quantity,
        user_id=action.user_id
    )
