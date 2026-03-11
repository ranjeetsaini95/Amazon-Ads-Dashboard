import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js"
import { setActiveProfile, getActiveProfile } from "./context.js"

console.log("🚀 Dashboard loaded")

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let chart


async function loadDashboard(){

console.log("Checking session")

const { data:{ session } } = await supabase.auth.getSession()

if(!session){

window.location.href="../index.html"
return

}

const userId = session.user.id


/* CLIENT */

const { data:clientData } = await supabase
.from("clients")
.select("id")
.eq("user_id",userId)

const clientId = clientData[0].id


/* PROFILES */

const { data:profiles } = await supabase
.from("amazon_profiles")
.select("*")
.eq("client_id",clientId)
.eq("is_active",true)

const switcher=document.getElementById("accountSwitcher")

profiles.forEach(profile=>{

const option=document.createElement("option")

option.value=profile.profile_id

option.text=profile.account_name+" ("+profile.country_code+")"

switcher.appendChild(option)

})


let activeProfile=getActiveProfile()

if(!activeProfile){

activeProfile=profiles[0].profile_id

setActiveProfile(activeProfile)

}

switcher.value=activeProfile

loadData()

}



/* LOAD DATA */

async function loadData(){

console.log("Loading dashboard data")

const profileId=getActiveProfile()

const startDate=document.getElementById("startDate").value
const endDate=document.getElementById("endDate").value

console.log("PROFILE",profileId)
console.log("DATE RANGE",startDate,endDate)


const { data, error } = await supabase
.from("campaign_reports")
.select("*")
.eq("profile_id",profileId)

if(error){

console.error("DB ERROR",error)
return

}

console.log("REPORT DATA",data)

updateKPI(data)
updateChart(data)
updateCampaignTable(data)

}



/* KPI */

function updateKPI(data){

let sales=0
let spend=0
let orders=0
let clicks=0

data.forEach(row=>{

sales+=Number(row.sales_7d || 0)
spend+=Number(row.cost || 0)
orders+=Number(row.orders_7d || 0)
clicks+=Number(row.clicks || 0)

})

const acos = sales>0 ? (spend/sales)*100 : 0

document.getElementById("sales").innerText="$"+sales.toFixed(2)
document.getElementById("spend").innerText="$"+spend.toFixed(2)
document.getElementById("orders").innerText=orders
document.getElementById("clicks").innerText=clicks
document.getElementById("acos").innerText=acos.toFixed(2)+"%"
document.getElementById("tacos").innerText="--"

}



/* CHART */

function updateChart(data){

const grouped={}

data.forEach(row=>{

const date=row.report_date

if(!grouped[date]){

grouped[date]={sales:0,spend:0}

}

grouped[date].sales+=Number(row.sales_7d || 0)
grouped[date].spend+=Number(row.cost || 0)

})

const labels=Object.keys(grouped).sort()

const sales=labels.map(d=>grouped[d].sales)
const spend=labels.map(d=>grouped[d].spend)

const ctx=document.getElementById("performanceChart")

if(chart){

chart.destroy()

}

chart=new Chart(ctx,{

type:"line",

data:{

labels:labels,

datasets:[

{
label:"Sales",
data:sales,
borderColor:"#4CAF50",
tension:0.3
},

{
label:"Spend",
data:spend,
borderColor:"#FF9800",
tension:0.3
}

]

}

})

}



/* CAMPAIGN TABLE */

function updateCampaignTable(data){

const campaigns={}

data.forEach(row=>{

const id=row.campaign_id

if(!campaigns[id]){

campaigns[id]={

name:row.campaign_name,
sales:0,
spend:0,
orders:0,
clicks:0

}

}

campaigns[id].sales+=Number(row.sales_7d||0)
campaigns[id].spend+=Number(row.cost||0)
campaigns[id].orders+=Number(row.orders_7d||0)
campaigns[id].clicks+=Number(row.clicks||0)

})

const tbody=document.querySelector("#campaignTable tbody")

tbody.innerHTML=""

Object.values(campaigns).forEach(c=>{

const acos=c.sales>0?(c.spend/c.sales)*100:0

const row=document.createElement("tr")

row.innerHTML=`

<td>${c.name}</td>
<td>$${c.spend.toFixed(2)}</td>
<td>$${c.sales.toFixed(2)}</td>
<td>${acos.toFixed(2)}%</td>
<td>${c.clicks}</td>
<td>${c.orders}</td>

`

tbody.appendChild(row)

})

}



/* SWITCH ACCOUNT */

document.getElementById("accountSwitcher").addEventListener("change",(e)=>{

setActiveProfile(e.target.value)

loadData()

})



/* REFRESH */

document.getElementById("refreshBtn").addEventListener("click",()=>{

loadData()

})



loadDashboard()
