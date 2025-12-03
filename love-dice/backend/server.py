from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import random
from pydantic import BaseModel, EmailStr, Field, ConfigDict

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# backend api server
# connects to mongodb
# serves json api
# sections: imports, db, helpers, routes

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")



# helper functions
# hash_password hashes user password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


MALE_DARES = [
    "Compliment their outfit within the first 5 minutes",
    "Subtly wink twice during conversation",
    "Mention your favorite childhood movie",
    "Order something adventurous on the menu",
    "Make them laugh with a dad joke",
    "Share an embarrassing story from high school"
]

# changeable sample dares

FEMALE_DARES = [
    "Play with your hair while listening to them talk",
    "Compliment something unexpected about them",
    "Laugh at their jokes (even the bad ones)",
    "Share your most controversial food opinion",
    "Ask about their hidden talent",
    "Subtly touch their arm during conversation"
]

 
# models (data shapes)
# classes define data shape
# pydantic validates data
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str
    gender: str  # male or female

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    gender: str
    friends: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class DateProposalCreate(BaseModel):
    target_username: str
    proposed_match_name: str
    stakes: str

class DateProposal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    proposer_id: str
    proposer_username: str
    target_user_id: str
    target_username: str
    proposed_match_name: str
    stakes: str
    status: str = "pending"  # pending, accepted, declined, completed
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
class BetCreate(BaseModel):
    proposal_id: str
    bet_description: str
    stake: str
    is_hidden: bool = False

class Bet(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    proposal_id: str
    bet_creator_id: str
    bet_creator_username: str
    bet_description: str
    stake: str
    is_hidden: bool
    completed: bool = False
    won: Optional[bool] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@api_router.post("/auth/signup")
async def signup(user_data: UserSignup):
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user = User(
        username=user_data.username,
        email=user_data.email,
        gender=user_data.gender
    )
    
    user_dict = user.model_dump()
    user_dict["password_hash"] = hash_password(user_data.password)
    
    await db.users.insert_one(user_dict)
    
    token = create_access_token({"sub": user.id, "username": user.username})
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "gender": user.gender
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"username": credentials.username}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["id"], "username": user["username"]})
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "gender": user["gender"]
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "gender": current_user["gender"]
    }

@api_router.post("/proposals", response_model=DateProposal)
async def create_proposal(proposal: DateProposalCreate, current_user: dict = Depends(get_current_user)):
    # find target user
    target_user = await db.users.find_one({"username": proposal.target_username}, {"_id": 0})
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found")
    
    new_proposal = DateProposal(
        proposer_id=current_user["id"],
        proposer_username=current_user["username"],
        target_user_id=target_user["id"],
        target_username=target_user["username"],
        proposed_match_name=proposal.proposed_match_name,
        stakes=proposal.stakes
    )
    
    await db.proposals.insert_one(new_proposal.model_dump())
    return new_proposal

@api_router.get("/proposals", response_model=List[DateProposal])
async def get_proposals(current_user: dict = Depends(get_current_user)):
    # get proposals for user
    proposals = await db.proposals.find({
        "$or": [
            {"target_user_id": current_user["id"]},
            {"proposer_id": current_user["id"]}
        ]
    }, {"_id": 0}).to_list(1000)
    return proposals

@api_router.put("/proposals/{proposal_id}/accept")
async def accept_proposal(proposal_id: str, current_user: dict = Depends(get_current_user)):
    proposal = await db.proposals.find_one({"id": proposal_id, "target_user_id": current_user["id"]}, {"_id": 0})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    await db.proposals.update_one(
        {"id": proposal_id},
        {"$set": {"status": "accepted"}}
    )
    
    return {"message": "Proposal accepted"}

@api_router.put("/proposals/{proposal_id}/decline")
async def decline_proposal(proposal_id: str, current_user: dict = Depends(get_current_user)):
    proposal = await db.proposals.find_one({"id": proposal_id, "target_user_id": current_user["id"]}, {"_id": 0})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    await db.proposals.update_one(
        {"id": proposal_id},
        {"$set": {"status": "declined"}}
    )
    
    return {"message": "Proposal declined"}
@api_router.post("/bets", response_model=Bet)
async def create_bet(bet: BetCreate, current_user: dict = Depends(get_current_user)):
    # verify proposal exists
    proposal = await db.proposals.find_one({"id": bet.proposal_id}, {"_id": 0})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    new_bet = Bet(
        proposal_id=bet.proposal_id,
        bet_creator_id=current_user["id"],
        bet_creator_username=current_user["username"],
        bet_description=bet.bet_description,
        stake=bet.stake,
        is_hidden=bet.is_hidden
    )
    
    await db.bets.insert_one(new_bet.model_dump())
    return new_bet

@api_router.get("/bets/{proposal_id}", response_model=List[Bet])
async def get_bets(proposal_id: str, current_user: dict = Depends(get_current_user)):
    bets = await db.bets.find({"proposal_id": proposal_id}, {"_id": 0}).to_list(1000)
    # filter hidden bets
    visible_bets = [
        bet for bet in bets 
        if not bet["is_hidden"] or bet["bet_creator_id"] == current_user["id"]
    ]
    return visible_bets
@api_router.put("/bets/{bet_id}/complete")
async def complete_bet(bet_id: str, won: bool, current_user: dict = Depends(get_current_user)):
    bet = await db.bets.find_one({"id": bet_id}, {"_id": 0})
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    
    await db.bets.update_one(
        {"id": bet_id},
        {"$set": {"completed": True, "won": won}}
    )
    return {"message": "Bet completed"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()