import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js"

console.log("🚀 Dashboard script loaded")

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function loadDashboard(){

console.log("🔎 Getting session")

const { data:{ session }, error:sessionError } = await supabase.auth.getSession()

console.log("SESSION", session)
console.error("SESSION ERROR", sessionError)

if(!session){
alert("Please login again")
window.location.href="../index.html"
return
}

const userId = session.user.id

console.log("USER ID", userId)

/* fetch client */

const { data:clientData, error:clientError } = await supabase
.from("clients")
.select("id")
.eq("user_id", userId)

console.log("CLIENT DATA", clientData)
console.error("CLIENT ERROR", clientError)

if(!clientData || clientData.length===0){
alert("Client not found")
return
}

const clientId = clientData[0].id

console.log("CLIENT ID", clientId)

/* fetch active profiles */

const { data:profiles, error:profileError } = await supabase
.from("amazon_profiles")
.select("*")
.eq("client_id", clientId)
.eq("is_active", true)

console.log("ACTIVE PROFILES", profiles)
console.error("PROFILE ERROR", profileError)

const switcher = document.getElementById("accountSwitcher")

profiles.forEach(profile=>{

console.log("Adding profile to switcher", profile)

const option=document.createElement("option")

option.value=profile.profile_id

option.text=profile.account_name+" ("+profile.country_code+")"

switcher.appendChild(option)

})

if(profiles.length>0){

localStorage.setItem("active_profile",profiles[0].profile_id)

console.log("Default active profile",profiles[0].profile_id)

}

}

/* account switching */

document.getElementById("accountSwitcher").addEventListener("change",(e)=>{

const profileId=e.target.value

console.log("PROFILE SWITCHED",profileId)

localStorage.setItem("active_profile",profileId)

})

/* refresh button */

document.getElementById("refreshBtn").addEventListener("click",()=>{

console.log("REFRESH CLICKED")

const profile=localStorage.getItem("active_profile")

console.log("ACTIVE PROFILE",profile)

})

loadDashboard()
