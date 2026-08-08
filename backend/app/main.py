from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import health, facilities, heat, risk, ai, alerts, reports

app = FastAPI(
    title="HeatShield AI Enterprise Operations API",
    description="Intelligent heat-risk monitoring & decision-support backend engine for FortyGuard Hackathon '26.",
    version="1.0.0-prototype"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(facilities.router)
app.include_router(heat.router)
app.include_router(risk.router)
app.include_router(ai.router)
app.include_router(alerts.router)
app.include_router(reports.router)

@app.get("/")
async def root():
    return {
        "message": "HeatShield AI Operations API is active.",
        "fortyguard_mode": settings.FORTYGUARD_MODE,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
