from fastapi import APIRouter, HTTPException
from app.utils.log_ops import get_all_logs

router = APIRouter()


@router.get("/")
def get_logs():
    try:
        response = get_all_logs()
        if response["success"]:
            return {'data': response["data"], 'message': response["message"]}
        else:
            raise HTTPException(status_code=400, detail=response["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    