# AI-Powered Energy Analytics System

This project is an AI-powered energy analytics system built using smart meter data. It forecasts consumption, identifies usage patterns, and delivers optimization insights for smarter and more efficient energy management. 

It is divided into two parts:
1. **Backend (Python + FastAPI)**: Handles data loading, machine learning forecasting (using Prophet), and clustering (using K-Means).
2. **Frontend (React + Vite)**: A highly aesthetic, interactive dashboard visualizing the insights using Recharts.

---

## Prerequisites
- Node.js (v16+)
- Python (3.9+)

## Setup and Installation

### 1. Data Setup
The application uses the London Smart Meter dataset from Kaggle.
To download the data, you can run the provided ingestion script:
```bash
python data_ingestion.py
```
*Note: Make sure your kagglehub is authenticated.*

### 2. Backend Setup
Open a terminal and navigate to the project root directory.

Create and activate a virtual environment (if you haven't already):
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:
```powershell
pip install -r requirements.txt
```

### 3. Frontend Setup
Open a **new** terminal, navigate to the `frontend` folder, and install the npm packages:
```powershell
cd frontend
npm install
```

---

## How to Run the Application

You must run both the backend and frontend simultaneously in two separate terminals.

### Terminal 1: Start the Backend Server
```powershell
# From the project root folder
.\venv\Scripts\Activate.ps1
cd backend
uvicorn main:app --reload
```
The backend API will run at `http://localhost:8000`.

### Terminal 2: Start the Frontend Dashboard
```powershell
# From the frontend folder
cd frontend
npm run dev
```
The interactive web dashboard will be available at `http://localhost:5173`. Open this URL in your web browser to view the AI insights!
