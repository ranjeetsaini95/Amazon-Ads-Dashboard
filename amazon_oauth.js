import { AMAZON_CLIENT_ID } from "./config.js"

function connectAmazon(){

  const redirectUri =
    "https://ranjeetsaini9599.github.io/amazon-ads-dashboard/callback.html"

  const url =
    "https://www.amazon.com/ap/oa?" +
    "client_id=" + AMAZON_CLIENT_ID +
    "&scope=advertising::campaign_management" +
    "&response_type=code" +
    "&redirect_uri=" + encodeURIComponent(redirectUri)

  console.log("Redirecting to Amazon OAuth:", url)

  window.location.href = url
}

// expose function to HTML
window.connectAmazon = connectAmazon
