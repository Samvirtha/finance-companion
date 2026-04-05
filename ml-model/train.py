import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
from preprocess import load_and_clean_data

# Load and clean data
df = load_and_clean_data("/Users/ss/Downloads/finance-companion/ml-model/data/personal_transactions.csv")

# ✅ Ensure correct feature columns exist
print("Columns:", df.columns)

# Select features
X = df[['Amount']]
# ✅ DEBUG: Check range (VERY IMPORTANT)
print("Amount range:", df['Amount'].min(), df['Amount'].max())

# Scale data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train K-Means
model = KMeans(n_clusters=3, random_state=42, n_init=10)
model.fit(X_scaled)

# Assign cluster labels
df['Cluster'] = model.labels_

# ✅ FIX 1: DO NOT sort immediately
cluster_means = df.groupby('Cluster')['Amount'].mean()

print("\nCluster Means (UNSORTED):\n", cluster_means)

# ✅ FIX 2: Sort separately (clean logic)
sorted_clusters = cluster_means.sort_values().index.tolist()

print("\nSorted Clusters:", sorted_clusters)

# Map cluster → meaning
cluster_map = {
    sorted_clusters[0]: "Saver",
    sorted_clusters[1]: "Normal",
    sorted_clusters[2]: "Risky"
}

print("\nCluster Map:", cluster_map)

# Save everything
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(cluster_map, "cluster_map.pkl")

print("✅ Model, scaler, and cluster_map saved!")