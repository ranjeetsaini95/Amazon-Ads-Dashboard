console.log("🌍 Global context loaded")

/* -----------------------------
GET ACTIVE PROFILE
------------------------------ */

export function getActiveProfile(){

const profile = localStorage.getItem("active_profile")

console.log("ACTIVE PROFILE FROM STORAGE:", profile)

return profile

}


/* -----------------------------
SET ACTIVE PROFILE
------------------------------ */

export function setActiveProfile(profileId){

console.log("SETTING ACTIVE PROFILE:", profileId)

localStorage.setItem("active_profile", profileId)

}


/* -----------------------------
CLEAR ACTIVE PROFILE
------------------------------ */

export function clearActiveProfile(){

console.log("CLEARING ACTIVE PROFILE")

localStorage.removeItem("active_profile")

}
