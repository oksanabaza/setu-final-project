from fastapi import FastAPI

from backend.routes import user_routes

app = FastAPI()

app.include_router(user_routes.router, prefix="/api", tags=["Users"])


@app.get("/")
def read_root():
    return {"message": "Hello World"}
