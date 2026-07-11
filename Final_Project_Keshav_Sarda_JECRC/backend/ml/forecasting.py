import pandas as pd
import numpy as np
from prophet import Prophet
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "daily_dataset.csv")

def get_forecast():
    # Load a limited amount of data to keep it fast for the dashboard
    # In a real scenario, you'd load from a DB or pre-process this
    try:
        # Load first 100,000 rows to get a representative sample of days
        df = pd.read_csv(DATA_PATH, usecols=['day', 'energy_sum'], nrows=100000)
    except FileNotFoundError:
        return {"error": "Dataset not found"}

    df['day'] = pd.to_datetime(df['day'])
    
    # Aggregate total energy consumption per day
    daily_total = df.groupby('day')['energy_sum'].sum().reset_index()
    daily_total.columns = ['ds', 'y']
    
    # Fill missing dates if any
    daily_total.set_index('ds', inplace=True)
    daily_total = daily_total.resample('D').sum().reset_index()
    
    # Train Prophet model
    model = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
    model.fit(daily_total)
    
    # Forecast for the next 30 days
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    
    # Format for JSON response
    result = {
        "historical": [
            {"date": row['ds'].strftime("%Y-%m-%d"), "energy": row['y']}
            for _, row in daily_total.iterrows()
        ],
        "forecast": [
            {
                "date": row['ds'].strftime("%Y-%m-%d"),
                "energy": row['yhat'],
                "lower": row['yhat_lower'],
                "upper": row['yhat_upper']
            }
            for _, row in forecast.tail(30).iterrows()
        ]
    }
    return result
