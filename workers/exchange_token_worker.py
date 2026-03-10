import requests
from supabase import create_client
from config import *

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def run():

    rows = supabase.table("amazon_auth_codes") \
        .select("*") \
        .eq("status", "pending") \
        .execute()

    for row in rows.data:

        code = row["auth_code"]
        user_id = row["user_id"]

        print("Processing auth code")

        token_response = requests.post(
            AMAZON_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": AMAZON_CLIENT_ID,
                "client_secret": AMAZON_CLIENT_SECRET,
                "redirect_uri": AMAZON_REDIRECT_URI
            }
        )

        token = token_response.json()

        access_token = token.get("access_token")
        refresh_token = token.get("refresh_token")

        if not refresh_token:
            print("Token exchange failed")
            continue

        print("Token exchange success")

        profiles_response = requests.get(
            f"{AMAZON_ADS_API}/v2/profiles",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Amazon-Advertising-API-ClientId": AMAZON_CLIENT_ID
            }
        )

        profiles = profiles_response.json()

        print("Profiles fetched:", len(profiles))

        for profile in profiles:

            supabase.table("amazon_profiles").insert({

                "client_id": user_id,
                "profile_id": profile["profileId"],
                "country_code": profile.get("countryCode"),
                "marketplace": profile.get("countryCode"),
                "currency": profile.get("currencyCode"),
                "account_entity_id": profile.get("accountInfo", {}).get("id"),
                "account_name": profile.get("accountInfo", {}).get("name"),
                "timezone": profile.get("timezone"),
                "status": "pending"

            }).execute()

        supabase.table("amazon_auth_codes") \
            .update({"status": "processed"}) \
            .eq("id", row["id"]) \
            .execute()

        print("Auth code processed successfully")


if __name__ == "__main__":
    run()
