from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from supabase import create_client

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ENV VARIABLES
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
AMAZON_CLIENT_ID = os.environ["AMAZON_CLIENT_ID"]
AMAZON_CLIENT_SECRET = os.environ["AMAZON_CLIENT_SECRET"]

REDIRECT_URI = "https://ranjeetsaini95.github.io/amazon-ads-dashboard/callback.html"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


class AuthRequest(BaseModel):
    code: str
    user_id: str


@app.options("/exchange-token")
def options_exchange():
    return {"status": "ok"}


@app.post("/exchange-token")
def exchange_token(data: AuthRequest):

    try:

        # -------------------------------
        # Find client record
        # -------------------------------
        client = supabase.table("clients") \
            .select("id") \
            .eq("user_id", data.user_id) \
            .single() \
            .execute()

        client_id = client.data["id"]

        # -------------------------------
        # Exchange auth code for token
        # -------------------------------
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

        if "access_token" not in token:
            return {"error": token}

        access_token = token["access_token"]

        # -------------------------------
        # Fetch Amazon advertising profiles
        # -------------------------------
        profiles_response = requests.get(
            "https://advertising-api.amazon.com/v2/profiles",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Amazon-Advertising-API-ClientId": AMAZON_CLIENT_ID
            }
        )

        profiles = profiles_response.json()

        # -------------------------------
        # Save profiles to Supabase
        # -------------------------------
        for profile in profiles:

            supabase.table("amazon_profiles").insert({
                "client_id": client_id,
                "profile_id": profile["profileId"],
                "country_code": profile.get("countryCode"),
                "marketplace": profile.get("countryCode"),
                "currency": profile.get("currencyCode"),
                "account_entity_id": profile.get("accountInfo", {}).get("id"),
                "account_name": profile.get("accountInfo", {}).get("name"),
                "timezone": profile.get("timezone")
            }).execute()

        return {
            "status": "success",
            "profiles_imported": len(profiles)
        }

    except Exception as e:
        return {"error": str(e)}
