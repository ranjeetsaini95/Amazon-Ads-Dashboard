const API_URL = "https://bhwwiyrxhvrscnhzvych.supabase.co/rest/v1/dashboard_metrics"
async function loadDashboard(){

const response = await fetch(API_URL)

const data = await response.json()

const d = data[0]

let acos = ((d.spend / d.sales) * 100).toFixed(2)

document.getElementById("sales").innerText = d.sales
document.getElementById("spend").innerText = d.spend
document.getElementById("orders").innerText = d.orders
document.getElementById("clicks").innerText = d.clicks
document.getElementById("impressions").innerText = d.impressions
document.getElementById("acos").innerText = acos + "%"

}

loadDashboard()
