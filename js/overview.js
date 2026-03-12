import { supabase } from "./supabase.js"
import { getActiveProfile } from "./context.js"

async function loadOverview(){

const profile = Number(getActiveProfile())

const { data } = await supabase
.from("campaign_reports")
.select("cost,sales_7d,orders_7d,clicks,impressions")
.eq("profile_id", profile)

let spend=0
let sales=0
let orders=0
let clicks=0
let impressions=0

data.forEach(r=>{

spend+=Number(r.cost||0)
sales+=Number(r.sales_7d||0)
orders+=Number(r.orders_7d||0)
clicks+=Number(r.clicks||0)
impressions+=Number(r.impressions||0)

})

const cpc = spend/clicks
const ctr = clicks/impressions*100
const cvr = orders/clicks*100

document.getElementById("spend").innerText="$"+spend.toFixed(2)
document.getElementById("sales").innerText="$"+sales.toFixed(2)
document.getElementById("orders").innerText=orders
document.getElementById("clicks").innerText=clicks
document.getElementById("impressions").innerText=impressions
document.getElementById("cpc").innerText="$"+cpc.toFixed(2)
document.getElementById("ctr").innerText=ctr.toFixed(2)+"%"
document.getElementById("cvr").innerText=cvr.toFixed(2)+"%"

}

loadOverview()
