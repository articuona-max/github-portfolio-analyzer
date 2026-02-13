from fastapi import FastAPI
from app.core.config import settings

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
    )
    
    # Add health check
    @application.get("/health")
    def health_check():
        return {"status": "ok", "project": settings.PROJECT_NAME}

    # Add CORS
    from fastapi.middleware.cors import CORSMiddleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register Routers
    from app.api import profile
    application.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])
        
    return application

app = create_application()
