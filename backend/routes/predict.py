from fastapi import APIRouter
from pydantic import BaseModel
from services.ml_service import predict_user

router = APIRouter()

class PredictRequest(BaseModel):
    amount: float   # ✅ ONLY this field

@router.post("/predict")
def predict(data: PredictRequest):
    result = predict_user(data.dict())
    return {"prediction": result}