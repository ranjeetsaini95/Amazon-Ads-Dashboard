import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js"
import { setActiveProfile } from "./context.js"

console.log("🚀 Dashboard script loaded")

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function loadDashboard(){

console.log("🔎 Checking session")

const { data:{ session }, error:sessionError } = await supabase.auth.getSession()

console.log("SESSION:", session)
console.error("SESSION ERROR:", sessionError)

if(!session){

alert("Please login again")

window.location.href="../index.html"

return

}

const userId = session.user.id

console.log("USER ID:", userId)


/* -----------------------------
FETCH CLIENT
------------------------------ */

console.log("🔎 Fetching client")

const { data:clientData, error:clientError } = await supabase
.from("clients")
.select("id")
.eq("user_id", userId)

console.log("CLIENT DATA:", clientData)
console.error("CLIENT ERROR:", clientError)

if(!clientData || clientData.length===0){

alert("Client not found")

return

}

const clientId = clientData[0].id

console.log("CLIENT ID:", clientId)


/* -----------------------------
FETCH ACTIVE PROFILES
------------------------------ */

console.log("🔎 Fetching active profiles")

const { data:profiles, error:profileError } = await supabase
.from("amazon_profiles")
.select("*")
.eq("client_id", clientId)
.eq("is_active", true)

console.log("ACTIVE PROFILES:", profiles)
console.error("PROFILE ERROR:", profileError)

const switcher = document.getElementById("accountSwitcher")

if(!profiles || profiles.length===0){

console.warn("⚠️ No active profiles found")

switcher.innerHTML = "<option>No profiles activated</option>"

return

}


/* -----------------------------
POPULATE ACCOUNT SWITCHER
------------------------------ */

profiles.forEach(profile=>{

console.log("Adding profile:", profile)

const option = document.createElement("option")

option.value = profile.profile_id

option.text = profile.account_name + " (" + profile.country_code + ")"

switcher.appendChild(option)

})


/* -----------------------------
SET DEFAULT ACTIVE PROFILE
------------------------------ */

const firstProfile = profiles[0].profile_id

setActiveProfile(firstProfile)

console.log("Default active profile:", firstProfile)

}


/* -----------------------------
ACCOUNT SWITCHING
------------------------------ */

document.getElementById("accountSwitcher").addEventListener("change",(e)=>{

const profileId = e.target.value

console.log("🔁 Profile switched:", profileId)

localStorage.setItem("active_profile", profileId)

})


/* -----------------------------
REFRESH BUTTON
------------------------------ */

document.getElementById("refreshBtn").addEventListener("click",()=>{

console.log("🔄 Refresh clicked")

const profile = localStorage.getItem("active_profile")

console.log("ACTIVE PROFILE:", profile)

})


loadDashboard()
