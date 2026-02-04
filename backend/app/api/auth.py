from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.core import security
from jose import JWTError, jwt

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    # Check Admin first
    admin_user = db.query(models.Admin).filter(models.Admin.email == token_data.username).first()
    if admin_user:
        return admin_user
    
    # Then User
    user = db.query(models.User).filter(models.User.email == token_data.username).first()
    if not user:
        user = db.query(models.User).filter(models.User.full_name == token_data.username).first()
    
    if user is None:
        raise credentials_exception
    return user

def get_current_active_admin(current_user = Depends(get_current_user)):
    # If it's an instance of Admin model, it's an admin
    if isinstance(current_user, models.Admin):
        return current_user
    # If it's a User model, check is_admin flag (legacy or dual-role support)
    if isinstance(current_user, models.User) and current_user.is_admin:
        return current_user
        
    raise HTTPException(status_code=400, detail="The user doesn't have enough privileges")

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check for existing email in User table
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    
    # Always register as User, using is_admin flag for admin privileges
    new_user = models.User(
        email=user.email,
        full_name=user.username,
        hashed_password=hashed_password,
        is_admin=user.is_admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Try Admin login
    admin_user = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    if admin_user and security.verify_password(form_data.password, admin_user.password_hash):
        access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_access_token(
            data={"sub": admin_user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    # 2. Try User login
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user:
        user = db.query(models.User).filter(models.User.full_name == form_data.username).first()
        
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
