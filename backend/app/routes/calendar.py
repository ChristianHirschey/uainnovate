from fastapi import APIRouter, HTTPException
from app.models.calendar import EventCreate  # assuming you've made this
from app.utils.calendar_ops import get_all_events, create_event  # utility functions you'll define

router = APIRouter()

@router.get("/")
def read_events():
    try:
        response = get_all_events()
        if response["success"]:
            return {"data": response["data"], "message": response["message"]}
        else:
            raise HTTPException(status_code=500, detail=response["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def add_event(event: EventCreate):
    try:
        response = create_event(event)
        if response["success"]:
            return {"data": response["data"], "message": response["message"]}
        else:
            raise HTTPException(status_code=500, detail=response["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
