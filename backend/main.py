from fastapi import FastAPI, HTTPException, Depends
from .crud import crud
from backend.models import models
from backend.routes import user_routes, login_routes, signup_routes, protected_routes
from .schemas import schemas
# import models
from . import database
from sqlalchemy.orm import Session
from backend.auth import get_current_user
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

models.Base.metadata.create_all(bind=database.engine)

app.include_router(signup_routes.router)

app.include_router(user_routes.router, prefix="/api", tags=["Users"])

app.include_router(login_routes.router, prefix="/api", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

app.include_router(protected_routes.router, dependencies=[Depends(get_current_user)])