from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from supabase import create_client

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

AMAZON_CLIENT_ID = os.environ["AMAZON_CLIENT_ID"]
AMAZON_CLIENT_SECRET = os.environ["AMAZON_CLIENT_SECRET"]

REDIRECT_URI = "https://ranjeetsaini95.github.io/amazon-ads-dashboard/callback.html"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

class AuthRequest(BaseModel):
    code: str
    user_id: str


@app.post("/exchange-token")
def exchange_token(data: AuthRequest):

    token_response = requests.post(
        "https://api.amazon.com/auth/o2/token",
        data={
            "grant_type": "authorization_code",
            "code": data.code,
            "client_id": AMAZON_CLIENT_ID,
            "client_secret": AMAZON_CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI
        }
    )

    token = token_response.json()

    access_token = token.get("access_token")

    profiles_response = requests.get(
        "https://advertising-api.amazon.com/v2/profiles",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Amazon-Advertising-API-ClientId": AMAZON_CLIENT_ID
        }
    )

    profiles = profiles_response.json()

    for profile in profiles:

        supabase.table("amazon_profiles").insert({
            "client_id": data.user_id,
            "profile_id": profile["profileId"],
            "country_code": profile.get("countryCode"),
            "marketplace": profile.get("countryCode"),
            "currency": profile.get("currencyCode"),
            "account_entity_id": profile.get("accountInfo", {}).get("id"),
            "account_name": profile.get("accountInfo", {}).get("name"),
            "timezone": profile.get("timezone")
        }).execute()

    return {"profiles_imported": len(profiles)}
