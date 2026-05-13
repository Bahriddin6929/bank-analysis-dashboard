from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from main import get_summary, get_top_customers, get_recent_transactions

app = FastAPI(title="Bank Analysis API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/summary")
def api_summary():
    return get_summary()

@app.get("/api/top-customers")
def api_top_customers():
    return get_top_customers()

@app.get("/api/transactions")
def api_transactions():
    return get_recent_transactions()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
