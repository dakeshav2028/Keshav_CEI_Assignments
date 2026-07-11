from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Energy Analytics API")

# Configure CORS so the React frontend can communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Energy Analytics System API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

from ml.forecasting import get_forecast
from ml.clustering import get_clusters

@app.get("/api/forecast")
def forecast():
    return get_forecast()

@app.get("/api/clusters")
def clusters():
    return get_clusters()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
