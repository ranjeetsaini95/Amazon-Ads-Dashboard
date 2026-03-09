import requests
import os

AMAZON_CLIENT_ID = os.environ["AMAZON_CLIENT_ID"]
AMAZON_CLIENT_SECRET = os.environ["AMAZON_CLIENT_SECRET"]

def exchange_code(code):

    url = "https://api.amazon.com/auth/o2/token"

    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": AMAZON_CLIENT_ID,
        "client_secret": AMAZON_CLIENT_SECRET,
        "redirect_uri": "https://ranjeetsaini95.github.io/amazon-ads-dashboard/callback.html"
    }

    response = requests.post(url, data=payload)

    return response.json()
