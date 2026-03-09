import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js"

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

window.signup = async function(){

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })

  if(error){
    alert(error.message)
  } else {
    alert("Signup successful. You can now login.")
  }

}

window.login = async function(){

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })

  if(error){
    alert(error.message)
  } else {

    window.location.href = "dashboard.html"

  }

}
