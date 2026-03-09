import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
'https://bhwwiyrxhvrscnhzvych.supabase.co',
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJod3dpeXJ4aHZyc2NuaHp2eWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzM0NTgsImV4cCI6MjA4ODMwOTQ1OH0.6Cl-U5HuzFs2A7leRBBmz7514RtPEtCcWJLcUrbLnV4'
)

async function signup(){

const email = document.getElementById("email").value
const password = document.getElementById("password").value

const { error } = await supabase.auth.signUp({
email,
password
})

if(error){
alert(error.message)
}else{
alert("Account created")
}

}

async function login(){

const email = document.getElementById("email").value
const password = document.getElementById("password").value

const { error } = await supabase.auth.signInWithPassword({
email,
password
})

if(error){
alert(error.message)
}else{
window.location.href = "dashboard.html"
}

}
