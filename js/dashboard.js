import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js"
import { setActiveProfile, getActiveProfile } from "./context.js"

console.log("🚀 Dashboard loaded")

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



async function loadDashboard(){

console.log("🔎 Checking session")

const { data:{ session }, error } = await supabase.auth.getSession()

console.log("SESSION",session)

if(!session){

alert("Login required")

window.location.href="../index.html"

return

}

const userId = session.user.id

console.log("USER ID",userId)



/* CLIENT */

const { data:clientData } = await supabase
.from("clients")
.select("id")
.eq("user_id",userId)

console.log("CLIENT DATA",clientData)

const clientId = clientData[0].id



/* PROFILES */

const { data:profiles } = await supabase
.from("amazon_profiles")
.select("*")
.eq("client_id",clientId)
.eq("is_active",true)

console.log("ACTIVE PROFILES",profiles)

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

console.log("ACTIVE PROFILE",activeProfile)



loadChart()

loadMockKPI()

loadMockTable()

}



/* ACCOUNT SWITCH */

document.getElementById("accountSwitcher").addEventListener("change",(e)=>{

const profileId=e.target.value

console.log("PROFILE SWITCHED",profileId)

setActiveProfile(profileId)

})



/* REFRESH */

document.getElementById("refreshBtn").addEventListener("click",()=>{

console.log("REFRESH CLICKED")

loadChart()

loadMockKPI()

})



/* KPI MOCK DATA */

function loadMockKPI(){

console.log("Loading KPI data")

document.getElementById("sales").innerText="$12,430"

document.getElementById("spend").innerText="$3,200"

document.getElementById("orders").innerText="210"

document.getElementById("acos").innerText="25.7%"

document.getElementById("tacos").innerText="9.8%"

document.getElementById("clicks").innerText="5,300"

}



/* CHART */

function loadChart(){

console.log("Loading chart")

const ctx=document.getElementById("performanceChart")

new Chart(ctx,{

type:"line",

data:{

labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],

datasets:[

{
label:"Sales",
data:[120,190,300,250,320,280,350],
borderColor:"#4CAF50",
tension:0.3
},

{
label:"Spend",
data:[80,110,150,140,170,160,200],
borderColor:"#FF9800",
tension:0.3
}

]

}

})

}



/* TABLE */

function loadMockTable(){

console.log("Loading campaign table")

const tbody=document.querySelector("#campaignTable tbody")

tbody.innerHTML=""

const row=document.createElement("tr")

row.innerHTML=`
<td>Auto Campaign</td>
<td>$120</td>
<td>$500</td>
<td>24%</td>
<td>300</td>
<td>40</td>
`

tbody.appendChild(row)

}



loadDashboard()
