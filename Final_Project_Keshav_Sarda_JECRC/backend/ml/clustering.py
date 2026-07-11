import pandas as pd
from sklearn.cluster import KMeans
import os

INFO_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "informations_households.csv")
DAILY_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "daily_dataset.csv")

def get_clusters():
    try:
        # Load a sample of daily data to calculate household stats
        daily_df = pd.read_csv(DAILY_PATH, usecols=['LCLid', 'energy_sum', 'energy_max'], nrows=100000)
    except FileNotFoundError:
        return {"error": "Dataset not found"}
        
    # Aggregate stats per household
    hh_stats = daily_df.groupby('LCLid').agg(
        total_energy=('energy_sum', 'sum'),
        max_energy=('energy_max', 'max'),
        avg_daily=('energy_sum', 'mean')
    ).reset_index()
    
    # Use KMeans to cluster into 3 usage patterns: Low, Medium, High consumers
    X = hh_stats[['avg_daily', 'max_energy']].fillna(0)
    if len(X) < 3:
        return {"error": "Not enough data to cluster"}
        
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    hh_stats['cluster'] = kmeans.fit_predict(X)
    
    # Calculate cluster centers to assign meaningful names
    centers = hh_stats.groupby('cluster')['avg_daily'].mean().sort_values()
    labels = {centers.index[0]: 'Low Consumer', centers.index[1]: 'Medium Consumer', centers.index[2]: 'High Consumer'}
    hh_stats['cluster_label'] = hh_stats['cluster'].map(labels)
    
    # Prepare summary for the dashboard
    cluster_summary = hh_stats.groupby('cluster_label').agg(
        count=('LCLid', 'count'),
        avg_daily_energy=('avg_daily', 'mean'),
        avg_max_energy=('max_energy', 'mean')
    ).reset_index()
    
    # Format for JSON response
    result = {
        "summary": cluster_summary.to_dict(orient="records"),
        "scatter_data": [
            {
                "id": row['LCLid'],
                "avg_daily": row['avg_daily'],
                "max_energy": row['max_energy'],
                "cluster": row['cluster_label']
            }
            # return a sample to avoid overwhelming the frontend
            for _, row in hh_stats.sample(min(500, len(hh_stats))).iterrows()
        ]
    }
    
    return result
