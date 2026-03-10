from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from supabase import create_client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ranjeetsaini95.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return Response(status_code=200)

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

    try:

        # ---------------------------
        # 1️⃣ Find client
        # ---------------------------
        client = supabase.table("clients") \
            .select("id") \
            .eq("user_id", data.user_id) \
            .single() \
            .execute()

        client_id = client.data["id"]

        # ---------------------------
        # 2️⃣ Exchange auth code
        # ---------------------------
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
        refresh_token = token["refresh_token"]

        # ---------------------------
        # 3️⃣ Save refresh token
        # ---------------------------
        supabase.table("amazon_tokens").upsert({
            "client_id": client_id,
            "refresh_token": refresh_token
        }).execute()

        # ---------------------------
        # 4️⃣ Fetch profiles
        # ---------------------------
        profiles_response = requests.get(
            "https://advertising-api.amazon.com/v2/profiles",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Amazon-Advertising-API-ClientId": AMAZON_CLIENT_ID
            }
        )

        profiles = profiles_response.json()

        # ---------------------------
        # 5️⃣ Insert profiles
        # ---------------------------
for profile in profiles:

    country = profile.get("countryCode")

    # Region detection
    if country in ["US", "CA", "MX", "BR"]:
        region = "NA"
    elif country in ["UK", "DE", "FR", "IT", "ES", "NL", "SE", "PL"]:
        region = "EU"
    else:
        region = "FE"

    supabase.table("amazon_profiles").upsert({
        "client_id": client_id,
        "profile_id": profile["profileId"],
        "country_code": country,
        "marketplace": country,
        "currency": profile.get("currencyCode"),
        "account_entity_id": profile.get("accountInfo", {}).get("id"),
        "account_name": profile.get("accountInfo", {}).get("name"),
        "timezone": profile.get("timezone"),
        "region": region,
        "is_active": False
    }).on_conflict="profile_id").execute()

        return {
            "status": "success",
            "profiles_found": len(profiles)
        }

    except Exception as e:
        return {"error": str(e)}
