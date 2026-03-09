import { AMAZON_CLIENT_ID } from "./config.js"

function connectAmazon(){

  const redirectUri = window.location.origin + "/amazon-ads-dashboard/callback.html"

  const url =
    "https://www.amazon.com/ap/oa?" +
    "client_id=" + AMAZON_CLIENT_ID +
    "&scope=advertising::campaign_management" +
    "&response_type=code" +
    "&redirect_uri=" + encodeURIComponent(redirectUri)

  console.log("Redirecting to Amazon:", url)

  window.location.href = url
}

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("connectAmazonBtn")

  if(btn){
    btn.addEventListener("click", connectAmazon)
  }

})
