import sys
import os

# Add ml-model folder to path
sys.path.append(os.path.abspath("../ml-model"))

from predict import predict_transaction


def predict_user(data: dict):
    amount = data.get("amount")

    # Minimal version (since we now use only Amount)
    result = predict_transaction(
        amount=amount,
        hour=0,
        weekend=0,
        category=0
    )

    return result