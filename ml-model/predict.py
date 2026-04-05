import pandas as pd
import joblib

# Load saved objects
model = joblib.load("/Users/ss/Downloads/finance-companion/ml-model/model.pkl")
scaler = joblib.load("/Users/ss/Downloads/finance-companion/ml-model/scaler.pkl")
cluster_map = joblib.load("/Users/ss/Downloads/finance-companion/ml-model/cluster_map.pkl")

def predict_transaction(amount, hour, weekend, category):
    
    # 🔥 FIX 1: Clip extreme values (IMPORTANT)
    # prevents scaling explosion

    # Create input dataframe
    df = pd.DataFrame([[amount]], columns=['Amount'])
    # Scale features
    X_scaled = scaler.transform(df)
    
    # 🔍 DEBUG (VERY IMPORTANT)
    print("Input:", df.values)
    print("Scaled:", X_scaled)

    # Predict cluster
    cluster = model.predict(X_scaled)[0]
    print("Cluster:", cluster)

    # Map to label
    return cluster_map[cluster]


# -------------------
# Example test
if __name__ == "__main__":
    inputs = [
        {"amount": 100, "hour": 10, "weekend": 0, "category": 1},
        {"amount": 1500, "hour": 18, "weekend": 0, "category": 2},
        {"amount": 8000, "hour": 23, "weekend": 1, "category": 3}
    ]
    
    for i, inp in enumerate(inputs, 1):
        label = predict_transaction(**inp)
        print(f"Test {i}: {label}")