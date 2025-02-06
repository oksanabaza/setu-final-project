from fastapi import FastAPI, HTTPException, Depends
from backend.routes import user_routes, login_routes
# import models
from . import database, models, schemas,crud
from sqlalchemy.orm import Session

app = FastAPI()

models.Base.metadata.create_all(bind=database.engine)

app.include_router(user_routes.router, prefix="/api", tags=["Users"])

app.include_router(login_routes.router, prefix="/api", tags=["Auth"])

@app.get("/")
def read_root():
    return {"message": "Hello World"}
