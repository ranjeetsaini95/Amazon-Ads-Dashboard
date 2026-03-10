import os

# Supabase
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

# Amazon OAuth
AMAZON_CLIENT_ID = os.environ["AMAZON_CLIENT_ID"]
AMAZON_CLIENT_SECRET = os.environ["AMAZON_CLIENT_SECRET"]

# OAuth Redirect
AMAZON_REDIRECT_URI = "https://ranjeetsaini95.github.io/amazon-ads-dashboard/callback.html"

# Amazon Ads API endpoint
AMAZON_ADS_BASE_URL = "https://advertising-api.amazon.com"

# Amazon OAuth endpoint
AMAZON_OAUTH_TOKEN_URL = "https://api.amazon.com/auth/o2/token"
